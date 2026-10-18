const Gn=`from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Protocol

Tensor = Any
KVTensor = tuple[Tensor, Tensor]  # packed (k, v) pair
TOKENS_PER_BLOCK = 4


@dataclass
class KVBlock:
    """One fixed-size physical block of cached K/V pairs."""

    block_id: int
    refs: int = 1
    slots: list[KVTensor | None] = field(
        default_factory=lambda: [None] * TOKENS_PER_BLOCK
    )

    @property
    def fill(self) -> int:
        """Number of occupied slots in this block."""
        return sum(slot is not None for slot in self.slots)


@dataclass
class Sequence:
    """One request's token state and logical-to-physical block table."""

    tokens: list[int]
    block_table: list[int] = field(default_factory=list)
    num_tokens: int = 0
    state: str = "waiting"    # waiting -> decoding -> finished
    block_pool: BlockPool | None = None
    max_new_tokens: int = 1
    produced: int = 0
    next_token: int = 0
    request_id: str = ""
    prompt_len: int = 0

    @property
    def is_prefill(self) -> bool:
        """True while the prompt still has unprocessed tokens."""
        return self.state == "waiting"

    @property
    def finished(self) -> bool:
        """True after EOS or the max-new-token limit."""
        return self.state == "finished"

    async def prefill(self, chunk_size: int) -> None:
        """Process up to chunk_size prompt tokens and append their KV."""
        from .paged_attention import append_kv

        if self.block_pool is None:
            raise RuntimeError("sequence has no block pool")
        while self.num_tokens < len(self.tokens):
            end = min(self.num_tokens + chunk_size, len(self.tokens))
            while self.num_tokens < end:
                token_id = self.tokens[self.num_tokens]
                append_kv(self, project_kv(token_id), self.block_pool)
        self.state = "decoding"

    async def decode(self) -> None:
        """Generate one token and append its KV; update finished state."""
        from .paged_attention import append_kv

        if self.finished:
            return
        if self.block_pool is None:
            raise RuntimeError("sequence has no block pool")
        token_id = self.next_token + self.produced
        self.tokens.append(token_id)
        append_kv(self, project_kv(token_id), self.block_pool)
        self.produced += 1
        self.state = "finished" if self.produced >= self.max_new_tokens else "decoding"


def project_kv(token_id: int) -> KVTensor:
    """Toy projection: one deterministic (k, v) pair per token."""
    return (token_id, token_id * 2 + 1)


class BlockPool(Protocol):
    """Allocator and refcount owner for physical KV blocks."""

    def __getitem__(self, block_id: int) -> KVBlock: ...
    def allocate_block(self) -> int: ...
    def retain_blocks(self, block_ids: list[int]) -> None: ...
    def free_block(self, block_id: int) -> None: ...
    def free_sequence(self, sequence: Sequence) -> None: ...
    def can_allocate(self, sequence: Sequence) -> bool: ...


@dataclass
class RadixNode:
    """One radix-tree edge: a token range and the KV blocks covering it."""

    token_ids: list[int]
    block_ids: list[int]
    children: dict[int, "RadixNode"]
    ref_count: int = 0
    last_access_time: int = 0
`,Qn=`from .core_objects import (
    BlockPool,
    KVBlock,
    KVTensor,
    Sequence,
    TOKENS_PER_BLOCK,
)


def copy_block(source: KVBlock, target: KVBlock) -> None:
    """Copy cached slots from one physical block into another."""
    target.slots = list(source.slots)


def ensure_writable_block(
    sequence: Sequence,
    logical_block: int,
    block_pool: BlockPool,
) -> int:
    """Return a block safe to modify; copy only if it is shared."""
    block_id = sequence.block_table[logical_block]
    block = block_pool[block_id]

    # Fast path: a private block can be written in place.
    if block.refs == 1:
        return block_id

    private_id = block_pool.allocate_block()
    copy_block(source=block, target=block_pool[private_id])
    block.refs -= 1
    sequence.block_table[logical_block] = private_id
    return private_id


def write_kv(
    sequence: Sequence,
    logical_block: int,
    token_position: int,
    kv: KVTensor,
    block_pool: BlockPool,
) -> None:
    """Write one packed KV pair into a logical block, copying it if shared."""
    block_id = ensure_writable_block(
        sequence=sequence,
        logical_block=logical_block,
        block_pool=block_pool,
    )
    block_pool[block_id].slots[token_position % TOKENS_PER_BLOCK] = kv


def append_kv(
    sequence: Sequence,
    kv: KVTensor,
    block_pool: BlockPool,
) -> None:
    """Append one packed KV pair at the sequence's next token position."""
    # Cross a block boundary. The block may already be reserved by a
    # prefill worker; only allocate when the table is short.
    if sequence.num_tokens % TOKENS_PER_BLOCK == 0:
        logical_block = sequence.num_tokens // TOKENS_PER_BLOCK
        if logical_block == len(sequence.block_table):
            sequence.block_table.append(block_pool.allocate_block())

    logical_block = sequence.num_tokens // TOKENS_PER_BLOCK
    write_kv(
        sequence=sequence,
        logical_block=logical_block,
        token_position=sequence.num_tokens,
        kv=kv,
        block_pool=block_pool,
    )
    sequence.num_tokens += 1
`,Un=`from math import ceil

from .core_objects import BlockPool, RadixNode, TOKENS_PER_BLOCK


def longest_common_prefix(left: list[int], right: list[int]) -> int:
    """Length of the longest shared prefix between two token lists."""
    limit = min(len(left), len(right))
    matched = 0
    while matched < limit and left[matched] == right[matched]:
        matched += 1
    return matched


def split_edge(
    parent: RadixNode,
    node: RadixNode,
    prefix_length: int,
) -> RadixNode:
    """Split a compressed edge and return the shared-prefix node."""
    if prefix_length >= len(node.token_ids):
        return node
    suffix = node.token_ids[prefix_length:]
    original_blocks = node.block_ids
    split_block = prefix_length // TOKENS_PER_BLOCK

    child = RadixNode(
        token_ids=suffix,
        block_ids=original_blocks[split_block:],
        children=node.children,
        ref_count=node.ref_count,
        last_access_time=node.last_access_time,
    )
    node.token_ids = node.token_ids[:prefix_length]
    node.block_ids = original_blocks[: split_block + 1]
    node.children = {suffix[0]: child}
    parent.children[node.token_ids[0]] = node
    return node


def allocate_blocks(
    block_pool: BlockPool,
    token_count: int,
) -> list[int]:
    """Allocate enough physical blocks to cover a token suffix."""
    count = ceil(token_count / TOKENS_PER_BLOCK)
    return [block_pool.allocate_block() for _ in range(count)]


def match_prefix(
    root: RadixNode,
    token_ids: list[int],
) -> tuple[RadixNode, int]:
    """Return the deepest cached prefix node and its token count."""
    node, matched = root, 0
    while matched < len(token_ids):
        child = node.children.get(token_ids[matched])
        if child is None:
            break
        common = longest_common_prefix(
            left=child.token_ids,
            right=token_ids[matched:],
        )
        if common == 0:
            break
        if common < len(child.token_ids):
            child = split_edge(node, child, common)
        node, matched = child, matched + common
    return node, matched


def insert(
    node: RadixNode,
    token_ids: list[int],
    matched: int,
    block_ids: list[int],
) -> RadixNode:
    """Attach the uncached suffix below the matched node."""
    suffix = token_ids[matched:]
    if not suffix:
        return node
    child = RadixNode(
        token_ids=suffix,
        block_ids=block_ids[matched // TOKENS_PER_BLOCK:],
        children={},
    )
    node.children[suffix[0]] = child
    return child


class PrefixCache:
    """Block-aligned radix index over prompt prefixes."""

    def __init__(self) -> None:
        self.root = RadixNode(token_ids=[], block_ids=[], children={})

    def match(self, token_ids: list[int]) -> tuple[RadixNode, int]:
        return match_prefix(self.root, token_ids)

    def insert(self, token_ids: list[int], block_ids: list[int]) -> None:
        node, matched = self.match(token_ids)
        insert(node, token_ids, matched, block_ids)
`,Zn=`import asyncio
from collections import deque

from .core_objects import BlockPool, Sequence

PREFILL_CHUNK_SIZE = 256


async def advance(
    sequence: Sequence,
    block_pool: BlockPool,
) -> None:
    """Advance one sequence; await only its own phase."""
    if sequence.finished:
        return
    if sequence.is_prefill:
        await sequence.prefill(chunk_size=PREFILL_CHUNK_SIZE)
    else:
        await sequence.decode()
    # Retirement is the serving loop's job, after the result is delivered.


async def scheduler_loop(
    running: list[Sequence],
    waiting: deque[Sequence],
    block_pool: BlockPool,
) -> None:
    """Submit independent work and admit waiting requests each iteration."""
    while running or waiting:
        tasks = [
            asyncio.create_task(advance(sequence, block_pool))
            for sequence in running
            if not sequence.finished
        ]
        if tasks:
            await asyncio.gather(*tasks)

        while waiting and block_pool.can_allocate(waiting[0]):
            running.append(waiting.popleft())

        if not tasks and not waiting:
            break
        await asyncio.sleep(0)
`,$n=`import asyncio
from math import ceil

from .core_objects import BlockPool, Sequence
from .paged_attention import TOKENS_PER_BLOCK


async def prefill(
    prompt_token_ids: list[int],
    block_ids: list[int],
    block_pool: BlockPool,
) -> Sequence:
    """Run the prompt through the model and fill its KV blocks."""
    sequence = Sequence(
        tokens=prompt_token_ids,
        block_table=block_ids,
        block_pool=block_pool,
        state="waiting",
        prompt_len=len(prompt_token_ids),
    )
    await sequence.prefill(chunk_size=len(prompt_token_ids))
    return sequence


async def send_kv(block_ids: list[int], decode_worker: "DecodeWorker") -> None:
    """Send KV blocks and their table to a decode worker."""
    await asyncio.sleep(0)  # the transfer itself is device/network work
    decode_worker.block_ids = list(block_ids)


async def prefill_worker(
    prompt_token_ids: list[int],
    block_pool: BlockPool,
    decode_worker_handle: "DecodeWorker",
) -> tuple[Sequence, asyncio.Task]:
    """Prefill a prompt and start the KV transfer without blocking."""
    block_count = ceil(len(prompt_token_ids) / TOKENS_PER_BLOCK)
    block_ids = [block_pool.allocate_block() for _ in range(block_count)]
    sequence = await prefill(prompt_token_ids, block_ids, block_pool)
    transfer_task = asyncio.create_task(
        send_kv(block_ids=block_ids, decode_worker=decode_worker_handle)
    )
    return sequence, transfer_task


class DecodeWorker:
    """Receive a block table, then decode against the transferred KV."""

    def __init__(self, block_pool: BlockPool, max_new_tokens: int = 1) -> None:
        self.block_pool = block_pool
        self.max_new_tokens = max_new_tokens
        self.block_ids: list[int] = []

    async def run(self, transfer_task: asyncio.Task) -> Sequence:
        await transfer_task
        sequence = Sequence(
            tokens=[],
            block_table=list(self.block_ids),
            num_tokens=sum(self.block_pool[i].fill for i in self.block_ids),
            state="decoding",
            block_pool=self.block_pool,
            max_new_tokens=self.max_new_tokens,
        )
        while not sequence.finished:
            await sequence.decode()
        return sequence
`,ve={coreObjects:Gn.trim(),pagedAttention:Qn.trim(),radixAttention:Un.trim(),scheduler:Zn.trim(),handoff:$n.trim()},Jn=[{blocks:[{id:0,refs:0,fill:0,owners:[]},{id:1,refs:0,fill:0,owners:[]},{id:2,refs:0,fill:0,owners:[]},{id:3,refs:0,fill:0,owners:[]},{id:4,refs:0,fill:0,owners:[]},{id:5,refs:0,fill:0,owners:[]},{id:6,refs:0,fill:0,owners:[]},{id:7,refs:0,fill:0,owners:[]}],seqs:[],log:[]},{blocks:[{id:0,refs:1,fill:4,owners:["A"]},{id:1,refs:1,fill:2,owners:["A"]},{id:2,refs:0,fill:0,owners:[]},{id:3,refs:0,fill:0,owners:[]},{id:4,refs:0,fill:0,owners:[]},{id:5,refs:0,fill:0,owners:[]},{id:6,refs:0,fill:0,owners:[]},{id:7,refs:0,fill:0,owners:[]}],seqs:[{id:"A",promptLen:6,decodeTotal:2,produced:0,table:[0,1],phase:"decode"}],log:["A prefill complete → blocks 0–1"]},{blocks:[{id:0,refs:2,fill:4,owners:["A","B"]},{id:1,refs:2,fill:2,owners:["A","B"]},{id:2,refs:0,fill:0,owners:[]},{id:3,refs:0,fill:0,owners:[]},{id:4,refs:0,fill:0,owners:[]},{id:5,refs:0,fill:0,owners:[]},{id:6,refs:0,fill:0,owners:[]},{id:7,refs:0,fill:0,owners:[]}],seqs:[{id:"A",promptLen:6,decodeTotal:2,produced:0,table:[0,1],phase:"decode"},{id:"B",promptLen:6,decodeTotal:2,produced:0,table:[0,1],phase:"decode"}],log:["A prefill complete → blocks 0–1","B prefix hit → shares 0–1"]},{blocks:[{id:0,refs:2,fill:4,owners:["A","B"]},{id:1,refs:1,fill:2,owners:["B"]},{id:2,refs:1,fill:3,owners:["A"]},{id:3,refs:0,fill:0,owners:[]},{id:4,refs:0,fill:0,owners:[]},{id:5,refs:0,fill:0,owners:[]},{id:6,refs:0,fill:0,owners:[]},{id:7,refs:0,fill:0,owners:[]}],seqs:[{id:"A",promptLen:6,decodeTotal:2,produced:1,table:[0,2],phase:"decode"},{id:"B",promptLen:6,decodeTotal:2,produced:0,table:[0,1],phase:"decode"}],log:["A prefill complete → blocks 0–1","B prefix hit → shares 0–1","A decode · COW block 1 → 2"]},{blocks:[{id:0,refs:2,fill:4,owners:["A","B"]},{id:1,refs:1,fill:3,owners:["B"]},{id:2,refs:1,fill:3,owners:["A"]},{id:3,refs:0,fill:0,owners:[]},{id:4,refs:0,fill:0,owners:[]},{id:5,refs:0,fill:0,owners:[]},{id:6,refs:0,fill:0,owners:[]},{id:7,refs:0,fill:0,owners:[]}],seqs:[{id:"A",promptLen:6,decodeTotal:2,produced:1,table:[0,2],phase:"decode"},{id:"B",promptLen:6,decodeTotal:2,produced:1,table:[0,1],phase:"decode"}],log:["A prefill complete → blocks 0–1","B prefix hit → shares 0–1","A decode · COW block 1 → 2","B decode · writes block 1 in place"]},{blocks:[{id:0,refs:2,fill:4,owners:["A","B"]},{id:1,refs:1,fill:3,owners:["B"]},{id:2,refs:1,fill:4,owners:["A"]},{id:3,refs:0,fill:0,owners:[]},{id:4,refs:0,fill:0,owners:[]},{id:5,refs:0,fill:0,owners:[]},{id:6,refs:0,fill:0,owners:[]},{id:7,refs:0,fill:0,owners:[]}],seqs:[{id:"A",promptLen:6,decodeTotal:2,produced:2,table:[0,2],phase:"done"},{id:"B",promptLen:6,decodeTotal:2,produced:1,table:[0,1],phase:"decode"}],log:["A prefill complete → blocks 0–1","B prefix hit → shares 0–1","A decode · COW block 1 → 2","B decode · writes block 1 in place","A hits max_new_tokens · done"]},{blocks:[{id:0,refs:2,fill:4,owners:["A","B"]},{id:1,refs:1,fill:3,owners:["B"]},{id:2,refs:1,fill:4,owners:["A"]},{id:3,refs:1,fill:4,owners:["C"]},{id:4,refs:1,fill:1,owners:["C"]},{id:5,refs:0,fill:0,owners:[]},{id:6,refs:0,fill:0,owners:[]},{id:7,refs:0,fill:0,owners:[]}],seqs:[{id:"A",promptLen:6,decodeTotal:2,produced:2,table:[0,2],phase:"done"},{id:"B",promptLen:6,decodeTotal:2,produced:1,table:[0,1],phase:"decode"},{id:"C",promptLen:5,decodeTotal:1,produced:0,table:[3,4],phase:"decode"}],log:["A prefill complete → blocks 0–1","B prefix hit → shares 0–1","A decode · COW block 1 → 2","B decode · writes block 1 in place","A hits max_new_tokens · done","C prefill complete → blocks 3–4"]},{blocks:[{id:0,refs:2,fill:4,owners:["A","B"]},{id:1,refs:1,fill:3,owners:["B"]},{id:2,refs:1,fill:4,owners:["A"]},{id:3,refs:1,fill:4,owners:["C"]},{id:4,refs:1,fill:2,owners:["C"]},{id:5,refs:0,fill:0,owners:[]},{id:6,refs:0,fill:0,owners:[]},{id:7,refs:0,fill:0,owners:[]}],seqs:[{id:"A",promptLen:6,decodeTotal:2,produced:2,table:[0,2],phase:"done"},{id:"B",promptLen:6,decodeTotal:2,produced:1,table:[0,1],phase:"decode"},{id:"C",promptLen:5,decodeTotal:1,produced:1,table:[3,4],phase:"done"}],log:["A prefill complete → blocks 0–1","B prefix hit → shares 0–1","A decode · COW block 1 → 2","B decode · writes block 1 in place","A hits max_new_tokens · done","C prefill complete → blocks 3–4","C decode · done"]},{blocks:[{id:0,refs:2,fill:4,owners:["A","B"]},{id:1,refs:1,fill:4,owners:["B"]},{id:2,refs:1,fill:4,owners:["A"]},{id:3,refs:1,fill:4,owners:["C"]},{id:4,refs:1,fill:2,owners:["C"]},{id:5,refs:0,fill:0,owners:[]},{id:6,refs:0,fill:0,owners:[]},{id:7,refs:0,fill:0,owners:[]}],seqs:[{id:"A",promptLen:6,decodeTotal:2,produced:2,table:[0,2],phase:"done"},{id:"B",promptLen:6,decodeTotal:2,produced:2,table:[0,1],phase:"done"},{id:"C",promptLen:5,decodeTotal:1,produced:1,table:[3,4],phase:"done"}],log:["A prefill complete → blocks 0–1","B prefix hit → shares 0–1","A decode · COW block 1 → 2","B decode · writes block 1 in place","A hits max_new_tokens · done","C prefill complete → blocks 3–4","C decode · done","B decode · done"]}],eo={frames:Jn},no="http://www.w3.org/2000/svg",Ae=String.raw,e={fg:"#e6edf3",dim:"#8b949e",line:"#2a3140",panel:"#161b22",panel2:"#1c2230",accent:"#58a6ff",ok:"#3fb950",warn:"#d29922",bad:"#f85149",teal:"#39c5cf",purple:"#a371f7"},on=eo.frames,qe=on.length-1,oo=2,Ie=8,Ke=4,Se=12,be=4,de=["<s>","a","small","model","writes","text","one","token","at","a","time","and"];function to(...y){let d=2166136261;for(const b of y)d=Math.imul(d^(b|0),16777619),d^=d>>>15;return d>>>0}const $e=(...y)=>to(...y)/4294967296;function Ye(...y){const d=Math.max(1e-6,$e(...y,977)),b=$e(...y,131);return Math.sqrt(-2*Math.log(d))*Math.cos(2*Math.PI*b)}const Je=new Map;function tn(y,d){const b=Je.get(y);if(b)return b;const q=d();return Je.set(y,q),q}function ln(y){const d=[];let b=0;for(let x=0;x<Ie;x++)d.push(y(x)),b+=d[x]*d[x];const q=Math.sqrt(b)||1;for(let x=0;x<Ie;x++)d[x]/=q;return d}const sn=(y,d,b)=>tn("k:"+y+":"+d+":"+b,()=>ln(q=>Ye(y,d,b,q,11))),io=(y,d,b)=>tn("q:"+y+":"+d+":"+b,()=>{const q=sn(y,d,Math.max(0,b-1));return ln(x=>.85*q[x]+.55*Ye(y,d,b,x,33))});function dn(y){const d=Math.max(...y),b=y.map(x=>Math.exp(x-d)),q=b.reduce((x,E)=>x+E,0)||1;return b.map(x=>x/q)}const lo=(y,d)=>{let b=0;for(let q=0;q<Ie;q++)b+=y[q]*d[q];return b},so=3.2;function en(y,d,b){if(b<=0)return[];const q=io(y,d,b),x=[];for(let E=0;E<b;E++)x.push(so*lo(q,sn(y,d,E)));return dn(x)}function nn(y){const d=y<de.length?de[y]:"",b=de.map((q,x)=>1.4*Ye(y+1,x,71)+(q===d?6:0));return dn(b)}function u(y,d={}){const b=document.createElementNS(no,y);for(const[q,x]of Object.entries(d))b.setAttribute(q,String(x));return b}function o(y,d,b,q={}){const x=u("text",{x:y,y:d,fill:q.fill??e.dim,"font-size":q.size??11,"text-anchor":q.anchor??"start","font-family":q.mono===!0?"ui-monospace, SFMono-Regular, Menlo, monospace":"inherit"});return q.opacity!==void 0&&x.setAttribute("opacity",String(q.opacity)),q.weight!==void 0&&x.setAttribute("font-weight",String(q.weight)),x.textContent=b,x}function co(y){const d=[];let b=0;for(;b<y.length;){const q=y[b];if((q==="_"||q==="^")&&b+1<y.length){const x=q==="_"?"sub":"sup";if(b+=1,y[b]==="{"){const E=y.indexOf("}",b),H=y.slice(b+1,E<0?y.length:E);d.push({text:H,kind:x}),b=E<0?y.length:E+1}else d.push({text:y[b],kind:x}),b+=1}else{let x=b;for(;x<y.length&&y[x]!=="_"&&y[x]!=="^";)x+=1;d.push({text:y.slice(b,x),kind:"base"}),b=x}}return d}const ao="ui-monospace, SFMono-Regular, Menlo, monospace";function ro(y,d){let b=0;for(const q of y)b+=q.text.length*(q.kind==="base"?d*.6:d*.42);return b}function We(y,d,b,q,x={}){const E=x.size??12,H=co(q),I=x.align==="center"?d-ro(H,E)/2:d,Q=u("text",{x:I,y:b,"font-size":E,fill:x.color??e.fg,"font-family":ao});let le=I,se=0;for(const ce of H){const oe=ce.kind==="base"?0:ce.kind==="sub"?E*.3:-E*.42,U=u("tspan",{x:le,dy:oe-se,"font-size":ce.kind==="base"?E:E*.72});U.textContent=ce.text,Q.appendChild(U),se=oe,le+=ce.text.length*(ce.kind==="base"?E*.6:E*.42)}y.appendChild(Q)}function Te(y,d){const b=u("marker",{id:y,viewBox:"0 0 10 10",refX:"9",refY:"5",markerWidth:"5",markerHeight:"5",orient:"auto-start-reverse"});return b.appendChild(u("path",{d:"M 0 0 L 10 5 L 0 10 z",fill:d})),b}function D(y,d,b,q,x,E,H,I=1.2){y.appendChild(u("line",{x1:d,y1:b,x2:q,y2:x,stroke:E,"stroke-width":I,"marker-end":"url(#"+H+")"}))}const po=720,ho=56;function fo(y){return y.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Be(y,d,b){return"<h3>"+y+"</h3><pre><code>"+fo(d)+"</code></pre>"+b}const uo=[{id:"layer",title:"The Transformer Architecture",blurb:"Let [t] denote the sequence [0, ..., T] of indices and t be an element. The input vectors h_[t] go through (1) the normalization layer and the MLP layer that projects to QKV features, (2) causal self-attention across [t], (3) normalization, MLP bottleneck and residual connection",h:710,top:44},{id:"next-token-prediction",title:"Next Token Prediction",blurb:"A token is an element of the vocabulary. Every token is mapped to a probability distribution of the next token.",h:380,top:44},{id:"prefill",title:"The Prefill Stage",blurb:"This is the standard forward pass of the transformer on an input sequence with causal attention.",h:640,top:44},{id:"decode",title:"The Decode Stage",blurb:"Each step we sample the next token, then repeat the forward pass with the updated token sequence. We only need to compute the QKV for the new token and its attention to the past, which only needs K and V.",h:640,top:44},{id:"contiguous",title:"The Cost of Contiguity",blurb:"The cache is now the thing to store, and it grows one token at a time. A serving system that gives each request one contiguous buffer has to reserve the longest sequence it might produce up front — so most of the cache is allocated but empty.",h:310,top:44},{id:"paged",title:"PagedAttention: Blocks, Not Buffers",blurb:"PagedAttention cuts the cache into fixed-size physical blocks. Each sequence keeps a block table mapping its logical blocks to blocks anywhere in the pool, so memory is allocated on demand and a sequence's cache never has to be contiguous.",h:430,top:44},{id:"batching",title:"Continuous Batching",blurb:"Once the cache is paged, the scheduler can reconsider the batch on every forward pass. A finished request returns its blocks immediately and a queued request joins the next iteration — no waiting for the slowest sequence to finish.",h:360,top:44},{id:"sharing",title:"Sharing Blocks: Copy-on-Write",blurb:"A block table makes sharing cheap: two requests can point at the same physical block. Each block keeps a reference count, and a write to a shared block triggers copy-on-write — copy the block, update one table, and leave the other request untouched.",h:350,top:44},{id:"radix",title:"RadixAttention: One Tree of Prefixes",blurb:"RadixAttention sits on top of paged blocks: the cache becomes a radix tree keyed by token sequences. A request walks the tree to its longest matching prefix, reuses those KV blocks, and computes only the unmatched suffix. Shared ancestors stay put while leaves are evicted LRU.",h:430,top:44},{id:"disagg",title:"Prefill / Decode Disaggregation",blurb:"Without chunked prefill, a long prompt on a shared worker stalls decode behind it. Chunked prefill interleaves prompt chunks with decode; disaggregation goes further, giving prefill and decode separate pools and handing the prompt's KV blocks from the prefill worker to the decode worker over the interconnect.",h:600,top:44},{id:"pseudocode",title:"Pseudocode: The Serving Loop",blurb:"Every diagram above is a data-structure cartoon. Here is the code behind it: a block table with copy-on-write, a radix prefix matcher, an iteration-level scheduler, and a prefill/decode handoff. The snippets are runnable toy implementations; §12 replays frames generated from them. The links point to production implementations.",h:250,top:44,prose:["<p>Toy implementation with lightweight Python types, not drop-in API calls. The snippets are kept as standalone Python files and rendered here verbatim.</p>",Be("Core objects",ve.coreObjects,'<p class="ill-refs">Types are illustrative; vLLM uses <a href="https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/block_pool.py">KVCacheBlock / BlockPool</a>, SGLang uses <a href="https://github.com/sgl-project/sglang/blob/main/python/sglang/srt/mem_cache/radix_cache.py">TreeNode / RadixKey</a>.</p>'),Be("PagedAttention: block table + copy-on-write",ve.pagedAttention,'<p class="ill-refs"><a href="https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/kv_cache_manager.py">vLLM KVCacheManager</a> · <a href="https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/block_pool.py">BlockPool</a> · <a href="https://arxiv.org/abs/2309.06180">PagedAttention paper</a></p>'),Be("RadixAttention: longest-prefix match",ve.radixAttention,'<p class="ill-refs"><a href="https://github.com/sgl-project/sglang/blob/main/python/sglang/srt/mem_cache/radix_cache.py">SGLang radix_cache.py</a> · <a href="https://github.com/sgl-project/sglang/blob/main/python/sglang/srt/managers/scheduler.py">SGLang scheduler.py</a> · <a href="https://arxiv.org/abs/2312.07104">RadixAttention paper</a></p>'),Be("Continuous batching: asynchronous request loops",ve.scheduler,'<p class="ill-refs"><a href="https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/sched/scheduler.py">vLLM scheduler.py</a> · <a href="https://arxiv.org/abs/2404.14294">DeepSpeed-FastGen / Dynamic SplitFuse</a> · <a href="https://arxiv.org/abs/2403.02310">Sarathi-Serve / chunked prefill</a></p>'),Be("Prefill → decode handoff",ve.handoff,'<p class="ill-refs"><a href="https://github.com/NVIDIA/TensorRT-LLM/blob/main/cpp/tensorrt_llm/batch_manager/kvCacheManager.cpp">TensorRT-LLM KV cache manager</a> · <a href="https://arxiv.org/abs/2401.09670">DistServe / disaggregated prefill+decode</a></p>'),'<p class="ill-refs"><strong>More:</strong> <a href="https://github.com/vllm-project/vllm">vLLM</a> · <a href="https://github.com/sgl-project/sglang">SGLang</a> · <a href="https://github.com/NVIDIA/TensorRT-LLM">TensorRT-LLM</a> · <a href="https://arxiv.org/abs/2404.14294">DeepSpeed-FastGen</a> · <a href="https://arxiv.org/abs/2401.09670">DistServe</a> · <a href="https://arxiv.org/abs/2403.02310">Sarathi-Serve</a></p>']},{id:"sim",title:"Simulation: A Shared Prefix, Step by Step",blurb:"Run the model from §11 on a tiny workload. A and B share a prompt prefix; A's first decode copies the shared block, C arrives later, and the physical block pool shows the result. Step through the schedule or press Run.",h:560,top:44,prose:['<p class="ill-refs">Frames are precomputed by <a href="https://github.com/sylqiu/sylqiu-site/blob/main/src/content/kv_cache_pseudocode/sim.py"><code>sim.py</code></a>, which runs the implementation in §11; the page only replays the recorded states. <a href="https://github.com/sylqiu/sylqiu-site/tree/main/src/content/kv_cache_pseudocode">source</a></p>']}],mo=y=>{let d=8,b=0,q=0,x=!1,E=0,H=Math.min(2,7),I=null,Q=0,le=!1,se=null;function ce(){if(I!==null){window.clearInterval(I),I=null,S();return}E=1,H=0,S(),I=window.setInterval(()=>{H<d-1?H+=1:(I!==null&&window.clearInterval(I),I=null),S()},700)}let oe=0,U=0,ae=null,re=null,pe=0,te=0,ue=!1,Ee=0,L=0,me=null,Y=!1,Ve=!1,ge=null;const Oe=document.createElement("div");Oe.className="ill";const He=[];uo.forEach((n,a)=>{const r=document.createElement("section");r.className="ill-sec",r.id="ill-"+n.id;const w=document.createElement("div");w.className="ill-sec-head";const C=document.createElement("h2");C.textContent=a+1+" · "+n.title;const g=document.createElement("div");g.className="ill-sec-ctl",w.append(C,g);const i=document.createElement("p");i.className="ill-sec-blurb",i.textContent=n.blurb;const s=document.createElement("div");s.className="ill-fig";const m=u("svg",{viewBox:"0 -"+(n.top||0)+" "+po+" "+(n.h+(n.top||0)),role:"img","aria-label":n.title});s.appendChild(m);const k=document.createElement("div");k.className="ill-cards";let c=null;r.append(w,i,s),n.prose&&(c=document.createElement("div"),c.className="ill-prose",c.innerHTML=n.prose.map(t=>t.trim().startsWith("<")?t:"<p>"+t+"</p>").join(""),Cn(c),r.appendChild(c)),Oe.appendChild(r),He.push({svg:m,cards:k,ctl:g,prose:c})}),y.appendChild(Oe);const cn=[{chip:"1 · normalize, project q, k, v"},{chip:"2 · causal self-attention"},{chip:"3 · normalize, MLP, residual"}],K={inY:60,inH:108,opY:196,opH:340,outY:566,outH:128},P=360,_e=22,De=28;function F(n,a,r,w,C,g=r){const i=r*De-6,s=P-i/2;n.appendChild(o(40,a+_e/2+3,C,{size:10,fill:w}));for(let m=0;m<r;m++){const k=m<g;n.appendChild(u("rect",{x:s+m*De,y:a,width:_e,height:_e,rx:5,fill:k?w:"none","fill-opacity":k?.22:0,stroke:k?w:e.line,"stroke-width":1.3})),n.appendChild(o(s+m*De+_e/2,a+_e/2+3.5,String(m),{anchor:"middle",size:8,mono:!0,fill:e.fg,opacity:k?1:.4}))}}function N(n,a,r,w,C,g,i=!0){const s=i?e.accent:e.dim,m=u("g",{cursor:i?"pointer":"default",class:"ill-svg-btn"});m.appendChild(u("rect",{x:a,y:r,width:w,height:26,rx:13,fill:s,"fill-opacity":i?.12:.06,stroke:s})),m.appendChild(o(a+w/2,r+17,C,{anchor:"middle",size:10.5,fill:s,weight:600})),i&&m.addEventListener("click",g),n.appendChild(m)}function an(n){const a=Math.min(H,d-1),r=en(b,q,a),w=r.length>0?Math.max.apply(null,r):1,C=h=>Math.min(1,h/w),g=K.inY+18,i=K.inY+50,s=K.inY+82,m=K.outY+18,k=K.outY+50,c=K.outY+82;cn.forEach((h,p)=>{const f=20+p*236,l=p===E,_=u("g",{cursor:"pointer"});_.addEventListener("click",()=>{E=p,H=Math.min(2,d-1),S()}),_.appendChild(u("rect",{x:f,y:16,width:224,height:34,rx:8,fill:l?e.accent:e.panel,"fill-opacity":l?.18:.5,stroke:l?e.accent:e.line,"stroke-width":l?1.6:1})),_.appendChild(o(f+12,38,h.chip,{size:11,fill:l?e.fg:e.dim,weight:l?700:400})),n.appendChild(_)});const t=(h,p,f,l)=>{n.appendChild(u("rect",{x:20,y:h,width:680,height:p,rx:10,fill:e.panel,"fill-opacity":.5,stroke:e.line})),n.appendChild(o(32,h+19,f,{size:10,weight:600,fill:l}))};if(t(K.inY,K.inH,"input",e.dim),t(K.opY,K.opH,"step "+(E+1)+" of 3",e.accent),t(K.outY,K.outH,"output",e.dim),n.appendChild(o(688,K.outY+19,b+"."+q,{anchor:"end",size:9.5})),D(n,P,K.inY+K.inH+4,P,K.opY-4,e.dim,"arw-d"),D(n,P,K.opY+K.opH+4,P,K.outY-4,e.dim,"arw-d"),E===0&&(F(n,i,d,e.fg,"h_[t]"),n.appendChild(u("rect",{x:210,y:230,width:300,height:32,rx:7,fill:e.panel2,stroke:e.line})),n.appendChild(o(224,251,"RMSNorm",{size:11,fill:e.fg})),D(n,P,266,P,300,e.dim,"arw-d"),[{label:Ae`q_t = W_Q h_t`,color:e.accent},{label:Ae`k_t = W_K h_t`,color:e.purple},{label:Ae`v_t = W_V h_t`,color:e.teal}].forEach((p,f)=>{const l=40+f*220;n.appendChild(u("rect",{x:l,y:310,width:200,height:62,rx:8,fill:e.panel2,stroke:p.color})),We(n,l+24,340,p.label,{size:11,color:p.color}),n.appendChild(o(l+24,360,"per position",{size:9.5}))}),F(n,m,d,e.accent,"q_[t]"),F(n,k,d,e.purple,"k_[t]"),F(n,c,d,e.teal,"v_[t]")),E===1){F(n,g,d,e.accent,"q_[t]"),F(n,i,d,e.purple,"k_[t]"),F(n,s,d,e.teal,"v_[t]");const h=30,p=34,f=d*p-4,l=P-f/2,_=B=>l+B*p+h/2,A=280,v=336;n.appendChild(o(216,A+15,"k_[t]",{anchor:"end",size:9.5,fill:e.purple})),n.appendChild(o(32,222,"one step per token: dot the keys, mix the values",{size:10,fill:e.teal,weight:600})),N(n,500,206,190,I!==null?"❚❚ Pause":"▶ Animate attention",ce),a<d-1&&(n.appendChild(u("rect",{x:_(a+1)-8,y:244,width:(d-a-1)*p+8,height:122,rx:6,fill:e.panel2,"fill-opacity":.3,stroke:e.warn,"stroke-dasharray":"4 3"})),n.appendChild(o(l+f-6,358,"blocked · p > t",{anchor:"end",size:9.5,fill:e.warn})));for(let B=0;B<d;B++){const O=B<=a,z=B===a;n.appendChild(u("rect",{x:l+B*p,y:244,width:h,height:24,rx:6,fill:z?e.accent:e.panel,"fill-opacity":z?.2:1,stroke:z?e.accent:e.line,opacity:O?1:.45})),n.appendChild(o(_(B),260,de[B],{anchor:"middle",size:8.5,mono:!0,fill:O?e.fg:e.dim})),n.appendChild(u("rect",{x:_(B)-11,y:A,width:22,height:22,rx:5,fill:e.purple,"fill-opacity":O?.28:.08,stroke:e.purple,opacity:O?1:.4})),n.appendChild(o(_(B),A+15,String(B),{anchor:"middle",size:8,mono:!0,fill:e.fg,opacity:O?1:.45}))}for(let B=0;B<=a;B++){const O=a>0?C(r[B]):1;n.appendChild(u("line",{x1:_(a),y1:v,x2:_(B),y2:A+22,stroke:e.accent,"stroke-width":.8+4.5*O,opacity:.45+.55*O}))}n.appendChild(u("rect",{x:_(a)-13,y:v,width:26,height:26,rx:6,fill:e.accent,"fill-opacity":.3,stroke:e.fg})),n.appendChild(o(_(a),v+17,String(a),{anchor:"middle",size:8,mono:!0,fill:e.fg})),n.appendChild(o(_(a),v+42,"q_t",{anchor:"middle",size:9.5,fill:e.accent})),n.appendChild(o(32,v+40,"Causal: token "+a+" reads 0 … "+a+".",{size:10.5,fill:e.fg}));const T=250,W=306,ee=18,$=392;n.appendChild(o(T,$-14,"a_{t,p}",{size:9.5,fill:e.warn})),n.appendChild(o(W,$-14,"v_[t]",{size:9.5,fill:e.teal}));for(let B=0;B<d;B++){const O=B<=a,z=O&&a>0?C(r[B]):O?1:0;n.appendChild(u("rect",{x:T,y:$+B*ee,width:O?6+34*z:2,height:13,rx:2,fill:e.warn,"fill-opacity":O?.8:.15})),n.appendChild(u("rect",{x:W,y:$+B*ee,width:16,height:13,rx:3,fill:e.teal,"fill-opacity":O?.2+.65*z:.06,stroke:e.teal,"stroke-width":1,opacity:O?1:.3})),n.appendChild(o(W+8,$+B*ee+11,String(B),{anchor:"middle",size:7.5,mono:!0,fill:e.fg,opacity:O?1:.4}))}We(n,384,$+34,Ae`o_t = Σ_p a_{t,p} v_p`,{size:11.5,color:e.teal}),n.appendChild(o(384,$+56,"step "+(a+1)+" of "+d,{size:10,fill:e.dim})),F(n,k,d,e.ok,"o_[t]",a+1)}if(E===2){F(n,i,d,e.ok,"o_[t]"),n.appendChild(u("rect",{x:210,y:230,width:300,height:30,rx:7,fill:e.panel2,stroke:e.line})),n.appendChild(o(224,250,"RMSNorm",{size:11,fill:e.fg})),D(n,P,262,P,292,e.dim,"arw-d");const h=[{y:292,x:40,w:640,label:"up-projection"},{y:336,x:200,w:320,label:"bottleneck"},{y:380,x:40,w:640,label:"down-projection"}];for(const p of h)n.appendChild(u("rect",{x:p.x,y:p.y,width:p.w,height:30,rx:7,fill:e.panel2,stroke:e.purple})),n.appendChild(o(p.x+12,p.y+19,p.label,{size:10}));n.appendChild(u("path",{d:"M 40 180 L 34 180 L 34 512 L "+(P-26)+" 512",fill:"none",stroke:e.ok,"stroke-width":1.4,"stroke-dasharray":"5 4","marker-end":"url(#arw-g)"})),n.appendChild(o(44,192,"residual · the step input, unchanged",{size:9.5,fill:e.ok})),D(n,P,414,P,502,e.purple,"arw-d"),n.appendChild(u("circle",{cx:P,cy:512,r:9,fill:e.panel2,stroke:e.ok,"stroke-width":1.4})),n.appendChild(o(P,516,"+",{anchor:"middle",size:13,fill:e.ok,weight:700})),n.appendChild(o(P+18,516,"residual",{size:9.5,fill:e.ok})),F(n,k,d,e.fg,"h_[t]")}}function rn(n){const r=ho,w=20,C=34,g=30;for(let l=0;l<Se;l++){const _=w+l*r;l<d?(n.appendChild(u("rect",{x:_,y:C,width:50,height:g,rx:7,fill:l===d-1?e.accent:e.panel,"fill-opacity":l===d-1?.18:1,stroke:l===d-1?e.accent:e.line})),n.appendChild(o(_+50/2,C+20,de[l],{anchor:"middle",size:9.5,mono:!0,fill:l===d-1?e.fg:e.dim}))):l===d&&(n.appendChild(u("rect",{x:_,y:C,width:50,height:g,rx:7,fill:"none",stroke:e.accent,"stroke-width":1.2,"stroke-dasharray":"4 3"})),n.appendChild(o(_+50/2,C+20,"?",{anchor:"middle",size:13,fill:e.accent,weight:600})))}n.appendChild(o(w,C-10,"input so far · the model predicts position "+d,{size:10}));const i=360,s=88;n.appendChild(u("rect",{x:240,y:s,width:240,height:44,rx:9,fill:e.panel,stroke:e.line})),n.appendChild(o(360,s+19,"transformer · "+oo+" layers here",{anchor:"middle",size:11,fill:e.fg})),n.appendChild(o(360,s+34,"attention + MLP at every position",{anchor:"middle",size:9.5})),D(n,i,C+g+6,i,s-6,e.dim,"arw-d"),D(n,i,s+g+6,i,168,e.dim,"arw-d");const m=nn(d),k=322,c=118,t=40,h=56,p=20;We(n,p,190,Ae`p(x_{n+1} | x_{≤n})`,{size:12}),n.appendChild(o(170,190,"· one probability per vocabulary entry",{size:10.5}));let f=0;m.forEach((l,_)=>{l>m[f]&&(f=_)}),m.forEach((l,_)=>{const A=p+_*h,v=Math.max(2,l*c),T=k-v,W=_===f;n.appendChild(u("rect",{x:A,y:200,width:t,height:c,rx:3,fill:e.panel2,opacity:.45})),n.appendChild(u("rect",{x:A,y:T,width:t,height:v,rx:3,fill:W?e.accent:e.teal,opacity:W?x?1:.9:.45}));const ee=u("text",{x:A+t/2,y:k+12,fill:W?e.fg:e.dim,"font-size":9.5,"text-anchor":"end",transform:"rotate(-52 "+(A+t/2)+" "+(k+12)+")","font-family":"ui-monospace, SFMono-Regular, Menlo, monospace"});ee.textContent=de[_],n.appendChild(ee),n.appendChild(o(A+t/2,T-5,l.toFixed(2),{anchor:"middle",size:9,mono:!0,fill:W?e.accent:e.dim})),W&&n.appendChild(o(A+t/2,T+15,"sampled",{anchor:"middle",size:9.5,fill:"#0b1220",weight:700}))}),n.appendChild(u("line",{x1:p-4,y1:k,x2:p+Se*h-8,y2:k,stroke:e.line})),n.appendChild(u("path",{d:"M "+(w+d*r+50/2)+" "+(C+g+6)+" C "+(w+d*r+50/2)+" 372 "+(p+f*h+t/2)+" 372 "+(p+f*h+t/2)+" "+(k+34),fill:"none",stroke:e.ok,"stroke-width":1.2,"stroke-dasharray":"4 3","marker-end":"url(#arw-g)"})),N(n,20,-36,190,x?"sampling…":d>=Se?"↺ Restart the loop":"▶ Sample next token",Wn),N(n,232,-36,96,"↺ Reset",()=>{d=Ke,x=!1,S()})}function pn(n){const a=oe,r=a>=1,w=a>=2,C=a>=3,g=(l,_,A,v)=>{n.appendChild(u("rect",{x:20,y:l,width:680,height:_,rx:10,fill:e.panel,"fill-opacity":.5,stroke:e.line})),n.appendChild(o(32,l+19,A,{size:10,weight:600,fill:v}))};g(20,106,"input",e.dim),g(154,316,"Forward the whole prompt at once",e.accent),g(498,114,"output",e.dim),D(n,P,130,P,150,e.dim,"arw-d"),D(n,P,474,P,494,e.dim,"arw-d"),N(n,20,-36,150,ae!==null?"❚❚ Pause":"▶ Prefill",In),N(n,180,-36,96,"↺ Reset",Yn),F(n,36,d,e.accent,"q_[t]",w?d:0),F(n,68,d,e.purple,"k_[t]",r?d:0),F(n,100,d,e.teal,"v_[t]",r?d:0);const i=30,s=34,m=d*s-4,k=P-m/2,c=l=>k+l*s+i/2,t=196,h=236,p=296,f=356;n.appendChild(o(40,h+15,"k_[t]",{size:10,fill:e.purple})),n.appendChild(o(40,p+15,"q_[t]",{size:10,fill:e.accent})),n.appendChild(o(40,f+15,"v_[t]",{size:10,fill:e.teal}));for(let l=0;l<d;l++)n.appendChild(u("rect",{x:k+l*s,y:t,width:i,height:24,rx:6,fill:e.panel,stroke:e.line})),n.appendChild(o(c(l),t+16,de[l],{anchor:"middle",size:8.5,mono:!0,fill:e.fg})),n.appendChild(u("rect",{x:c(l)-11,y:h,width:22,height:22,rx:5,fill:e.purple,"fill-opacity":r?.28:.06,stroke:r?e.purple:e.line})),n.appendChild(o(c(l),h+15,String(l),{anchor:"middle",size:8,mono:!0,fill:e.fg,opacity:r?1:.35})),n.appendChild(u("rect",{x:c(l)-11,y:p,width:22,height:22,rx:5,fill:e.accent,"fill-opacity":w?.3:.06,stroke:w?e.accent:e.line})),n.appendChild(o(c(l),p+15,String(l),{anchor:"middle",size:8,mono:!0,fill:e.fg,opacity:w?1:.35})),n.appendChild(u("rect",{x:c(l)-11,y:f,width:22,height:22,rx:5,fill:e.teal,"fill-opacity":r?.28:.06,stroke:r?e.teal:e.line})),n.appendChild(o(c(l),f+15,String(l),{anchor:"middle",size:8,mono:!0,fill:e.fg,opacity:r?1:.35}));if(n.appendChild(o(40,t+16,"tokens",{size:10,fill:e.dim})),w){for(let l=0;l<d;l++)for(let _=0;_<=l;_++)n.appendChild(u("line",{x1:c(l),y1:p,x2:c(_),y2:h+22,stroke:e.accent,"stroke-width":.8,opacity:.28}));n.appendChild(o(32,424,"every query reads its keys in the same pass · position t reads p ≤ t",{size:10.5,fill:e.fg}))}n.appendChild(o(32,448,r?"k and v written once, for every position":"nothing written yet",{size:10.5,fill:r?e.teal:e.dim})),F(n,542,d,e.ok,"o_[t]",C?d:0)}function hn(n){const a=Math.min(U,be),r=d+a,w=en(b,q,r),C=w.length>0?Math.max.apply(null,w):1,g=z=>Math.min(1,z/C),i=z=>{if(z<d)return de[z];const R=nn(z-1);let M=0;return R.forEach((ne,xe)=>{ne>R[M]&&(M=xe)}),de[M]},s=(z,R,M,ne)=>{n.appendChild(u("rect",{x:20,y:z,width:680,height:R,rx:10,fill:e.panel,"fill-opacity":.5,stroke:e.line})),n.appendChild(o(32,z+19,M,{size:10,weight:600,fill:ne}))};s(20,106,"input",e.dim),s(154,316,"decode one token per step",e.teal),s(498,114,"output",e.dim),D(n,P,130,P,150,e.dim,"arw-d"),D(n,P,474,P,494,e.dim,"arw-d"),N(n,20,-36,150,re!==null?"❚❚ Pause":"▶ Decode",Hn),N(n,180,-36,96,"Step ▸",Fn,a<be),N(n,286,-36,96,"↺ Reset",Xn);const m=18,k=20,c=(r+1)*k-2,t=P-c/2,h=(z,R,M)=>{n.appendChild(o(40,z+13,M,{size:10,fill:R}));for(let ne=0;ne<=r;ne++){const xe=ne<d,ze=ne===r;n.appendChild(u("rect",{x:t+ne*k,y:z,width:m,height:m,rx:4,fill:ze?"none":R,"fill-opacity":xe?.22:.38,stroke:R,"stroke-dasharray":ze?"3 2":"",opacity:ze?1:xe?.8:1})),n.appendChild(o(t+ne*k+m/2,z+13,String(ne),{anchor:"middle",size:7.5,mono:!0,fill:e.fg,opacity:ze?1:xe?.75:1}))}};h(46,e.purple,"k_[t]"),h(74,e.teal,"v_[t]"),n.appendChild(u("rect",{x:t+r*k,y:98,width:m,height:m,rx:4,fill:e.accent,"fill-opacity":.34,stroke:e.accent})),n.appendChild(o(t+r*k+m/2,111,String(r),{anchor:"middle",size:8,mono:!0,fill:e.fg})),n.appendChild(o(40,111,"q_"+r+" · the only new vector",{size:10,fill:e.accent}));const p=r+1,f=26,l=30,_=p*l-4,A=P-_/2,v=z=>A+z*l+f/2,T=196,W=240,ee=300,$=360;for(let z=0;z<=r;z++){const R=z<d,M=z===r;n.appendChild(u("rect",{x:A+z*l,y:T,width:f,height:24,rx:6,fill:M?e.teal:e.panel,"fill-opacity":M?.2:1,stroke:M?e.teal:e.line})),n.appendChild(o(v(z),T+16,i(z),{anchor:"middle",size:8,mono:!0,fill:M?e.fg:e.dim})),n.appendChild(u("rect",{x:v(z)-10,y:W,width:20,height:20,rx:5,fill:e.purple,"fill-opacity":M?.4:R?.22:.34,stroke:e.purple,opacity:M?1:R?.8:1})),n.appendChild(o(v(z),W+14,String(z),{anchor:"middle",size:7.5,mono:!0,fill:e.fg,opacity:M?1:R?.75:1})),n.appendChild(u("rect",{x:v(z)-10,y:$,width:20,height:20,rx:5,fill:e.teal,"fill-opacity":M?.4:R?.22:.34,stroke:e.teal,opacity:M?1:R?.8:1})),n.appendChild(o(v(z),$+14,String(z),{anchor:"middle",size:7.5,mono:!0,fill:e.fg,opacity:M?1:R?.75:1})),z===d-1&&n.appendChild(u("line",{x1:v(z)+l/2,y1:T-6,x2:v(z)+l/2,y2:$+26,stroke:e.dim,"stroke-dasharray":"3 3",opacity:.6}))}n.appendChild(o(40,T+16,"tokens",{size:10,fill:e.dim})),n.appendChild(o(40,W+14,"k_[t]",{size:10,fill:e.purple})),n.appendChild(o(40,$+14,"v_[t]",{size:10,fill:e.teal})),n.appendChild(u("rect",{x:v(r)-12,y:ee,width:24,height:24,rx:6,fill:e.accent,"fill-opacity":.34,stroke:e.fg})),n.appendChild(o(v(r),ee+16,String(r),{anchor:"middle",size:8,mono:!0,fill:e.fg}));for(let z=0;z<=r;z++){const R=g(w[z]);n.appendChild(u("line",{x1:v(r),y1:ee,x2:v(z),y2:W+20,stroke:e.accent,"stroke-width":.8+4.5*R,opacity:.45+.55*R}))}n.appendChild(o(40,ee+16,"q_"+r,{size:10,fill:e.accent})),n.appendChild(o(32,424,"everything left of the dashed line came from prefill KV cache",{size:10.5,fill:e.fg})),n.appendChild(o(32,448,"each step appends one more KV cache",{size:10.5,fill:e.teal}));const B=Math.min(38,Math.floor(643/p)),O=P-(p*B-4)/2;n.appendChild(o(40,553,"o_[t]",{size:10,fill:e.ok}));for(let z=0;z<=r;z++){const R=z===r,M=z<d;n.appendChild(u("rect",{x:O+z*B,y:542,width:22,height:22,rx:5,fill:R?e.ok:"none","fill-opacity":R?.42:0,stroke:e.ok,opacity:R?1:M?.5:.75})),n.appendChild(o(O+z*B+11,557,String(z),{anchor:"middle",size:8,mono:!0,fill:e.fg,opacity:R?1:M?.5:.75}))}n.appendChild(o(P,604,"the prompt outputs came from prefill · one new output per step",{anchor:"middle",size:9.5,fill:e.dim}))}const Z=16,Pe=48,he=[{name:"A",len:8,color:e.accent},{name:"B",len:3,color:e.teal},{name:"C",len:11,color:e.purple}],Fe={name:"D",color:e.ok};function fn(n){const a=Math.min(pe,he.length),r=pe>he.length,w=a*Z,C=he.slice(0,a).reduce((f,l)=>f+l.len,0),g=w-C,i=Pe-w;N(n,20,-36,190,"▶ Admit next request",Tn,pe<4),N(n,220,-36,96,"↺ Reset",Bn),n.appendChild(o(20,14,"one contiguous buffer per request · each buffer reserves max_len = "+Z+" slots",{size:10.5,fill:e.fg}));const s=24,m=12,k=13,c=58,t=34;for(let f=0;f<Pe;f++){const l=Math.floor(f/Z),_=f%Z,A=he[l],v=l<a,T=v&&_<A.len;v?(n.appendChild(u("rect",{x:s+f*k,y:c,width:m,height:t,rx:3,fill:T?A.color:"none","fill-opacity":T?.36:0,stroke:A.color,"stroke-opacity":T?.95:.26,"stroke-dasharray":T?"":"2 2"})),T&&n.appendChild(o(s+f*k+m/2,c+21,String(_),{anchor:"middle",size:7,mono:!0,fill:e.fg}))):n.appendChild(u("rect",{x:s+f*k,y:c,width:m,height:t,rx:3,fill:"none",stroke:e.line,"stroke-dasharray":"2 3",opacity:.55}))}he.forEach((f,l)=>{if(l>=a)return;const _=s+(l*Z+Z/2)*k;n.appendChild(o(_,c-7,f.name+" · "+f.len+" / "+Z+" used",{anchor:"middle",size:9.5,fill:f.color,weight:600}))}),n.appendChild(o(20,114,"reserved "+w+" / "+Pe+" slots   ·   live "+C+"   ·   idle-but-reserved "+g+"   ·   free "+i,{size:10.5,fill:e.fg}));const h=144;n.appendChild(u("rect",{x:20,y:h,width:680,height:88,rx:10,fill:e.panel,"fill-opacity":.5,stroke:r?e.bad:e.line,"stroke-dasharray":r?"":"4 4"})),n.appendChild(o(32,h+22,Fe.name+" · 6-token request",{size:11,weight:600,fill:Fe.color})),n.appendChild(o(32,h+40,"asks for one contiguous region of "+Z+" slots",{size:10,fill:e.dim}));for(let f=0;f<Z;f++)n.appendChild(u("rect",{x:470+f*14,y:h+28,width:13,height:26,rx:3,fill:r?e.bad:e.ok,"fill-opacity":.1,stroke:r?e.bad:e.ok,"stroke-opacity":.55,"stroke-dasharray":"3 2"}));const p=r?"✕ rejected · "+g+" slots are idle, but no "+Z+"-slot contiguous run is free":pe>=he.length?"waiting · every buffer is reserved, although "+g+" slots inside them are empty":"waiting in the queue";n.appendChild(o(32,h+66,p,{size:10.5,fill:r?e.bad:e.warn})),a===he.length?(n.appendChild(o(20,258,"Only "+C+" of the "+Pe+" reserved slots hold K or V. The rest is fragmentation:",{size:10.5,fill:e.fg})),n.appendChild(o(20,276,"reserved tails inside each buffer, plus buffer-wide gaps that cannot be merged for a new request.",{size:10,fill:e.dim}))):(n.appendChild(o(20,258,"Each admitted request takes a fixed "+Z+"-slot region, whether or not it ever reaches that length.",{size:10.5,fill:e.fg})),n.appendChild(o(20,276,"The tail of the region is reserved up front and stays empty until the sequence grows into it.",{size:10,fill:e.dim})))}const ye=4,Xe=12;function un(){const n=[{name:"A",color:e.accent,len:8+te,map:[5,1,10]},{name:"B",color:e.teal,len:3+te,map:[8,4]},{name:"C",color:e.purple,len:11+te,map:[0,7,2,3]}];return ue?n.push({name:"D",color:e.ok,len:6+Math.max(0,te-Ee),map:[6,9,11]}):n.push({name:"D",color:e.ok,len:0,map:[],queued:!0}),n.map(a=>({...a,map:a.map.slice(0,Math.ceil(a.len/ye))}))}function mn(n){N(n,20,-36,180,"▶ Decode iteration",En,te<3),N(n,210,-36,130,ue?"D admitted":"＋ Admit D",Pn,!ue),N(n,350,-36,96,"↺ Reset",Nn),n.appendChild(o(20,12,"logical sequence · 4-token blocks · L0→#5 means logical block 0 lives in physical block 5",{size:10.5,fill:e.fg}));const a=un();a.forEach((c,t)=>{const h=38+t*44;if(n.appendChild(o(24,h+20,c.name,{size:12,weight:700,fill:c.color})),c.queued){n.appendChild(o(48,h+19,"queued · 6 tokens · will take 2 blocks",{size:10,fill:e.dim}));return}n.appendChild(o(24,h+33,"len "+c.len,{size:8,fill:e.dim})),c.map.forEach((p,f)=>{const l=48+f*84;n.appendChild(o(l+2,h-3,"L"+f+"→#"+p,{size:8.5,mono:!0,fill:c.color}));for(let _=0;_<4;_++){const A=f*4+_,v=A<c.len,T=A===c.len-1;n.appendChild(u("rect",{x:l+_*16,y:h,width:15,height:30,rx:4,fill:v?c.color:"none","fill-opacity":v?T?.6:.3:0,stroke:v?T?e.fg:c.color:e.line,"stroke-dasharray":v?"":"2 2","stroke-opacity":v?.95:.7})),n.appendChild(o(l+_*16+7.5,h+19,v?String(A):"·",{anchor:"middle",size:7.5,mono:!0,fill:e.fg,opacity:v?1:.35}))}})});const r=a.reduce((c,t)=>c+t.map.length,0),w=a.reduce((c,t)=>c+t.len,0),C=r*ye-w,g=430,i=18;n.appendChild(u("rect",{x:g,y:i,width:270,height:174,rx:10,fill:e.panel,"fill-opacity":.5,stroke:e.line})),n.appendChild(o(g+12,i+21,"block table",{size:10.5,weight:700,fill:e.fg})),n.appendChild(o(g+12,i+42,"one array per sequence,",{size:9.5,fill:e.dim})),n.appendChild(o(g+12,i+58,"logical block → physical block",{size:9.5,fill:e.dim})),n.appendChild(o(g+12,i+84,"blocks need not be adjacent",{size:9.5,fill:e.fg})),n.appendChild(o(g+12,i+112,"now   "+r+" blocks · "+r*ye+" slots",{size:10,mono:!0,fill:e.teal})),n.appendChild(o(g+12,i+130,"waste "+C+" slots · "+Math.round(w/Math.max(1,r*ye)*100)+"% full",{size:10,mono:!0,fill:e.fg})),n.appendChild(o(g+12,i+154,"vs "+he.length*Z+" slots reserved",{size:9.5,fill:e.dim})),n.appendChild(o(20,232,"physical block pool · "+Xe+" blocks × "+ye+" slots",{size:10.5,fill:e.fg}));const s=131,m=68,k=10;for(let c=0;c<Xe;c++){const t=c%6,h=Math.floor(c/6),p=s+t*(m+k),f=250+h*60,l=a.find(A=>!A.queued&&A.map.indexOf(c)>=0);if(n.appendChild(o(p+2,f-5,"#"+c,{size:8,mono:!0,fill:l?l.color:e.dim})),n.appendChild(u("rect",{x:p,y:f,width:m,height:38,rx:7,fill:l?l.color:"none","fill-opacity":l?.07:0,stroke:l?l.color:e.line,"stroke-dasharray":l?"":"3 3","stroke-opacity":l?.6:.8})),!l){n.appendChild(o(p+m/2,f+23,"free",{anchor:"middle",size:9,fill:e.dim}));continue}const _=l.map.indexOf(c);for(let A=0;A<4;A++){const v=_*4+A,T=v<l.len,W=v===l.len-1;n.appendChild(u("rect",{x:p+3+A*16,y:f+4,width:15,height:30,rx:3,fill:T?l.color:"none","fill-opacity":T?W?.65:.32:0,stroke:T?W?e.fg:l.color:e.line,"stroke-dasharray":T?"":"2 2","stroke-opacity":T?.9:.55})),n.appendChild(o(p+3+A*16+7.5,f+23,T?String(v):"·",{anchor:"middle",size:7,mono:!0,fill:e.fg,opacity:T?1:.3}))}}n.appendChild(o(20,386,"Blocks need not be adjacent; the last block of a sequence may be only partly filled.",{size:10,fill:e.dim})),n.appendChild(o(20,404,"Real systems also share blocks across requests, with reference counts and copy-on-write on divergence.",{size:10,fill:e.dim}))}const ie=8,Ge=[{name:"A",color:e.accent,p:1,d0:2,d1:4},{name:"B",color:e.teal,p:1,d0:2,d1:7},{name:"C",color:e.purple,p:1,d0:2,d1:8},{name:"D",color:e.ok,p:5,d0:6,d1:8}];function kn(n){return n<=0?[]:Ge.filter(a=>n>=a.p&&n<=a.d1)}function gn(n){N(n,20,-36,150,me!==null?"❚❚ Pause":"▶ Run",Ln,L<ie||me!==null),N(n,180,-36,96,"Step ▸",Rn,L<ie),N(n,286,-36,96,"↺ Reset",Mn),n.appendChild(o(20,12,"iteration-level schedule · one column per forward pass",{size:10.5,fill:e.fg})),n.appendChild(o(520,12,"P = prefill · D = decode · queue = waiting",{size:9.5,fill:e.dim}));const a=100,r=72,w=60,C=s=>a+(s-.5)*r,g=s=>58+s*34;for(let s=1;s<=ie;s++)n.appendChild(o(C(s),46,String(s),{anchor:"middle",size:9.5,mono:!0,fill:s===L?e.fg:e.dim,weight:s===L?700:400}));L>0&&n.appendChild(u("rect",{x:C(L)-w/2-5,y:34,width:w+10,height:274,rx:8,fill:e.accent,"fill-opacity":.05,stroke:e.accent,"stroke-opacity":.25})),Ge.forEach((s,m)=>{const k=g(m);n.appendChild(o(24,k+18,s.name,{size:11,weight:700,fill:s.color}));for(let c=1;c<=ie;c++){const t=c===s.p,h=c>=s.d0&&c<=s.d1,p=c<s.p,f=c>s.d1&&!p,l=c===L,A=L>0&&c<=L?1:.22,v=t?"P":h?"D":p?"queue":"done",T=t?e.accent:h?s.color:e.dim;n.appendChild(u("rect",{x:C(c)-w/2,y:k,width:w,height:26,rx:6,fill:p||f?"none":T,"fill-opacity":p||f?0:l?.34:.2,stroke:p||f?e.line:T,"stroke-opacity":p||f?.7:l?1:.8,"stroke-dasharray":p||f?"3 3":"",opacity:A})),n.appendChild(o(C(c),k+17,v,{anchor:"middle",size:p?7.5:9,mono:!0,fill:t||h?e.fg:e.dim,opacity:A,weight:l?700:400}))}}),n.appendChild(o(24,218,"batch size",{size:9.5,fill:e.dim}));const i=280;for(let s=1;s<=ie;s++){const m=kn(s).length,k=m/3*36,c=s===L;n.appendChild(u("rect",{x:C(s)-16,y:i-k,width:32,height:k,rx:3,fill:e.accent,"fill-opacity":L>0&&s<=L?c?.8:.35:.12})),n.appendChild(o(C(s),i+12,String(m),{anchor:"middle",size:8.5,mono:!0,fill:c?e.fg:e.dim}))}n.appendChild(u("line",{x1:a,y1:i,x2:a+ie*r,y2:i,stroke:e.line})),n.appendChild(o(20,320,"A finishes after iteration 4, so its blocks return to the pool; D prefills in iteration 5.",{size:10.5,fill:e.fg})),n.appendChild(o(20,338,"The batch never drains between requests: finished sequences leave and queued ones join at iteration boundaries.",{size:10,fill:e.dim}))}const ke=10,Ne=14;let X=ke,G=ke,V=null;function Qe(n,a){const w=[0,1,V===a?a==="A"?7:8:2];return n>12&&w.push(a==="A"?9:10),w}function Ue(n){if(n===0)return{color:e.ok,refs:2,start:0,end:4};if(n===1)return{color:e.ok,refs:2,start:4,end:8};if(n===2){const a=V===null?e.ok:V==="A"?e.teal:e.accent,r=V===null?Math.min(X,G):V==="A"?G:X;return{color:a,refs:V===null?2:1,start:8,end:r}}return n===7?V==="A"?{color:e.accent,refs:1,start:8,end:X,cow:!0}:null:n===8?V==="B"?{color:e.teal,refs:1,start:8,end:G,cow:!0}:null:n===9?X>12?{color:e.accent,refs:1,start:12,end:X}:null:n===10&&G>12?{color:e.teal,refs:1,start:12,end:G}:null}function wn(n){N(n,20,-36,118,"Append A ▸",()=>Ze("A"),X<Ne),N(n,148,-36,118,"Append B ▸",()=>Ze("B"),G<Ne),N(n,276,-36,96,"↺ Reset",Kn),n.appendChild(o(20,12,"two requests share a "+ke+"-token system prompt · a block is shared until someone writes to it",{size:10.5,fill:e.fg})),[{name:"A",color:e.accent,len:X,map:Qe(X,"A")},{name:"B",color:e.teal,len:G,map:Qe(G,"B")}].forEach((i,s)=>{const m=42+s*42;n.appendChild(o(24,m+18,i.name,{size:12,weight:700,fill:i.color})),n.appendChild(o(24,m+31,"len "+i.len,{size:8,fill:e.dim})),i.map.forEach((k,c)=>{const t=64+c*90,h=Ue(k),p=h?h.color:e.dim;n.appendChild(o(t+2,m-4,"L"+c+"→#"+k,{size:8.5,mono:!0,fill:p})),n.appendChild(u("rect",{x:t,y:m,width:82,height:26,rx:6,fill:p,"fill-opacity":.12,stroke:p,"stroke-opacity":.8})),n.appendChild(o(t+41,m+17,"#"+k,{anchor:"middle",size:10,mono:!0,fill:e.fg})),h&&h.refs>1&&n.appendChild(o(t+76,m+10,"×"+h.refs,{anchor:"end",size:8,mono:!0,fill:e.ok}))})}),n.appendChild(u("rect",{x:455,y:24,width:245,height:118,rx:10,fill:e.panel,"fill-opacity":.5,stroke:e.line})),n.appendChild(o(467,45,"reference counts",{size:10.5,weight:700,fill:e.fg})),n.appendChild(o(467,64,"shared block = ×2",{size:9.5,fill:e.ok})),n.appendChild(o(467,82,"a write to a shared block",{size:9.5,fill:e.dim})),n.appendChild(o(467,98,"copies it before writing",{size:9.5,fill:e.dim})),n.appendChild(o(467,116,"only the writer's table changes",{size:9.5,fill:e.dim})),n.appendChild(o(467,134,"block #2: ×"+(V===null?2:1),{size:10,mono:!0,fill:V===null?e.ok:e.warn}));const r=V===null?"Both tables point at block #2 for tokens 8–9. Either request can fork it; neither can write in place.":V==="A"?"A copied #2 → #7 before writing; B still reads #2. Refcount on #2 is now 1.":"B copied #2 → #8 before writing; A still reads #2. Refcount on #2 is now 1.";n.appendChild(o(20,152,r,{size:10,fill:V===null?e.warn:e.ok})),n.appendChild(o(20,174,"physical pool · blocks with reference counts",{size:10.5,fill:e.fg}));const w=131,C=68,g=10;for(let i=0;i<12;i++){const s=i%6,m=Math.floor(i/6),k=w+s*(C+g),c=194+m*60,t=Ue(i),h="#"+i+(t?" ×"+t.refs:"")+(t&&t.cow?" · COW":"");if(n.appendChild(o(k+2,c-5,h,{size:8,mono:!0,fill:t?t.color:e.dim})),n.appendChild(u("rect",{x:k,y:c,width:C,height:38,rx:7,fill:t?t.color:"none","fill-opacity":t?.07:0,stroke:t?t.color:e.line,"stroke-dasharray":t?"":"3 3","stroke-opacity":t?.6:.8})),!t){n.appendChild(o(k+C/2,c+23,"free",{anchor:"middle",size:9,fill:e.dim}));continue}for(let p=0;p<4;p++){const f=t.start+p,l=f<t.end,_=l&&f===t.end-1&&t.end%4!==0;n.appendChild(u("rect",{x:k+3+p*16,y:c+4,width:15,height:30,rx:3,fill:l?t.color:"none","fill-opacity":l?_?.65:.32:0,stroke:l?_?e.fg:t.color:e.line,"stroke-dasharray":l?"":"2 2","stroke-opacity":l?.9:.55})),n.appendChild(o(k+3+p*16+7.5,c+23,l?String(f):"·",{anchor:"middle",size:7,mono:!0,fill:e.fg,opacity:l?1:.3}))}}n.appendChild(o(20,322,"A block is freed only when its reference count reaches zero.",{size:10,fill:e.dim})),n.appendChild(o(20,340,X>12&&G>12?"Private blocks #9/#10 hold the tokens past position 12; the shared prefix still has a refcount of 2.":X>12?"A's #9 holds the token past position 12; B's #10 is still free.":G>12?"B's #10 holds the token past position 12; A's #9 is still free.":"Copy-on-write keeps the shared prefix immutable until a request writes into its partial block.",{size:10,fill:e.dim}))}let j=0;const fe=[{id:"R1",matched:0,computed:7,step:1,prompt:"You are a helpful assistant. Answer:"},{id:"R2",matched:5,computed:1,step:2,prompt:"You are a helpful assistant. Summarize:"},{id:"R3",matched:7,computed:2,step:3,prompt:"You are a helpful assistant. Answer: in French:"},{id:"R4",matched:0,computed:3,step:4,prompt:"Translate this sentence:"}],Re=[{id:"root",label:"root",tokens:0,x:20,y:150,w:48,h:28,parent:null,createdAt:0},{id:"n1",label:"You are a helpful assistant.",tokens:5,x:95,y:150,w:215,h:28,parent:"root",createdAt:1},{id:"n2",label:"Answer:",tokens:2,x:345,y:82,w:82,h:28,parent:"n1",createdAt:1},{id:"n3",label:"Summarize:",tokens:1,x:345,y:200,w:98,h:28,parent:"n1",createdAt:2},{id:"n4",label:"in French:",tokens:2,x:455,y:82,w:96,h:28,parent:"n2",createdAt:3},{id:"n5",label:"Translate this sentence:",tokens:3,x:345,y:260,w:170,h:28,parent:"root",createdAt:4}];function bn(n){return Re.find(a=>a.id===n)}function _n(n){N(n,20,-36,170,j<fe.length?"▶ Send "+fe[j].id:"✓ All sent",Vn,j<fe.length),N(n,200,-36,96,"↺ Reset",On),n.appendChild(o(20,12,"one tree for every prefix · a node holds the cached KV for its token sequence",{size:10.5,fill:e.fg}));const a=t=>t.createdAt<=j;for(const t of Re){if(!a(t)||t.parent===null)continue;const h=bn(t.parent);if(!a(h))continue;const p=h.x+h.w,f=h.y+h.h/2,l=t.x,_=t.y+t.h/2,A=t.createdAt===j&&j>0?e.warn:e.ok,v=Math.abs(f-_)<1?"M "+p+" "+f+" L "+l+" "+_:"M "+p+" "+f+" C "+(p+40)+" "+f+", "+(l-40)+" "+_+", "+l+" "+_;n.appendChild(u("path",{d:v,fill:"none",stroke:A,"stroke-width":1.3,opacity:.75}))}for(const t of Re){if(!a(t))continue;const h=t.id==="root",p=!h&&t.createdAt===j&&j>0,f=h?e.dim:p?e.warn:e.ok;n.appendChild(u("rect",{x:t.x,y:t.y,width:t.w,height:t.h,rx:7,fill:f,"fill-opacity":h?.08:p?.2:.1,stroke:f,"stroke-width":p?1.5:1})),n.appendChild(o(t.x+t.w/2,t.y+18,t.label,{anchor:"middle",size:9.5,mono:!0,fill:h?e.dim:e.fg,weight:p?700:400})),h||n.appendChild(o(t.x+t.w/2,t.y+t.h+11,t.tokens+" tok",{anchor:"middle",size:8,fill:f}))}const r=570,w=36;n.appendChild(u("rect",{x:r,y:w,width:130,height:190,rx:10,fill:e.panel,"fill-opacity":.5,stroke:e.line})),n.appendChild(o(r+10,w+20,"requests",{size:10.5,weight:700,fill:e.fg})),n.appendChild(o(r+10,w+34,"matched + new",{size:8,fill:e.dim})),fe.forEach((t,h)=>{const p=w+58+h*32,f=j>=t.step,l=j===t.step,_=l?e.warn:f?e.ok:e.dim;n.appendChild(o(r+10,p,t.id,{size:10,mono:!0,fill:_,weight:l?700:400})),n.appendChild(o(r+38,p,t.matched+" + "+t.computed,{size:9,mono:!0,fill:_}))});const g=fe.filter(t=>t.step<=j).reduce((t,h)=>t+h.matched+h.computed,0),i=Re.filter(a).reduce((t,h)=>t+h.tokens,0),s=25,m=220,k=430,c=fe[Math.min(j===0?0:j-1,fe.length-1)];n.appendChild(o(20,306,c.id+" · "+c.prompt,{size:9.5,fill:e.dim})),n.appendChild(o(20,326,"KV computed across the requests so far",{size:10.5,fill:e.fg})),g>0&&n.appendChild(o(650,318,Math.round((1-i/g)*100)+"% less KV",{anchor:"end",size:10.5,weight:700,fill:e.ok})),n.appendChild(o(20,342,"with reuse",{size:9.5,fill:e.ok})),n.appendChild(u("rect",{x:m,y:332,width:Math.max(2,i/s*k),height:12,rx:3,fill:e.ok,"fill-opacity":.7})),n.appendChild(o(m+i/s*k+8,342,i+" tok",{size:9,mono:!0,fill:e.ok})),n.appendChild(o(20,366,"without reuse",{size:9.5,fill:e.dim})),n.appendChild(u("rect",{x:m,y:356,width:Math.max(2,g/s*k),height:12,rx:3,fill:e.dim,"fill-opacity":.35})),n.appendChild(o(m+g/s*k+8,366,g+" tok",{size:9,mono:!0,fill:e.dim})),n.appendChild(o(20,396,"A node is a token sequence with its KV; two requests share a node while their prefixes agree.",{size:10,fill:e.dim})),n.appendChild(o(20,414,"When they diverge the node splits; unused leaves are evicted LRU, while shared ancestors survive.",{size:10,fill:e.dim}))}const Le=8,J=3;function yn(n){N(n,20,-36,190,Y?"↺ Reset prompt":"▶ Send long prompt",Dn),n.appendChild(o(20,12,Y?"a 256-token prompt arrives at iteration "+J:"steady state · only decode is running",{size:10.5,fill:e.fg}));const a=150,r=62,w=54,C=i=>a+(i-1)*r+w/2;for(let i=1;i<=Le;i++)n.appendChild(o(C(i),44,String(i),{anchor:"middle",size:9,mono:!0,fill:e.dim}));n.appendChild(o(700,58,"iteration (time) →",{anchor:"end",size:8.5,fill:e.dim}));const g=(i,s,m,k,c=!0,t=!1)=>{const h=a+(i-1)*r+4;n.appendChild(u("rect",{x:h,y:s,width:w,height:24,rx:6,fill:c?k:"none","fill-opacity":c?.18:0,stroke:k,"stroke-opacity":c?.8:.45,"stroke-dasharray":t?"3 2":""})),n.appendChild(o(h+w/2,s+16,m,{anchor:"middle",size:8.5,mono:!0,fill:c?e.fg:e.dim,opacity:c?1:.6}))};n.appendChild(u("rect",{x:12,y:26,width:696,height:140,rx:10,fill:e.panel,"fill-opacity":.42,stroke:e.line})),n.appendChild(o(20,46,"colocated · unchunked",{size:10.5,weight:700,fill:e.fg})),n.appendChild(o(20,60,"one pool · prefill and decode share a batch",{size:9,fill:e.dim})),n.appendChild(o(20,90,"A/B/C decode",{size:9.5,fill:e.accent})),n.appendChild(o(20,120,"long prompt",{size:9.5,fill:e.warn}));for(let i=1;i<=Le;i++){const s=Y&&i>=J&&i<=J+1;g(i,74,s?"stall":"D",s?e.bad:e.accent,!0,s),Y?i<J?g(i,104,"queue",e.warn,!0,!0):i<=J+1?g(i,104,"P",e.warn):g(i,104,"D",e.ok):g(i,104,"—",e.line,!1)}n.appendChild(o(20,154,Y?"decode stalls for 2 iterations → ITL spike":"all three requests decode every iteration",{size:9.5,fill:Y?e.bad:e.dim})),n.appendChild(u("rect",{x:12,y:304,width:696,height:184,rx:10,fill:e.panel,"fill-opacity":.42,stroke:e.line})),n.appendChild(o(20,324,"disaggregated",{size:10.5,weight:700,fill:e.fg})),n.appendChild(o(20,338,"separate pools · KV handoff",{size:9,fill:e.dim})),n.appendChild(o(700,324,"P:D = 1:4 · example",{anchor:"end",size:9,fill:e.dim})),n.appendChild(o(20,374,"prefill P0",{size:9.5,fill:e.warn})),n.appendChild(o(20,404,"decode D0",{size:9.5,fill:e.accent})),n.appendChild(o(20,434,"long prompt",{size:9.5,fill:e.ok}));for(let i=1;i<=Le;i++)!Y||i<J||i>J+1?g(i,360,"—",e.line,!1):g(i,360,"P",e.warn),g(i,390,"D",e.accent),Y?i<J?g(i,420,"queue",e.warn,!0,!0):i<=J+1?g(i,420,"wait",e.dim,!0,!0):g(i,420,"D",e.ok):g(i,420,"—",e.line,!1);Y?(n.appendChild(o(20,458,"KV blocks move P0 → D0 before the first decode token",{size:9.5,fill:e.teal})),n.appendChild(o(20,474,"decode keeps running if D has capacity · TTFT pays the handoff",{size:9.5,fill:e.ok}))):n.appendChild(o(20,458,"no long prompt · both deployments are in steady state",{size:9.5,fill:e.dim})),n.appendChild(u("rect",{x:12,y:176,width:696,height:118,rx:10,fill:e.panel,"fill-opacity":.42,stroke:e.line})),n.appendChild(o(20,196,"colocated + chunked prefill",{size:10.5,weight:700,fill:e.fg})),n.appendChild(o(20,210,"same pool · prompt split into chunks",{size:9,fill:e.dim})),n.appendChild(o(20,234,"A/B/C decode",{size:9.5,fill:e.accent})),n.appendChild(o(20,264,"long prompt",{size:9.5,fill:e.warn}));for(let i=1;i<=Le;i++)g(i,224,"D",e.accent),Y?i<J?g(i,254,"queue",e.warn,!0,!0):i<=J+3?g(i,254,"P",e.warn):g(i,254,"D",e.ok):g(i,254,"—",e.line,!1);n.appendChild(o(20,286,Y?"no decode gaps · the new prompt's first token slips to iteration 7":"no long prompt · steady state",{size:9.5,fill:Y?e.ok:e.dim})),n.appendChild(o(20,506,"Why split",{size:10.5,weight:700,fill:e.fg})),n.appendChild(o(20,522,"prefill is compute-bound; decode is memory-bound",{size:9.5,fill:e.dim})),n.appendChild(o(20,538,"size the two pools independently",{size:9.5,fill:e.dim})),n.appendChild(o(20,554,"chunked prefill is the usual baseline",{size:9.5,fill:e.dim})),n.appendChild(o(360,506,"What it costs",{size:10.5,weight:700,fill:e.fg})),n.appendChild(o(360,522,"KV transfer adds to TTFT",{size:9.5,fill:e.dim})),n.appendChild(o(360,538,"P:D imbalance can still queue decode",{size:9.5,fill:e.dim})),n.appendChild(o(360,554,"placement, more queues, more failure modes",{size:9.5,fill:e.dim})),n.appendChild(o(20,578,"Chunked prefill avoids the stall without a second pool; it just delays the new prompt's first token.",{size:9.5,fill:e.dim}))}function Cn(n){const a=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),r=new Set(["def","if","else","elif","while","for","in","return","break","continue","not","and","or","is","lambda","yield","pass","raise","try","except","finally","with","as","import","from","class","async","await"]),w=new Set(["len","range","copy","ceil","print","int","float","str","list","dict","set","tuple","bool","deque","dataclass","asyncio","None","True","False","Node"]),C=new Set(["Tensor","Sequence","KVBlock","RadixNode","BlockPool","KVTensor","Protocol","Worker"]),g=i=>{const s=/("""[^"]*"""|"[^"]*"|'[^']*')|(#[^\n]*)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\sA-Za-z0-9_]+)/g;let m="",k="",c;for(;(c=s.exec(i))!==null;){const[t,h,p,f,l,_,A]=c;if(h)m+='<span class="tok-str">'+a(h)+"</span>";else if(p)m+='<span class="tok-com">'+a(p)+"</span>";else if(f)m+='<span class="tok-num">'+a(f)+"</span>";else if(l){const v=r.has(l)?"tok-kw":k==="def"?"tok-fn":C.has(l)?"tok-type":w.has(l)?"tok-builtin":"";m+=v?'<span class="'+v+'">'+a(l)+"</span>":a(l),k=l;continue}else if(_){m+=_;continue}else A&&(m+='<span class="tok-op">'+a(A)+"</span>");k=t}return m||" "};n.querySelectorAll("pre").forEach(i=>{const s=i.previousElementSibling,m=s&&s.tagName==="H3"?(s.textContent||"pseudocode").split(":")[0]:"pseudocode",k=(i.textContent||"").replace(/\n$/,"").split(`
`),c=document.createElement("div");c.className="code-card";const t=document.createElement("div");t.className="code-head",t.innerHTML='<span class="code-dots"><i></i><i></i><i></i></span><span class="code-title"></span><span class="code-lang">python</span>';const h=t.querySelector(".code-title");h&&(h.textContent=m);const p=document.createElement("code");k.forEach((l,_)=>{const A=document.createElement("span");A.className="code-line";const v=document.createElement("span");v.className="ln",v.textContent=String(_+1);const T=document.createElement("span");T.className="lc",T.innerHTML=g(l),A.append(v,T),p.appendChild(A)});const f=document.createElement("pre");f.appendChild(p),c.append(t,f),i.replaceWith(c)})}function xn(n){const a=(r,w,C,g,i,s)=>{n.appendChild(u("rect",{x:r,y:w,width:C,height:50,rx:8,fill:e.panel,"fill-opacity":.7,stroke:s,"stroke-opacity":.7})),n.appendChild(o(r+12,w+21,g,{size:10.5,weight:700,fill:e.fg})),n.appendChild(o(r+12,w+38,i,{size:8.5,fill:e.dim}))};n.appendChild(o(20,24,"control plane",{size:9.5,weight:700,fill:e.accent})),a(20,40,150,"scheduler","admit · batch · SLO",e.accent),a(190,40,160,"radix cache","prefix match · LRU",e.ok),a(370,40,150,"block manager","alloc · refcount",e.purple),a(540,40,150,"handoff","KV to decode pool",e.teal),D(n,170,65,190,65,e.dim,"arw-d"),D(n,350,65,370,65,e.dim,"arw-d"),D(n,520,65,540,65,e.dim,"arw-d"),n.appendChild(o(20,134,"data plane",{size:9.5,weight:700,fill:e.teal})),a(20,150,150,"attention","gather K/V by table",e.accent),a(190,150,160,"KV pool","physical blocks",e.purple),a(370,150,150,"prefill / decode","one iteration",e.ok),a(540,150,150,"append / evict","write KV · drop LRU",e.teal),D(n,170,175,190,175,e.dim,"arw-d"),D(n,350,175,370,175,e.dim,"arw-d"),D(n,520,175,540,175,e.dim,"arw-d"),n.appendChild(u("line",{x1:95,y1:90,x2:95,y2:150,stroke:e.accent,"stroke-width":1.2,"stroke-dasharray":"3 3","marker-end":"url(#arw-a)"})),n.appendChild(o(105,124,"block table / batch",{size:8.5,fill:e.dim})),D(n,690,220,20,220,e.dim,"arw-d"),n.appendChild(o(355,236,"next iteration",{anchor:"middle",size:8.5,fill:e.dim}))}function zn(n){return on[Math.max(0,Math.min(n,qe))]}function Ce(){se!==null&&(window.clearTimeout(se),se=null),le=!1}function vn(){if(le){Ce(),S();return}Q>=qe&&(Q=0),le=!0;const n=()=>{if(le){if(Q>=qe){le=!1,se=null,S();return}Q+=1,S(),se=window.setTimeout(n,750)}};se=window.setTimeout(n,450),S()}function An(n){const{blocks:a,seqs:r,log:w}=zn(Q),C=s=>s==="A"?e.accent:s==="B"?e.ok:e.purple,g=s=>s.owners.length>1?e.warn:s.owners.length===1?C(s.owners[0]):e.dim;n.appendChild(o(20,24,"step "+Q+" / "+qe,{size:9.5,weight:700,fill:e.dim})),n.appendChild(o(350,24,"physical block pool · refs / fill",{size:9.5,weight:700,fill:e.dim})),r.forEach((s,m)=>{const k=48+m*78,c=C(s.id);n.appendChild(u("rect",{x:20,y:k,width:300,height:68,rx:9,fill:e.panel,"fill-opacity":.65,stroke:c,"stroke-opacity":.7})),n.appendChild(o(34,k+22,"request "+s.id,{size:11,weight:700,fill:c})),n.appendChild(o(286,k+22,s.phase,{anchor:"end",size:9,fill:s.phase==="done"?e.dim:c})),n.appendChild(o(34,k+40,"prompt "+s.promptLen+" · decoded "+s.produced+"/"+s.decodeTotal,{size:9.5,fill:e.dim})),n.appendChild(o(34,k+59,"blocks",{size:8.5,fill:e.dim})),s.table.forEach((t,h)=>{const p=78+h*34,f=g(a[t]);n.appendChild(u("rect",{x:p,y:k+48,width:28,height:16,rx:4,fill:f,"fill-opacity":.2,stroke:f})),n.appendChild(o(p+14,k+60,String(t),{anchor:"middle",size:8.5,mono:!0,fill:e.fg}))})}),r.length===0&&n.appendChild(o(20,80,"no requests yet — press Run or Step",{size:10,fill:e.dim})),a.forEach((s,m)=>{const k=m%4,c=Math.floor(m/4),t=350+k*90,h=48+c*78,p=g(s);n.appendChild(u("rect",{x:t,y:h,width:82,height:68,rx:8,fill:e.panel,"fill-opacity":s.refs?.8:.35,stroke:p,"stroke-opacity":s.refs?.9:.4})),n.appendChild(o(t+8,h+16,"#"+s.id,{size:9.5,weight:700,fill:s.refs?e.fg:e.dim})),n.appendChild(o(t+74,h+16,"refs "+s.refs,{anchor:"end",size:8,fill:e.dim})),n.appendChild(o(t+8,h+34,s.owners.length?s.owners.join("+"):"free",{size:8.5,fill:s.refs?p:e.dim}));for(let f=0;f<4;f++)n.appendChild(u("rect",{x:t+8+f*16,y:h+44,width:13,height:10,rx:2,fill:f<s.fill?p:"none","fill-opacity":.55,stroke:f<s.fill?p:e.line}));n.appendChild(o(t+8,h+64,s.fill+"/4",{size:8,fill:e.dim}))}),n.appendChild(u("rect",{x:360,y:220,width:390,height:260,rx:9,fill:e.panel,"fill-opacity":.45,stroke:e.line})),n.appendChild(o(372,242,"event log",{size:9.5,weight:700,fill:e.dim}));const i=w.slice(-7);i.length===0?n.appendChild(o(372,266,"the schedule starts empty",{size:9.5,fill:e.dim})):i.forEach((s,m)=>{n.appendChild(o(372,266+m*23,String(w.length-i.length+m+1).padStart(2,"0")+" · "+s,{size:9.5,fill:m===i.length-1?e.fg:e.dim}))}),N(n,20,500,86,"▶ Step",()=>{Ce(),Q<qe&&(Q+=1),S()}),N(n,116,500,86,le?"⏸ Pause":"▶ Run",()=>{vn()}),N(n,212,500,86,"↺ Reset",()=>{Ce(),Q=0,S()}),n.appendChild(o(20,548,"A and B share blocks 0–1; A's first decode copies block 1.",{size:8.5,fill:e.dim}))}const qn=[an,rn,pn,hn,fn,mn,gn,wn,_n,yn,xn,An];function Sn(n){return[]}function Tn(){pe<4&&(pe+=1),S()}function Bn(){pe=0,S()}function En(){te<3&&(te+=1),S()}function Pn(){ue||(ue=!0,Ee=te),S()}function Nn(){te=0,ue=!1,Ee=0,S()}function we(){me!==null&&(window.clearInterval(me),me=null)}function Rn(){we(),L<ie&&(L+=1),S()}function Ln(){if(me!==null){we(),S();return}L>=ie&&(L=0),S(),me=window.setInterval(()=>{L<ie&&(L+=1,S()),L>=ie&&(we(),S())},760)}function Mn(){we(),L=0,S()}function Ze(n){if(n==="A"){if(X>=Ne)return;V===null&&(V="A"),X+=1}else{if(G>=Ne)return;V===null&&(V="B"),G+=1}S()}function Kn(){X=ke,G=ke,V=null,S()}function Vn(){j<fe.length&&(j+=1),S()}function On(){j=0,S()}function Dn(){Y=!Y,S()}function jn(){Ve||(d=d>=Se?Ke:d+1,x=!1,S())}function Wn(){ge!==null&&window.clearTimeout(ge),d>=Se&&(d=Ke),x=!0,S(),ge=window.setTimeout(()=>{ge=null,jn()},620)}function je(){ae!==null&&(window.clearInterval(ae),ae=null)}function In(){if(ae!==null){je(),S();return}oe>=3&&(oe=0),S(),ae=window.setInterval(()=>{oe+=1,oe>=3&&(oe=3,je()),S()},800)}function Yn(){je(),oe=0,S()}function Me(){re!==null&&(window.clearInterval(re),re=null)}function Hn(){if(re!==null){Me(),S();return}U>=be&&(U=0),S(),re=window.setInterval(()=>{U+=1,U>=be&&(U=be,Me()),S()},900)}function Fn(){Me(),U=Math.min(be,U+1),S()}function Xn(){Me(),U=0,S()}function S(){Ve||(H=Math.min(H,d-1),He.forEach((n,a)=>{n.svg.textContent="";const r=u("defs");r.append(Te("arw-a",e.accent),Te("arw-t",e.teal),Te("arw-d",e.dim),Te("arw-g",e.ok),Te("arw-w",e.warn)),n.svg.appendChild(r),qn[a](n.svg),n.cards.textContent="";const w=Sn();for(const C of w){const g=document.createElement("div");g.className="ill-card";const i=document.createElement("div");i.className="k",i.textContent=C.k;const s=document.createElement("div");if(s.className="v",s.textContent=C.v,g.append(i,s),C.hint){const m=document.createElement("div");m.className="ill-card-hint",m.textContent=C.hint,g.appendChild(m)}n.cards.appendChild(g)}}))}return S(),{reset(){d=Ke,pe=0,te=0,ue=!1,Ee=0,L=0,X=ke,G=ke,V=null,j=0,Y=!1,Ce(),Q=0,we(),S()},destroy(){Ve=!0,ge!==null&&window.clearTimeout(ge),I!==null&&window.clearInterval(I),ae!==null&&window.clearInterval(ae),re!==null&&window.clearInterval(re),Ce(),we()}}};export{mo as default};
