import{s as Xn}from"./code-highlight-Ct8t2e3l.js";const Gn=`from __future__ import annotations

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
`,Jn=`import asyncio
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
`,ve={coreObjects:Gn.trim(),pagedAttention:Qn.trim(),radixAttention:Un.trim(),scheduler:Zn.trim(),handoff:Jn.trim()},$n=[{blocks:[{id:0,refs:0,fill:0,owners:[]},{id:1,refs:0,fill:0,owners:[]},{id:2,refs:0,fill:0,owners:[]},{id:3,refs:0,fill:0,owners:[]},{id:4,refs:0,fill:0,owners:[]},{id:5,refs:0,fill:0,owners:[]},{id:6,refs:0,fill:0,owners:[]},{id:7,refs:0,fill:0,owners:[]}],seqs:[],log:[]},{blocks:[{id:0,refs:1,fill:4,owners:["A"]},{id:1,refs:1,fill:2,owners:["A"]},{id:2,refs:0,fill:0,owners:[]},{id:3,refs:0,fill:0,owners:[]},{id:4,refs:0,fill:0,owners:[]},{id:5,refs:0,fill:0,owners:[]},{id:6,refs:0,fill:0,owners:[]},{id:7,refs:0,fill:0,owners:[]}],seqs:[{id:"A",promptLen:6,decodeTotal:2,produced:0,table:[0,1],phase:"decode"}],log:["A prefill complete → blocks 0–1"]},{blocks:[{id:0,refs:2,fill:4,owners:["A","B"]},{id:1,refs:2,fill:2,owners:["A","B"]},{id:2,refs:0,fill:0,owners:[]},{id:3,refs:0,fill:0,owners:[]},{id:4,refs:0,fill:0,owners:[]},{id:5,refs:0,fill:0,owners:[]},{id:6,refs:0,fill:0,owners:[]},{id:7,refs:0,fill:0,owners:[]}],seqs:[{id:"A",promptLen:6,decodeTotal:2,produced:0,table:[0,1],phase:"decode"},{id:"B",promptLen:6,decodeTotal:2,produced:0,table:[0,1],phase:"decode"}],log:["A prefill complete → blocks 0–1","B prefix hit → shares 0–1"]},{blocks:[{id:0,refs:2,fill:4,owners:["A","B"]},{id:1,refs:1,fill:2,owners:["B"]},{id:2,refs:1,fill:3,owners:["A"]},{id:3,refs:0,fill:0,owners:[]},{id:4,refs:0,fill:0,owners:[]},{id:5,refs:0,fill:0,owners:[]},{id:6,refs:0,fill:0,owners:[]},{id:7,refs:0,fill:0,owners:[]}],seqs:[{id:"A",promptLen:6,decodeTotal:2,produced:1,table:[0,2],phase:"decode"},{id:"B",promptLen:6,decodeTotal:2,produced:0,table:[0,1],phase:"decode"}],log:["A prefill complete → blocks 0–1","B prefix hit → shares 0–1","A decode · COW block 1 → 2"]},{blocks:[{id:0,refs:2,fill:4,owners:["A","B"]},{id:1,refs:1,fill:3,owners:["B"]},{id:2,refs:1,fill:3,owners:["A"]},{id:3,refs:0,fill:0,owners:[]},{id:4,refs:0,fill:0,owners:[]},{id:5,refs:0,fill:0,owners:[]},{id:6,refs:0,fill:0,owners:[]},{id:7,refs:0,fill:0,owners:[]}],seqs:[{id:"A",promptLen:6,decodeTotal:2,produced:1,table:[0,2],phase:"decode"},{id:"B",promptLen:6,decodeTotal:2,produced:1,table:[0,1],phase:"decode"}],log:["A prefill complete → blocks 0–1","B prefix hit → shares 0–1","A decode · COW block 1 → 2","B decode · writes block 1 in place"]},{blocks:[{id:0,refs:2,fill:4,owners:["A","B"]},{id:1,refs:1,fill:3,owners:["B"]},{id:2,refs:1,fill:4,owners:["A"]},{id:3,refs:0,fill:0,owners:[]},{id:4,refs:0,fill:0,owners:[]},{id:5,refs:0,fill:0,owners:[]},{id:6,refs:0,fill:0,owners:[]},{id:7,refs:0,fill:0,owners:[]}],seqs:[{id:"A",promptLen:6,decodeTotal:2,produced:2,table:[0,2],phase:"done"},{id:"B",promptLen:6,decodeTotal:2,produced:1,table:[0,1],phase:"decode"}],log:["A prefill complete → blocks 0–1","B prefix hit → shares 0–1","A decode · COW block 1 → 2","B decode · writes block 1 in place","A hits max_new_tokens · done"]},{blocks:[{id:0,refs:2,fill:4,owners:["A","B"]},{id:1,refs:1,fill:3,owners:["B"]},{id:2,refs:1,fill:4,owners:["A"]},{id:3,refs:1,fill:4,owners:["C"]},{id:4,refs:1,fill:1,owners:["C"]},{id:5,refs:0,fill:0,owners:[]},{id:6,refs:0,fill:0,owners:[]},{id:7,refs:0,fill:0,owners:[]}],seqs:[{id:"A",promptLen:6,decodeTotal:2,produced:2,table:[0,2],phase:"done"},{id:"B",promptLen:6,decodeTotal:2,produced:1,table:[0,1],phase:"decode"},{id:"C",promptLen:5,decodeTotal:1,produced:0,table:[3,4],phase:"decode"}],log:["A prefill complete → blocks 0–1","B prefix hit → shares 0–1","A decode · COW block 1 → 2","B decode · writes block 1 in place","A hits max_new_tokens · done","C prefill complete → blocks 3–4"]},{blocks:[{id:0,refs:2,fill:4,owners:["A","B"]},{id:1,refs:1,fill:3,owners:["B"]},{id:2,refs:1,fill:4,owners:["A"]},{id:3,refs:1,fill:4,owners:["C"]},{id:4,refs:1,fill:2,owners:["C"]},{id:5,refs:0,fill:0,owners:[]},{id:6,refs:0,fill:0,owners:[]},{id:7,refs:0,fill:0,owners:[]}],seqs:[{id:"A",promptLen:6,decodeTotal:2,produced:2,table:[0,2],phase:"done"},{id:"B",promptLen:6,decodeTotal:2,produced:1,table:[0,1],phase:"decode"},{id:"C",promptLen:5,decodeTotal:1,produced:1,table:[3,4],phase:"done"}],log:["A prefill complete → blocks 0–1","B prefix hit → shares 0–1","A decode · COW block 1 → 2","B decode · writes block 1 in place","A hits max_new_tokens · done","C prefill complete → blocks 3–4","C decode · done"]},{blocks:[{id:0,refs:2,fill:4,owners:["A","B"]},{id:1,refs:1,fill:4,owners:["B"]},{id:2,refs:1,fill:4,owners:["A"]},{id:3,refs:1,fill:4,owners:["C"]},{id:4,refs:1,fill:2,owners:["C"]},{id:5,refs:0,fill:0,owners:[]},{id:6,refs:0,fill:0,owners:[]},{id:7,refs:0,fill:0,owners:[]}],seqs:[{id:"A",promptLen:6,decodeTotal:2,produced:2,table:[0,2],phase:"done"},{id:"B",promptLen:6,decodeTotal:2,produced:2,table:[0,1],phase:"done"},{id:"C",promptLen:5,decodeTotal:1,produced:1,table:[3,4],phase:"done"}],log:["A prefill complete → blocks 0–1","B prefix hit → shares 0–1","A decode · COW block 1 → 2","B decode · writes block 1 in place","A hits max_new_tokens · done","C prefill complete → blocks 3–4","C decode · done","B decode · done"]}],eo={frames:$n},no="http://www.w3.org/2000/svg",Ae=String.raw,e={fg:"#e6edf3",dim:"#8b949e",line:"#2a3140",panel:"#161b22",panel2:"#1c2230",accent:"#58a6ff",ok:"#3fb950",warn:"#d29922",bad:"#f85149",teal:"#39c5cf",purple:"#a371f7"},on=eo.frames,qe=on.length-1,oo=2,We=8,Ke=4,Se=12,be=4,de=["<s>","a","small","model","writes","text","one","token","at","a","time","and"];function io(...b){let d=2166136261;for(const w of b)d=Math.imul(d^(w|0),16777619),d^=d>>>15;return d>>>0}const Je=(...b)=>io(...b)/4294967296;function Ye(...b){const d=Math.max(1e-6,Je(...b,977)),w=Je(...b,131);return Math.sqrt(-2*Math.log(d))*Math.cos(2*Math.PI*w)}const $e=new Map;function tn(b,d){const w=$e.get(b);if(w)return w;const v=d();return $e.set(b,v),v}function ln(b){const d=[];let w=0;for(let C=0;C<We;C++)d.push(b(C)),w+=d[C]*d[C];const v=Math.sqrt(w)||1;for(let C=0;C<We;C++)d[C]/=v;return d}const sn=(b,d,w)=>tn("k:"+b+":"+d+":"+w,()=>ln(v=>Ye(b,d,w,v,11))),to=(b,d,w)=>tn("q:"+b+":"+d+":"+w,()=>{const v=sn(b,d,Math.max(0,w-1));return ln(C=>.85*v[C]+.55*Ye(b,d,w,C,33))});function dn(b){const d=Math.max(...b),w=b.map(C=>Math.exp(C-d)),v=w.reduce((C,P)=>C+P,0)||1;return w.map(C=>C/v)}const lo=(b,d)=>{let w=0;for(let v=0;v<We;v++)w+=b[v]*d[v];return w},so=3.2;function en(b,d,w){if(w<=0)return[];const v=to(b,d,w),C=[];for(let P=0;P<w;P++)C.push(so*lo(v,sn(b,d,P)));return dn(C)}function nn(b){const d=b<de.length?de[b]:"",w=de.map((v,C)=>1.4*Ye(b+1,C,71)+(v===d?6:0));return dn(w)}function f(b,d={}){const w=document.createElementNS(no,b);for(const[v,C]of Object.entries(d))w.setAttribute(v,String(C));return w}function o(b,d,w,v={}){const C=f("text",{x:b,y:d,fill:v.fill??e.dim,"font-size":v.size??11,"text-anchor":v.anchor??"start","font-family":v.mono===!0?"ui-monospace, SFMono-Regular, Menlo, monospace":"inherit"});return v.opacity!==void 0&&C.setAttribute("opacity",String(v.opacity)),v.weight!==void 0&&C.setAttribute("font-weight",String(v.weight)),C.textContent=w,C}function co(b){const d=[];let w=0;for(;w<b.length;){const v=b[w];if((v==="_"||v==="^")&&w+1<b.length){const C=v==="_"?"sub":"sup";if(w+=1,b[w]==="{"){const P=b.indexOf("}",w),H=b.slice(w+1,P<0?b.length:P);d.push({text:H,kind:C}),w=P<0?b.length:P+1}else d.push({text:b[w],kind:C}),w+=1}else{let C=w;for(;C<b.length&&b[C]!=="_"&&b[C]!=="^";)C+=1;d.push({text:b.slice(w,C),kind:"base"}),w=C}}return d}const ao="ui-monospace, SFMono-Regular, Menlo, monospace";function ro(b,d){let w=0;for(const v of b)w+=v.text.length*(v.kind==="base"?d*.6:d*.42);return w}function Ie(b,d,w,v,C={}){const P=C.size??12,H=co(v),W=C.align==="center"?d-ro(H,P)/2:d,Q=f("text",{x:W,y:w,"font-size":P,fill:C.color??e.fg,"font-family":ao});let le=W,se=0;for(const ce of H){const oe=ce.kind==="base"?0:ce.kind==="sub"?P*.3:-P*.42,U=f("tspan",{x:le,dy:oe-se,"font-size":ce.kind==="base"?P:P*.72});U.textContent=ce.text,Q.appendChild(U),se=oe,le+=ce.text.length*(ce.kind==="base"?P*.6:P*.42)}b.appendChild(Q)}function Be(b,d){const w=f("marker",{id:b,viewBox:"0 0 10 10",refX:"9",refY:"5",markerWidth:"5",markerHeight:"5",orient:"auto-start-reverse"});return w.appendChild(f("path",{d:"M 0 0 L 10 5 L 0 10 z",fill:d})),w}function D(b,d,w,v,C,P,H,W=1.2){b.appendChild(f("line",{x1:d,y1:w,x2:v,y2:C,stroke:P,"stroke-width":W,"marker-end":"url(#"+H+")"}))}const po=720,ho=56;function fo(b){return b.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Te(b,d,w){return"<h3>"+b+"</h3><pre><code>"+fo(d)+"</code></pre>"+w}const uo=[{id:"layer",title:"The Transformer Architecture",blurb:"Let [t] denote the sequence [0, ..., T] of indices and t be an element. The input vectors h_[t] go through (1) the normalization layer and the MLP layer that projects to QKV features, (2) causal self-attention across [t], (3) normalization, MLP bottleneck and residual connection",h:710,top:44},{id:"next-token-prediction",title:"Next Token Prediction",blurb:"A token is an element of the vocabulary. Every token is mapped to a probability distribution of the next token.",h:380,top:44},{id:"prefill",title:"The Prefill Stage",blurb:"This is the standard forward pass of the transformer on an input sequence with causal attention.",h:640,top:44},{id:"decode",title:"The Decode Stage",blurb:"Each step we sample the next token, then repeat the forward pass with the updated token sequence. We only need to compute the QKV for the new token and its attention to the past, which only needs K and V.",h:640,top:44},{id:"contiguous",title:"The Cost of Contiguity",blurb:"The cache is now the thing to store, and it grows one token at a time. A serving system that gives each request one contiguous buffer has to reserve the longest sequence it might produce up front — so most of the cache is allocated but empty.",h:310,top:44},{id:"paged",title:"PagedAttention: Blocks, Not Buffers",blurb:"PagedAttention cuts the cache into fixed-size physical blocks. Each sequence keeps a block table mapping its logical blocks to blocks anywhere in the pool, so memory is allocated on demand and a sequence's cache never has to be contiguous.",h:430,top:44},{id:"batching",title:"Continuous Batching",blurb:"Once the cache is paged, the scheduler can reconsider the batch on every forward pass. A finished request returns its blocks immediately and a queued request joins the next iteration — no waiting for the slowest sequence to finish.",h:360,top:44},{id:"sharing",title:"Sharing Blocks: Copy-on-Write",blurb:"A block table makes sharing cheap: two requests can point at the same physical block. Each block keeps a reference count, and a write to a shared block triggers copy-on-write — copy the block, update one table, and leave the other request untouched.",h:350,top:44},{id:"radix",title:"RadixAttention: One Tree of Prefixes",blurb:"RadixAttention sits on top of paged blocks: the cache becomes a radix tree keyed by token sequences. A request walks the tree to its longest matching prefix, reuses those KV blocks, and computes only the unmatched suffix. Shared ancestors stay put while leaves are evicted LRU.",h:430,top:44},{id:"disagg",title:"Prefill / Decode Disaggregation",blurb:"Without chunked prefill, a long prompt on a shared worker stalls decode behind it. Chunked prefill interleaves prompt chunks with decode; disaggregation goes further, giving prefill and decode separate pools and handing the prompt's KV blocks from the prefill worker to the decode worker over the interconnect.",h:600,top:44},{id:"pseudocode",title:"Pseudocode: The Serving Loop",blurb:"Every diagram above is a data-structure cartoon. Here is the code behind it: a block table with copy-on-write, a radix prefix matcher, an iteration-level scheduler, and a prefill/decode handoff. The snippets are runnable toy implementations; §12 replays frames generated from them. The links point to production implementations.",h:250,top:44,prose:["<p>Toy implementation with lightweight Python types, not drop-in API calls. The snippets are kept as standalone Python files and rendered here verbatim.</p>",Te("Core objects",ve.coreObjects,'<p class="ill-refs">Types are illustrative; vLLM uses <a href="https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/block_pool.py">KVCacheBlock / BlockPool</a>, SGLang uses <a href="https://github.com/sgl-project/sglang/blob/main/python/sglang/srt/mem_cache/radix_cache.py">TreeNode / RadixKey</a>.</p>'),Te("PagedAttention: block table + copy-on-write",ve.pagedAttention,'<p class="ill-refs"><a href="https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/kv_cache_manager.py">vLLM KVCacheManager</a> · <a href="https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/block_pool.py">BlockPool</a> · <a href="https://arxiv.org/abs/2309.06180">PagedAttention paper</a></p>'),Te("RadixAttention: longest-prefix match",ve.radixAttention,'<p class="ill-refs"><a href="https://github.com/sgl-project/sglang/blob/main/python/sglang/srt/mem_cache/radix_cache.py">SGLang radix_cache.py</a> · <a href="https://github.com/sgl-project/sglang/blob/main/python/sglang/srt/managers/scheduler.py">SGLang scheduler.py</a> · <a href="https://arxiv.org/abs/2312.07104">RadixAttention paper</a></p>'),Te("Continuous batching: asynchronous request loops",ve.scheduler,'<p class="ill-refs"><a href="https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/sched/scheduler.py">vLLM scheduler.py</a> · <a href="https://arxiv.org/abs/2404.14294">DeepSpeed-FastGen / Dynamic SplitFuse</a> · <a href="https://arxiv.org/abs/2403.02310">Sarathi-Serve / chunked prefill</a></p>'),Te("Prefill → decode handoff",ve.handoff,'<p class="ill-refs"><a href="https://github.com/NVIDIA/TensorRT-LLM/blob/main/cpp/tensorrt_llm/batch_manager/kvCacheManager.cpp">TensorRT-LLM KV cache manager</a> · <a href="https://arxiv.org/abs/2401.09670">DistServe / disaggregated prefill+decode</a></p>'),'<p class="ill-refs"><strong>More:</strong> <a href="https://github.com/vllm-project/vllm">vLLM</a> · <a href="https://github.com/sgl-project/sglang">SGLang</a> · <a href="https://github.com/NVIDIA/TensorRT-LLM">TensorRT-LLM</a> · <a href="https://arxiv.org/abs/2404.14294">DeepSpeed-FastGen</a> · <a href="https://arxiv.org/abs/2401.09670">DistServe</a> · <a href="https://arxiv.org/abs/2403.02310">Sarathi-Serve</a></p>']},{id:"sim",title:"Simulation: A Shared Prefix, Step by Step",blurb:"Run the model from §11 on a tiny workload. A and B share a prompt prefix; A's first decode copies the shared block, C arrives later, and the physical block pool shows the result. Step through the schedule or press Run.",h:560,top:44,prose:['<p class="ill-refs">Frames are precomputed by <a href="https://github.com/sylqiu/sylqiu-site/blob/main/src/content/kv_cache_pseudocode/sim.py"><code>sim.py</code></a>, which runs the implementation in §11; the page only replays the recorded states. <a href="https://github.com/sylqiu/sylqiu-site/tree/main/src/content/kv_cache_pseudocode">source</a></p>']}],ko=b=>{let d=8,w=0,v=0,C=!1,P=0,H=Math.min(2,7),W=null,Q=0,le=!1,se=null;function ce(){if(W!==null){window.clearInterval(W),W=null,q();return}P=1,H=0,q(),W=window.setInterval(()=>{H<d-1?H+=1:(W!==null&&window.clearInterval(W),W=null),q()},700)}let oe=0,U=0,ae=null,re=null,pe=0,ie=0,ue=!1,Pe=0,N=0,me=null,Y=!1,Oe=!1,ge=null;const Ve=document.createElement("div");Ve.className="ill";const He=[];uo.forEach((n,r)=>{const c=document.createElement("section");c.className="ill-sec",c.id="ill-"+n.id;const _=document.createElement("div");_.className="ill-sec-head";const x=document.createElement("h2");x.textContent=r+1+" · "+n.title;const m=document.createElement("div");m.className="ill-sec-ctl",_.append(x,m);const l=document.createElement("p");l.className="ill-sec-blurb",l.textContent=n.blurb;const t=document.createElement("div");t.className="ill-fig";const k=f("svg",{viewBox:"0 -"+(n.top||0)+" "+po+" "+(n.h+(n.top||0)),role:"img","aria-label":n.title});t.appendChild(k);const g=document.createElement("div");g.className="ill-cards";let a=null;c.append(_,l,t),n.prose&&(a=document.createElement("div"),a.className="ill-prose",a.innerHTML=n.prose.map(i=>i.trim().startsWith("<")?i:"<p>"+i+"</p>").join(""),Xn(a),c.appendChild(a)),Ve.appendChild(c),He.push({svg:k,cards:g,ctl:m,prose:a})}),b.appendChild(Ve);const cn=[{chip:"1 · normalize, project q, k, v"},{chip:"2 · causal self-attention"},{chip:"3 · normalize, MLP, residual"}],K={inY:60,inH:108,opY:196,opH:340,outY:566,outH:128},E=360,_e=22,De=28;function F(n,r,c,_,x,m=c){const l=c*De-6,t=E-l/2;n.appendChild(o(40,r+_e/2+3,x,{size:10,fill:_}));for(let k=0;k<c;k++){const g=k<m;n.appendChild(f("rect",{x:t+k*De,y:r,width:_e,height:_e,rx:5,fill:g?_:"none","fill-opacity":g?.22:0,stroke:g?_:e.line,"stroke-width":1.3})),n.appendChild(o(t+k*De+_e/2,r+_e/2+3.5,String(k),{anchor:"middle",size:8,mono:!0,fill:e.fg,opacity:g?1:.4}))}}function R(n,r,c,_,x,m,l=!0){const t=l?e.accent:e.dim,k=f("g",{cursor:l?"pointer":"default",class:"ill-svg-btn"});k.appendChild(f("rect",{x:r,y:c,width:_,height:26,rx:13,fill:t,"fill-opacity":l?.12:.06,stroke:t})),k.appendChild(o(r+_/2,c+17,x,{anchor:"middle",size:10.5,fill:t,weight:600})),l&&k.addEventListener("click",m),n.appendChild(k)}function an(n){const r=Math.min(H,d-1),c=en(w,v,r),_=c.length>0?Math.max.apply(null,c):1,x=h=>Math.min(1,h/_),m=K.inY+18,l=K.inY+50,t=K.inY+82,k=K.outY+18,g=K.outY+50,a=K.outY+82;cn.forEach((h,p)=>{const u=20+p*236,s=p===P,y=f("g",{cursor:"pointer"});y.addEventListener("click",()=>{P=p,H=Math.min(2,d-1),q()}),y.appendChild(f("rect",{x:u,y:16,width:224,height:34,rx:8,fill:s?e.accent:e.panel,"fill-opacity":s?.18:.5,stroke:s?e.accent:e.line,"stroke-width":s?1.6:1})),y.appendChild(o(u+12,38,h.chip,{size:11,fill:s?e.fg:e.dim,weight:s?700:400})),n.appendChild(y)});const i=(h,p,u,s)=>{n.appendChild(f("rect",{x:20,y:h,width:680,height:p,rx:10,fill:e.panel,"fill-opacity":.5,stroke:e.line})),n.appendChild(o(32,h+19,u,{size:10,weight:600,fill:s}))};if(i(K.inY,K.inH,"input",e.dim),i(K.opY,K.opH,"step "+(P+1)+" of 3",e.accent),i(K.outY,K.outH,"output",e.dim),n.appendChild(o(688,K.outY+19,w+"."+v,{anchor:"end",size:9.5})),D(n,E,K.inY+K.inH+4,E,K.opY-4,e.dim,"arw-d"),D(n,E,K.opY+K.opH+4,E,K.outY-4,e.dim,"arw-d"),P===0&&(F(n,l,d,e.fg,"h_[t]"),n.appendChild(f("rect",{x:210,y:230,width:300,height:32,rx:7,fill:e.panel2,stroke:e.line})),n.appendChild(o(224,251,"RMSNorm",{size:11,fill:e.fg})),D(n,E,266,E,300,e.dim,"arw-d"),[{label:Ae`q_t = W_Q h_t`,color:e.accent},{label:Ae`k_t = W_K h_t`,color:e.purple},{label:Ae`v_t = W_V h_t`,color:e.teal}].forEach((p,u)=>{const s=40+u*220;n.appendChild(f("rect",{x:s,y:310,width:200,height:62,rx:8,fill:e.panel2,stroke:p.color})),Ie(n,s+24,340,p.label,{size:11,color:p.color}),n.appendChild(o(s+24,360,"per position",{size:9.5}))}),F(n,k,d,e.accent,"q_[t]"),F(n,g,d,e.purple,"k_[t]"),F(n,a,d,e.teal,"v_[t]")),P===1){F(n,m,d,e.accent,"q_[t]"),F(n,l,d,e.purple,"k_[t]"),F(n,t,d,e.teal,"v_[t]");const h=30,p=34,u=d*p-4,s=E-u/2,y=T=>s+T*p+h/2,S=280,A=336;n.appendChild(o(216,S+15,"k_[t]",{anchor:"end",size:9.5,fill:e.purple})),n.appendChild(o(32,222,"one step per token: dot the keys, mix the values",{size:10,fill:e.teal,weight:600})),R(n,500,206,190,W!==null?"❚❚ Pause":"▶ Animate attention",ce),r<d-1&&(n.appendChild(f("rect",{x:y(r+1)-8,y:244,width:(d-r-1)*p+8,height:122,rx:6,fill:e.panel2,"fill-opacity":.3,stroke:e.warn,"stroke-dasharray":"4 3"})),n.appendChild(o(s+u-6,358,"blocked · p > t",{anchor:"end",size:9.5,fill:e.warn})));for(let T=0;T<d;T++){const V=T<=r,z=T===r;n.appendChild(f("rect",{x:s+T*p,y:244,width:h,height:24,rx:6,fill:z?e.accent:e.panel,"fill-opacity":z?.2:1,stroke:z?e.accent:e.line,opacity:V?1:.45})),n.appendChild(o(y(T),260,de[T],{anchor:"middle",size:8.5,mono:!0,fill:V?e.fg:e.dim})),n.appendChild(f("rect",{x:y(T)-11,y:S,width:22,height:22,rx:5,fill:e.purple,"fill-opacity":V?.28:.08,stroke:e.purple,opacity:V?1:.4})),n.appendChild(o(y(T),S+15,String(T),{anchor:"middle",size:8,mono:!0,fill:e.fg,opacity:V?1:.45}))}for(let T=0;T<=r;T++){const V=r>0?x(c[T]):1;n.appendChild(f("line",{x1:y(r),y1:A,x2:y(T),y2:S+22,stroke:e.accent,"stroke-width":.8+4.5*V,opacity:.45+.55*V}))}n.appendChild(f("rect",{x:y(r)-13,y:A,width:26,height:26,rx:6,fill:e.accent,"fill-opacity":.3,stroke:e.fg})),n.appendChild(o(y(r),A+17,String(r),{anchor:"middle",size:8,mono:!0,fill:e.fg})),n.appendChild(o(y(r),A+42,"q_t",{anchor:"middle",size:9.5,fill:e.accent})),n.appendChild(o(32,A+40,"Causal: token "+r+" reads 0 … "+r+".",{size:10.5,fill:e.fg}));const B=250,I=306,ee=18,J=392;n.appendChild(o(B,J-14,"a_{t,p}",{size:9.5,fill:e.warn})),n.appendChild(o(I,J-14,"v_[t]",{size:9.5,fill:e.teal}));for(let T=0;T<d;T++){const V=T<=r,z=V&&r>0?x(c[T]):V?1:0;n.appendChild(f("rect",{x:B,y:J+T*ee,width:V?6+34*z:2,height:13,rx:2,fill:e.warn,"fill-opacity":V?.8:.15})),n.appendChild(f("rect",{x:I,y:J+T*ee,width:16,height:13,rx:3,fill:e.teal,"fill-opacity":V?.2+.65*z:.06,stroke:e.teal,"stroke-width":1,opacity:V?1:.3})),n.appendChild(o(I+8,J+T*ee+11,String(T),{anchor:"middle",size:7.5,mono:!0,fill:e.fg,opacity:V?1:.4}))}Ie(n,384,J+34,Ae`o_t = Σ_p a_{t,p} v_p`,{size:11.5,color:e.teal}),n.appendChild(o(384,J+56,"step "+(r+1)+" of "+d,{size:10,fill:e.dim})),F(n,g,d,e.ok,"o_[t]",r+1)}if(P===2){F(n,l,d,e.ok,"o_[t]"),n.appendChild(f("rect",{x:210,y:230,width:300,height:30,rx:7,fill:e.panel2,stroke:e.line})),n.appendChild(o(224,250,"RMSNorm",{size:11,fill:e.fg})),D(n,E,262,E,292,e.dim,"arw-d");const h=[{y:292,x:40,w:640,label:"up-projection"},{y:336,x:200,w:320,label:"bottleneck"},{y:380,x:40,w:640,label:"down-projection"}];for(const p of h)n.appendChild(f("rect",{x:p.x,y:p.y,width:p.w,height:30,rx:7,fill:e.panel2,stroke:e.purple})),n.appendChild(o(p.x+12,p.y+19,p.label,{size:10}));n.appendChild(f("path",{d:"M 40 180 L 34 180 L 34 512 L "+(E-26)+" 512",fill:"none",stroke:e.ok,"stroke-width":1.4,"stroke-dasharray":"5 4","marker-end":"url(#arw-g)"})),n.appendChild(o(44,192,"residual · the step input, unchanged",{size:9.5,fill:e.ok})),D(n,E,414,E,502,e.purple,"arw-d"),n.appendChild(f("circle",{cx:E,cy:512,r:9,fill:e.panel2,stroke:e.ok,"stroke-width":1.4})),n.appendChild(o(E,516,"+",{anchor:"middle",size:13,fill:e.ok,weight:700})),n.appendChild(o(E+18,516,"residual",{size:9.5,fill:e.ok})),F(n,g,d,e.fg,"h_[t]")}}function rn(n){const c=ho,_=20,x=34,m=30;for(let s=0;s<Se;s++){const y=_+s*c;s<d?(n.appendChild(f("rect",{x:y,y:x,width:50,height:m,rx:7,fill:s===d-1?e.accent:e.panel,"fill-opacity":s===d-1?.18:1,stroke:s===d-1?e.accent:e.line})),n.appendChild(o(y+50/2,x+20,de[s],{anchor:"middle",size:9.5,mono:!0,fill:s===d-1?e.fg:e.dim}))):s===d&&(n.appendChild(f("rect",{x:y,y:x,width:50,height:m,rx:7,fill:"none",stroke:e.accent,"stroke-width":1.2,"stroke-dasharray":"4 3"})),n.appendChild(o(y+50/2,x+20,"?",{anchor:"middle",size:13,fill:e.accent,weight:600})))}n.appendChild(o(_,x-10,"input so far · the model predicts position "+d,{size:10}));const l=360,t=88;n.appendChild(f("rect",{x:240,y:t,width:240,height:44,rx:9,fill:e.panel,stroke:e.line})),n.appendChild(o(360,t+19,"transformer · "+oo+" layers here",{anchor:"middle",size:11,fill:e.fg})),n.appendChild(o(360,t+34,"attention + MLP at every position",{anchor:"middle",size:9.5})),D(n,l,x+m+6,l,t-6,e.dim,"arw-d"),D(n,l,t+m+6,l,168,e.dim,"arw-d");const k=nn(d),g=322,a=118,i=40,h=56,p=20;Ie(n,p,190,Ae`p(x_{n+1} | x_{≤n})`,{size:12}),n.appendChild(o(170,190,"· one probability per vocabulary entry",{size:10.5}));let u=0;k.forEach((s,y)=>{s>k[u]&&(u=y)}),k.forEach((s,y)=>{const S=p+y*h,A=Math.max(2,s*a),B=g-A,I=y===u;n.appendChild(f("rect",{x:S,y:200,width:i,height:a,rx:3,fill:e.panel2,opacity:.45})),n.appendChild(f("rect",{x:S,y:B,width:i,height:A,rx:3,fill:I?e.accent:e.teal,opacity:I?C?1:.9:.45}));const ee=f("text",{x:S+i/2,y:g+12,fill:I?e.fg:e.dim,"font-size":9.5,"text-anchor":"end",transform:"rotate(-52 "+(S+i/2)+" "+(g+12)+")","font-family":"ui-monospace, SFMono-Regular, Menlo, monospace"});ee.textContent=de[y],n.appendChild(ee),n.appendChild(o(S+i/2,B-5,s.toFixed(2),{anchor:"middle",size:9,mono:!0,fill:I?e.accent:e.dim})),I&&n.appendChild(o(S+i/2,B+15,"sampled",{anchor:"middle",size:9.5,fill:"#0b1220",weight:700}))}),n.appendChild(f("line",{x1:p-4,y1:g,x2:p+Se*h-8,y2:g,stroke:e.line})),n.appendChild(f("path",{d:"M "+(_+d*c+50/2)+" "+(x+m+6)+" C "+(_+d*c+50/2)+" 372 "+(p+u*h+i/2)+" 372 "+(p+u*h+i/2)+" "+(g+34),fill:"none",stroke:e.ok,"stroke-width":1.2,"stroke-dasharray":"4 3","marker-end":"url(#arw-g)"})),R(n,20,-36,190,C?"sampling…":d>=Se?"↺ Restart the loop":"▶ Sample next token",jn),R(n,232,-36,96,"↺ Reset",()=>{d=Ke,C=!1,q()})}function pn(n){const r=oe,c=r>=1,_=r>=2,x=r>=3,m=(s,y,S,A)=>{n.appendChild(f("rect",{x:20,y:s,width:680,height:y,rx:10,fill:e.panel,"fill-opacity":.5,stroke:e.line})),n.appendChild(o(32,s+19,S,{size:10,weight:600,fill:A}))};m(20,106,"input",e.dim),m(154,316,"Forward the whole prompt at once",e.accent),m(498,114,"output",e.dim),D(n,E,130,E,150,e.dim,"arw-d"),D(n,E,474,E,494,e.dim,"arw-d"),R(n,20,-36,150,ae!==null?"❚❚ Pause":"▶ Prefill",In),R(n,180,-36,96,"↺ Reset",Wn),F(n,36,d,e.accent,"q_[t]",_?d:0),F(n,68,d,e.purple,"k_[t]",c?d:0),F(n,100,d,e.teal,"v_[t]",c?d:0);const l=30,t=34,k=d*t-4,g=E-k/2,a=s=>g+s*t+l/2,i=196,h=236,p=296,u=356;n.appendChild(o(40,h+15,"k_[t]",{size:10,fill:e.purple})),n.appendChild(o(40,p+15,"q_[t]",{size:10,fill:e.accent})),n.appendChild(o(40,u+15,"v_[t]",{size:10,fill:e.teal}));for(let s=0;s<d;s++)n.appendChild(f("rect",{x:g+s*t,y:i,width:l,height:24,rx:6,fill:e.panel,stroke:e.line})),n.appendChild(o(a(s),i+16,de[s],{anchor:"middle",size:8.5,mono:!0,fill:e.fg})),n.appendChild(f("rect",{x:a(s)-11,y:h,width:22,height:22,rx:5,fill:e.purple,"fill-opacity":c?.28:.06,stroke:c?e.purple:e.line})),n.appendChild(o(a(s),h+15,String(s),{anchor:"middle",size:8,mono:!0,fill:e.fg,opacity:c?1:.35})),n.appendChild(f("rect",{x:a(s)-11,y:p,width:22,height:22,rx:5,fill:e.accent,"fill-opacity":_?.3:.06,stroke:_?e.accent:e.line})),n.appendChild(o(a(s),p+15,String(s),{anchor:"middle",size:8,mono:!0,fill:e.fg,opacity:_?1:.35})),n.appendChild(f("rect",{x:a(s)-11,y:u,width:22,height:22,rx:5,fill:e.teal,"fill-opacity":c?.28:.06,stroke:c?e.teal:e.line})),n.appendChild(o(a(s),u+15,String(s),{anchor:"middle",size:8,mono:!0,fill:e.fg,opacity:c?1:.35}));if(n.appendChild(o(40,i+16,"tokens",{size:10,fill:e.dim})),_){for(let s=0;s<d;s++)for(let y=0;y<=s;y++)n.appendChild(f("line",{x1:a(s),y1:p,x2:a(y),y2:h+22,stroke:e.accent,"stroke-width":.8,opacity:.28}));n.appendChild(o(32,424,"every query reads its keys in the same pass · position t reads p ≤ t",{size:10.5,fill:e.fg}))}n.appendChild(o(32,448,c?"k and v written once, for every position":"nothing written yet",{size:10.5,fill:c?e.teal:e.dim})),F(n,542,d,e.ok,"o_[t]",x?d:0)}function hn(n){const r=Math.min(U,be),c=d+r,_=en(w,v,c),x=_.length>0?Math.max.apply(null,_):1,m=z=>Math.min(1,z/x),l=z=>{if(z<d)return de[z];const L=nn(z-1);let M=0;return L.forEach((ne,xe)=>{ne>L[M]&&(M=xe)}),de[M]},t=(z,L,M,ne)=>{n.appendChild(f("rect",{x:20,y:z,width:680,height:L,rx:10,fill:e.panel,"fill-opacity":.5,stroke:e.line})),n.appendChild(o(32,z+19,M,{size:10,weight:600,fill:ne}))};t(20,106,"input",e.dim),t(154,316,"decode one token per step",e.teal),t(498,114,"output",e.dim),D(n,E,130,E,150,e.dim,"arw-d"),D(n,E,474,E,494,e.dim,"arw-d"),R(n,20,-36,150,re!==null?"❚❚ Pause":"▶ Decode",Yn),R(n,180,-36,96,"Step ▸",Hn,r<be),R(n,286,-36,96,"↺ Reset",Fn);const k=18,g=20,a=(c+1)*g-2,i=E-a/2,h=(z,L,M)=>{n.appendChild(o(40,z+13,M,{size:10,fill:L}));for(let ne=0;ne<=c;ne++){const xe=ne<d,ze=ne===c;n.appendChild(f("rect",{x:i+ne*g,y:z,width:k,height:k,rx:4,fill:ze?"none":L,"fill-opacity":xe?.22:.38,stroke:L,"stroke-dasharray":ze?"3 2":"",opacity:ze?1:xe?.8:1})),n.appendChild(o(i+ne*g+k/2,z+13,String(ne),{anchor:"middle",size:7.5,mono:!0,fill:e.fg,opacity:ze?1:xe?.75:1}))}};h(46,e.purple,"k_[t]"),h(74,e.teal,"v_[t]"),n.appendChild(f("rect",{x:i+c*g,y:98,width:k,height:k,rx:4,fill:e.accent,"fill-opacity":.34,stroke:e.accent})),n.appendChild(o(i+c*g+k/2,111,String(c),{anchor:"middle",size:8,mono:!0,fill:e.fg})),n.appendChild(o(40,111,"q_"+c+" · the only new vector",{size:10,fill:e.accent}));const p=c+1,u=26,s=30,y=p*s-4,S=E-y/2,A=z=>S+z*s+u/2,B=196,I=240,ee=300,J=360;for(let z=0;z<=c;z++){const L=z<d,M=z===c;n.appendChild(f("rect",{x:S+z*s,y:B,width:u,height:24,rx:6,fill:M?e.teal:e.panel,"fill-opacity":M?.2:1,stroke:M?e.teal:e.line})),n.appendChild(o(A(z),B+16,l(z),{anchor:"middle",size:8,mono:!0,fill:M?e.fg:e.dim})),n.appendChild(f("rect",{x:A(z)-10,y:I,width:20,height:20,rx:5,fill:e.purple,"fill-opacity":M?.4:L?.22:.34,stroke:e.purple,opacity:M?1:L?.8:1})),n.appendChild(o(A(z),I+14,String(z),{anchor:"middle",size:7.5,mono:!0,fill:e.fg,opacity:M?1:L?.75:1})),n.appendChild(f("rect",{x:A(z)-10,y:J,width:20,height:20,rx:5,fill:e.teal,"fill-opacity":M?.4:L?.22:.34,stroke:e.teal,opacity:M?1:L?.8:1})),n.appendChild(o(A(z),J+14,String(z),{anchor:"middle",size:7.5,mono:!0,fill:e.fg,opacity:M?1:L?.75:1})),z===d-1&&n.appendChild(f("line",{x1:A(z)+s/2,y1:B-6,x2:A(z)+s/2,y2:J+26,stroke:e.dim,"stroke-dasharray":"3 3",opacity:.6}))}n.appendChild(o(40,B+16,"tokens",{size:10,fill:e.dim})),n.appendChild(o(40,I+14,"k_[t]",{size:10,fill:e.purple})),n.appendChild(o(40,J+14,"v_[t]",{size:10,fill:e.teal})),n.appendChild(f("rect",{x:A(c)-12,y:ee,width:24,height:24,rx:6,fill:e.accent,"fill-opacity":.34,stroke:e.fg})),n.appendChild(o(A(c),ee+16,String(c),{anchor:"middle",size:8,mono:!0,fill:e.fg}));for(let z=0;z<=c;z++){const L=m(_[z]);n.appendChild(f("line",{x1:A(c),y1:ee,x2:A(z),y2:I+20,stroke:e.accent,"stroke-width":.8+4.5*L,opacity:.45+.55*L}))}n.appendChild(o(40,ee+16,"q_"+c,{size:10,fill:e.accent})),n.appendChild(o(32,424,"everything left of the dashed line came from prefill KV cache",{size:10.5,fill:e.fg})),n.appendChild(o(32,448,"each step appends one more KV cache",{size:10.5,fill:e.teal}));const T=Math.min(38,Math.floor(643/p)),V=E-(p*T-4)/2;n.appendChild(o(40,553,"o_[t]",{size:10,fill:e.ok}));for(let z=0;z<=c;z++){const L=z===c,M=z<d;n.appendChild(f("rect",{x:V+z*T,y:542,width:22,height:22,rx:5,fill:L?e.ok:"none","fill-opacity":L?.42:0,stroke:e.ok,opacity:L?1:M?.5:.75})),n.appendChild(o(V+z*T+11,557,String(z),{anchor:"middle",size:8,mono:!0,fill:e.fg,opacity:L?1:M?.5:.75}))}n.appendChild(o(E,604,"the prompt outputs came from prefill · one new output per step",{anchor:"middle",size:9.5,fill:e.dim}))}const Z=16,Ee=48,he=[{name:"A",len:8,color:e.accent},{name:"B",len:3,color:e.teal},{name:"C",len:11,color:e.purple}],Fe={name:"D",color:e.ok};function fn(n){const r=Math.min(pe,he.length),c=pe>he.length,_=r*Z,x=he.slice(0,r).reduce((u,s)=>u+s.len,0),m=_-x,l=Ee-_;R(n,20,-36,190,"▶ Admit next request",Sn,pe<4),R(n,220,-36,96,"↺ Reset",Bn),n.appendChild(o(20,14,"one contiguous buffer per request · each buffer reserves max_len = "+Z+" slots",{size:10.5,fill:e.fg}));const t=24,k=12,g=13,a=58,i=34;for(let u=0;u<Ee;u++){const s=Math.floor(u/Z),y=u%Z,S=he[s],A=s<r,B=A&&y<S.len;A?(n.appendChild(f("rect",{x:t+u*g,y:a,width:k,height:i,rx:3,fill:B?S.color:"none","fill-opacity":B?.36:0,stroke:S.color,"stroke-opacity":B?.95:.26,"stroke-dasharray":B?"":"2 2"})),B&&n.appendChild(o(t+u*g+k/2,a+21,String(y),{anchor:"middle",size:7,mono:!0,fill:e.fg}))):n.appendChild(f("rect",{x:t+u*g,y:a,width:k,height:i,rx:3,fill:"none",stroke:e.line,"stroke-dasharray":"2 3",opacity:.55}))}he.forEach((u,s)=>{if(s>=r)return;const y=t+(s*Z+Z/2)*g;n.appendChild(o(y,a-7,u.name+" · "+u.len+" / "+Z+" used",{anchor:"middle",size:9.5,fill:u.color,weight:600}))}),n.appendChild(o(20,114,"reserved "+_+" / "+Ee+" slots   ·   live "+x+"   ·   idle-but-reserved "+m+"   ·   free "+l,{size:10.5,fill:e.fg}));const h=144;n.appendChild(f("rect",{x:20,y:h,width:680,height:88,rx:10,fill:e.panel,"fill-opacity":.5,stroke:c?e.bad:e.line,"stroke-dasharray":c?"":"4 4"})),n.appendChild(o(32,h+22,Fe.name+" · 6-token request",{size:11,weight:600,fill:Fe.color})),n.appendChild(o(32,h+40,"asks for one contiguous region of "+Z+" slots",{size:10,fill:e.dim}));for(let u=0;u<Z;u++)n.appendChild(f("rect",{x:470+u*14,y:h+28,width:13,height:26,rx:3,fill:c?e.bad:e.ok,"fill-opacity":.1,stroke:c?e.bad:e.ok,"stroke-opacity":.55,"stroke-dasharray":"3 2"}));const p=c?"✕ rejected · "+m+" slots are idle, but no "+Z+"-slot contiguous run is free":pe>=he.length?"waiting · every buffer is reserved, although "+m+" slots inside them are empty":"waiting in the queue";n.appendChild(o(32,h+66,p,{size:10.5,fill:c?e.bad:e.warn})),r===he.length?(n.appendChild(o(20,258,"Only "+x+" of the "+Ee+" reserved slots hold K or V. The rest is fragmentation:",{size:10.5,fill:e.fg})),n.appendChild(o(20,276,"reserved tails inside each buffer, plus buffer-wide gaps that cannot be merged for a new request.",{size:10,fill:e.dim}))):(n.appendChild(o(20,258,"Each admitted request takes a fixed "+Z+"-slot region, whether or not it ever reaches that length.",{size:10.5,fill:e.fg})),n.appendChild(o(20,276,"The tail of the region is reserved up front and stays empty until the sequence grows into it.",{size:10,fill:e.dim})))}const ye=4,Xe=12;function un(){const n=[{name:"A",color:e.accent,len:8+ie,map:[5,1,10]},{name:"B",color:e.teal,len:3+ie,map:[8,4]},{name:"C",color:e.purple,len:11+ie,map:[0,7,2,3]}];return ue?n.push({name:"D",color:e.ok,len:6+Math.max(0,ie-Pe),map:[6,9,11]}):n.push({name:"D",color:e.ok,len:0,map:[],queued:!0}),n.map(r=>({...r,map:r.map.slice(0,Math.ceil(r.len/ye))}))}function mn(n){R(n,20,-36,180,"▶ Decode iteration",Tn,ie<3),R(n,210,-36,130,ue?"D admitted":"＋ Admit D",Pn,!ue),R(n,350,-36,96,"↺ Reset",En),n.appendChild(o(20,12,"logical sequence · 4-token blocks · L0→#5 means logical block 0 lives in physical block 5",{size:10.5,fill:e.fg}));const r=un();r.forEach((a,i)=>{const h=38+i*44;if(n.appendChild(o(24,h+20,a.name,{size:12,weight:700,fill:a.color})),a.queued){n.appendChild(o(48,h+19,"queued · 6 tokens · will take 2 blocks",{size:10,fill:e.dim}));return}n.appendChild(o(24,h+33,"len "+a.len,{size:8,fill:e.dim})),a.map.forEach((p,u)=>{const s=48+u*84;n.appendChild(o(s+2,h-3,"L"+u+"→#"+p,{size:8.5,mono:!0,fill:a.color}));for(let y=0;y<4;y++){const S=u*4+y,A=S<a.len,B=S===a.len-1;n.appendChild(f("rect",{x:s+y*16,y:h,width:15,height:30,rx:4,fill:A?a.color:"none","fill-opacity":A?B?.6:.3:0,stroke:A?B?e.fg:a.color:e.line,"stroke-dasharray":A?"":"2 2","stroke-opacity":A?.95:.7})),n.appendChild(o(s+y*16+7.5,h+19,A?String(S):"·",{anchor:"middle",size:7.5,mono:!0,fill:e.fg,opacity:A?1:.35}))}})});const c=r.reduce((a,i)=>a+i.map.length,0),_=r.reduce((a,i)=>a+i.len,0),x=c*ye-_,m=430,l=18;n.appendChild(f("rect",{x:m,y:l,width:270,height:174,rx:10,fill:e.panel,"fill-opacity":.5,stroke:e.line})),n.appendChild(o(m+12,l+21,"block table",{size:10.5,weight:700,fill:e.fg})),n.appendChild(o(m+12,l+42,"one array per sequence,",{size:9.5,fill:e.dim})),n.appendChild(o(m+12,l+58,"logical block → physical block",{size:9.5,fill:e.dim})),n.appendChild(o(m+12,l+84,"blocks need not be adjacent",{size:9.5,fill:e.fg})),n.appendChild(o(m+12,l+112,"now   "+c+" blocks · "+c*ye+" slots",{size:10,mono:!0,fill:e.teal})),n.appendChild(o(m+12,l+130,"waste "+x+" slots · "+Math.round(_/Math.max(1,c*ye)*100)+"% full",{size:10,mono:!0,fill:e.fg})),n.appendChild(o(m+12,l+154,"vs "+he.length*Z+" slots reserved",{size:9.5,fill:e.dim})),n.appendChild(o(20,232,"physical block pool · "+Xe+" blocks × "+ye+" slots",{size:10.5,fill:e.fg}));const t=131,k=68,g=10;for(let a=0;a<Xe;a++){const i=a%6,h=Math.floor(a/6),p=t+i*(k+g),u=250+h*60,s=r.find(S=>!S.queued&&S.map.indexOf(a)>=0);if(n.appendChild(o(p+2,u-5,"#"+a,{size:8,mono:!0,fill:s?s.color:e.dim})),n.appendChild(f("rect",{x:p,y:u,width:k,height:38,rx:7,fill:s?s.color:"none","fill-opacity":s?.07:0,stroke:s?s.color:e.line,"stroke-dasharray":s?"":"3 3","stroke-opacity":s?.6:.8})),!s){n.appendChild(o(p+k/2,u+23,"free",{anchor:"middle",size:9,fill:e.dim}));continue}const y=s.map.indexOf(a);for(let S=0;S<4;S++){const A=y*4+S,B=A<s.len,I=A===s.len-1;n.appendChild(f("rect",{x:p+3+S*16,y:u+4,width:15,height:30,rx:3,fill:B?s.color:"none","fill-opacity":B?I?.65:.32:0,stroke:B?I?e.fg:s.color:e.line,"stroke-dasharray":B?"":"2 2","stroke-opacity":B?.9:.55})),n.appendChild(o(p+3+S*16+7.5,u+23,B?String(A):"·",{anchor:"middle",size:7,mono:!0,fill:e.fg,opacity:B?1:.3}))}}n.appendChild(o(20,386,"Blocks need not be adjacent; the last block of a sequence may be only partly filled.",{size:10,fill:e.dim})),n.appendChild(o(20,404,"Real systems also share blocks across requests, with reference counts and copy-on-write on divergence.",{size:10,fill:e.dim}))}const te=8,Ge=[{name:"A",color:e.accent,p:1,d0:2,d1:4},{name:"B",color:e.teal,p:1,d0:2,d1:7},{name:"C",color:e.purple,p:1,d0:2,d1:8},{name:"D",color:e.ok,p:5,d0:6,d1:8}];function kn(n){return n<=0?[]:Ge.filter(r=>n>=r.p&&n<=r.d1)}function gn(n){R(n,20,-36,150,me!==null?"❚❚ Pause":"▶ Run",Ln,N<te||me!==null),R(n,180,-36,96,"Step ▸",Rn,N<te),R(n,286,-36,96,"↺ Reset",Nn),n.appendChild(o(20,12,"iteration-level schedule · one column per forward pass",{size:10.5,fill:e.fg})),n.appendChild(o(520,12,"P = prefill · D = decode · queue = waiting",{size:9.5,fill:e.dim}));const r=100,c=72,_=60,x=t=>r+(t-.5)*c,m=t=>58+t*34;for(let t=1;t<=te;t++)n.appendChild(o(x(t),46,String(t),{anchor:"middle",size:9.5,mono:!0,fill:t===N?e.fg:e.dim,weight:t===N?700:400}));N>0&&n.appendChild(f("rect",{x:x(N)-_/2-5,y:34,width:_+10,height:274,rx:8,fill:e.accent,"fill-opacity":.05,stroke:e.accent,"stroke-opacity":.25})),Ge.forEach((t,k)=>{const g=m(k);n.appendChild(o(24,g+18,t.name,{size:11,weight:700,fill:t.color}));for(let a=1;a<=te;a++){const i=a===t.p,h=a>=t.d0&&a<=t.d1,p=a<t.p,u=a>t.d1&&!p,s=a===N,S=N>0&&a<=N?1:.22,A=i?"P":h?"D":p?"queue":"done",B=i?e.accent:h?t.color:e.dim;n.appendChild(f("rect",{x:x(a)-_/2,y:g,width:_,height:26,rx:6,fill:p||u?"none":B,"fill-opacity":p||u?0:s?.34:.2,stroke:p||u?e.line:B,"stroke-opacity":p||u?.7:s?1:.8,"stroke-dasharray":p||u?"3 3":"",opacity:S})),n.appendChild(o(x(a),g+17,A,{anchor:"middle",size:p?7.5:9,mono:!0,fill:i||h?e.fg:e.dim,opacity:S,weight:s?700:400}))}}),n.appendChild(o(24,218,"batch size",{size:9.5,fill:e.dim}));const l=280;for(let t=1;t<=te;t++){const k=kn(t).length,g=k/3*36,a=t===N;n.appendChild(f("rect",{x:x(t)-16,y:l-g,width:32,height:g,rx:3,fill:e.accent,"fill-opacity":N>0&&t<=N?a?.8:.35:.12})),n.appendChild(o(x(t),l+12,String(k),{anchor:"middle",size:8.5,mono:!0,fill:a?e.fg:e.dim}))}n.appendChild(f("line",{x1:r,y1:l,x2:r+te*c,y2:l,stroke:e.line})),n.appendChild(o(20,320,"A finishes after iteration 4, so its blocks return to the pool; D prefills in iteration 5.",{size:10.5,fill:e.fg})),n.appendChild(o(20,338,"The batch never drains between requests: finished sequences leave and queued ones join at iteration boundaries.",{size:10,fill:e.dim}))}const ke=10,Re=14;let X=ke,G=ke,O=null;function Qe(n,r){const _=[0,1,O===r?r==="A"?7:8:2];return n>12&&_.push(r==="A"?9:10),_}function Ue(n){if(n===0)return{color:e.ok,refs:2,start:0,end:4};if(n===1)return{color:e.ok,refs:2,start:4,end:8};if(n===2){const r=O===null?e.ok:O==="A"?e.teal:e.accent,c=O===null?Math.min(X,G):O==="A"?G:X;return{color:r,refs:O===null?2:1,start:8,end:c}}return n===7?O==="A"?{color:e.accent,refs:1,start:8,end:X,cow:!0}:null:n===8?O==="B"?{color:e.teal,refs:1,start:8,end:G,cow:!0}:null:n===9?X>12?{color:e.accent,refs:1,start:12,end:X}:null:n===10&&G>12?{color:e.teal,refs:1,start:12,end:G}:null}function wn(n){R(n,20,-36,118,"Append A ▸",()=>Ze("A"),X<Re),R(n,148,-36,118,"Append B ▸",()=>Ze("B"),G<Re),R(n,276,-36,96,"↺ Reset",Mn),n.appendChild(o(20,12,"two requests share a "+ke+"-token system prompt · a block is shared until someone writes to it",{size:10.5,fill:e.fg})),[{name:"A",color:e.accent,len:X,map:Qe(X,"A")},{name:"B",color:e.teal,len:G,map:Qe(G,"B")}].forEach((l,t)=>{const k=42+t*42;n.appendChild(o(24,k+18,l.name,{size:12,weight:700,fill:l.color})),n.appendChild(o(24,k+31,"len "+l.len,{size:8,fill:e.dim})),l.map.forEach((g,a)=>{const i=64+a*90,h=Ue(g),p=h?h.color:e.dim;n.appendChild(o(i+2,k-4,"L"+a+"→#"+g,{size:8.5,mono:!0,fill:p})),n.appendChild(f("rect",{x:i,y:k,width:82,height:26,rx:6,fill:p,"fill-opacity":.12,stroke:p,"stroke-opacity":.8})),n.appendChild(o(i+41,k+17,"#"+g,{anchor:"middle",size:10,mono:!0,fill:e.fg})),h&&h.refs>1&&n.appendChild(o(i+76,k+10,"×"+h.refs,{anchor:"end",size:8,mono:!0,fill:e.ok}))})}),n.appendChild(f("rect",{x:455,y:24,width:245,height:118,rx:10,fill:e.panel,"fill-opacity":.5,stroke:e.line})),n.appendChild(o(467,45,"reference counts",{size:10.5,weight:700,fill:e.fg})),n.appendChild(o(467,64,"shared block = ×2",{size:9.5,fill:e.ok})),n.appendChild(o(467,82,"a write to a shared block",{size:9.5,fill:e.dim})),n.appendChild(o(467,98,"copies it before writing",{size:9.5,fill:e.dim})),n.appendChild(o(467,116,"only the writer's table changes",{size:9.5,fill:e.dim})),n.appendChild(o(467,134,"block #2: ×"+(O===null?2:1),{size:10,mono:!0,fill:O===null?e.ok:e.warn}));const c=O===null?"Both tables point at block #2 for tokens 8–9. Either request can fork it; neither can write in place.":O==="A"?"A copied #2 → #7 before writing; B still reads #2. Refcount on #2 is now 1.":"B copied #2 → #8 before writing; A still reads #2. Refcount on #2 is now 1.";n.appendChild(o(20,152,c,{size:10,fill:O===null?e.warn:e.ok})),n.appendChild(o(20,174,"physical pool · blocks with reference counts",{size:10.5,fill:e.fg}));const _=131,x=68,m=10;for(let l=0;l<12;l++){const t=l%6,k=Math.floor(l/6),g=_+t*(x+m),a=194+k*60,i=Ue(l),h="#"+l+(i?" ×"+i.refs:"")+(i&&i.cow?" · COW":"");if(n.appendChild(o(g+2,a-5,h,{size:8,mono:!0,fill:i?i.color:e.dim})),n.appendChild(f("rect",{x:g,y:a,width:x,height:38,rx:7,fill:i?i.color:"none","fill-opacity":i?.07:0,stroke:i?i.color:e.line,"stroke-dasharray":i?"":"3 3","stroke-opacity":i?.6:.8})),!i){n.appendChild(o(g+x/2,a+23,"free",{anchor:"middle",size:9,fill:e.dim}));continue}for(let p=0;p<4;p++){const u=i.start+p,s=u<i.end,y=s&&u===i.end-1&&i.end%4!==0;n.appendChild(f("rect",{x:g+3+p*16,y:a+4,width:15,height:30,rx:3,fill:s?i.color:"none","fill-opacity":s?y?.65:.32:0,stroke:s?y?e.fg:i.color:e.line,"stroke-dasharray":s?"":"2 2","stroke-opacity":s?.9:.55})),n.appendChild(o(g+3+p*16+7.5,a+23,s?String(u):"·",{anchor:"middle",size:7,mono:!0,fill:e.fg,opacity:s?1:.3}))}}n.appendChild(o(20,322,"A block is freed only when its reference count reaches zero.",{size:10,fill:e.dim})),n.appendChild(o(20,340,X>12&&G>12?"Private blocks #9/#10 hold the tokens past position 12; the shared prefix still has a refcount of 2.":X>12?"A's #9 holds the token past position 12; B's #10 is still free.":G>12?"B's #10 holds the token past position 12; A's #9 is still free.":"Copy-on-write keeps the shared prefix immutable until a request writes into its partial block.",{size:10,fill:e.dim}))}let j=0;const fe=[{id:"R1",matched:0,computed:7,step:1,prompt:"You are a helpful assistant. Answer:"},{id:"R2",matched:5,computed:1,step:2,prompt:"You are a helpful assistant. Summarize:"},{id:"R3",matched:7,computed:2,step:3,prompt:"You are a helpful assistant. Answer: in French:"},{id:"R4",matched:0,computed:3,step:4,prompt:"Translate this sentence:"}],Le=[{id:"root",label:"root",tokens:0,x:20,y:150,w:48,h:28,parent:null,createdAt:0},{id:"n1",label:"You are a helpful assistant.",tokens:5,x:95,y:150,w:215,h:28,parent:"root",createdAt:1},{id:"n2",label:"Answer:",tokens:2,x:345,y:82,w:82,h:28,parent:"n1",createdAt:1},{id:"n3",label:"Summarize:",tokens:1,x:345,y:200,w:98,h:28,parent:"n1",createdAt:2},{id:"n4",label:"in French:",tokens:2,x:455,y:82,w:96,h:28,parent:"n2",createdAt:3},{id:"n5",label:"Translate this sentence:",tokens:3,x:345,y:260,w:170,h:28,parent:"root",createdAt:4}];function bn(n){return Le.find(r=>r.id===n)}function _n(n){R(n,20,-36,170,j<fe.length?"▶ Send "+fe[j].id:"✓ All sent",Kn,j<fe.length),R(n,200,-36,96,"↺ Reset",On),n.appendChild(o(20,12,"one tree for every prefix · a node holds the cached KV for its token sequence",{size:10.5,fill:e.fg}));const r=i=>i.createdAt<=j;for(const i of Le){if(!r(i)||i.parent===null)continue;const h=bn(i.parent);if(!r(h))continue;const p=h.x+h.w,u=h.y+h.h/2,s=i.x,y=i.y+i.h/2,S=i.createdAt===j&&j>0?e.warn:e.ok,A=Math.abs(u-y)<1?"M "+p+" "+u+" L "+s+" "+y:"M "+p+" "+u+" C "+(p+40)+" "+u+", "+(s-40)+" "+y+", "+s+" "+y;n.appendChild(f("path",{d:A,fill:"none",stroke:S,"stroke-width":1.3,opacity:.75}))}for(const i of Le){if(!r(i))continue;const h=i.id==="root",p=!h&&i.createdAt===j&&j>0,u=h?e.dim:p?e.warn:e.ok;n.appendChild(f("rect",{x:i.x,y:i.y,width:i.w,height:i.h,rx:7,fill:u,"fill-opacity":h?.08:p?.2:.1,stroke:u,"stroke-width":p?1.5:1})),n.appendChild(o(i.x+i.w/2,i.y+18,i.label,{anchor:"middle",size:9.5,mono:!0,fill:h?e.dim:e.fg,weight:p?700:400})),h||n.appendChild(o(i.x+i.w/2,i.y+i.h+11,i.tokens+" tok",{anchor:"middle",size:8,fill:u}))}const c=570,_=36;n.appendChild(f("rect",{x:c,y:_,width:130,height:190,rx:10,fill:e.panel,"fill-opacity":.5,stroke:e.line})),n.appendChild(o(c+10,_+20,"requests",{size:10.5,weight:700,fill:e.fg})),n.appendChild(o(c+10,_+34,"matched + new",{size:8,fill:e.dim})),fe.forEach((i,h)=>{const p=_+58+h*32,u=j>=i.step,s=j===i.step,y=s?e.warn:u?e.ok:e.dim;n.appendChild(o(c+10,p,i.id,{size:10,mono:!0,fill:y,weight:s?700:400})),n.appendChild(o(c+38,p,i.matched+" + "+i.computed,{size:9,mono:!0,fill:y}))});const m=fe.filter(i=>i.step<=j).reduce((i,h)=>i+h.matched+h.computed,0),l=Le.filter(r).reduce((i,h)=>i+h.tokens,0),t=25,k=220,g=430,a=fe[Math.min(j===0?0:j-1,fe.length-1)];n.appendChild(o(20,306,a.id+" · "+a.prompt,{size:9.5,fill:e.dim})),n.appendChild(o(20,326,"KV computed across the requests so far",{size:10.5,fill:e.fg})),m>0&&n.appendChild(o(650,318,Math.round((1-l/m)*100)+"% less KV",{anchor:"end",size:10.5,weight:700,fill:e.ok})),n.appendChild(o(20,342,"with reuse",{size:9.5,fill:e.ok})),n.appendChild(f("rect",{x:k,y:332,width:Math.max(2,l/t*g),height:12,rx:3,fill:e.ok,"fill-opacity":.7})),n.appendChild(o(k+l/t*g+8,342,l+" tok",{size:9,mono:!0,fill:e.ok})),n.appendChild(o(20,366,"without reuse",{size:9.5,fill:e.dim})),n.appendChild(f("rect",{x:k,y:356,width:Math.max(2,m/t*g),height:12,rx:3,fill:e.dim,"fill-opacity":.35})),n.appendChild(o(k+m/t*g+8,366,m+" tok",{size:9,mono:!0,fill:e.dim})),n.appendChild(o(20,396,"A node is a token sequence with its KV; two requests share a node while their prefixes agree.",{size:10,fill:e.dim})),n.appendChild(o(20,414,"When they diverge the node splits; unused leaves are evicted LRU, while shared ancestors survive.",{size:10,fill:e.dim}))}const Ne=8,$=3;function yn(n){R(n,20,-36,190,Y?"↺ Reset prompt":"▶ Send long prompt",Vn),n.appendChild(o(20,12,Y?"a 256-token prompt arrives at iteration "+$:"steady state · only decode is running",{size:10.5,fill:e.fg}));const r=150,c=62,_=54,x=l=>r+(l-1)*c+_/2;for(let l=1;l<=Ne;l++)n.appendChild(o(x(l),44,String(l),{anchor:"middle",size:9,mono:!0,fill:e.dim}));n.appendChild(o(700,58,"iteration (time) →",{anchor:"end",size:8.5,fill:e.dim}));const m=(l,t,k,g,a=!0,i=!1)=>{const h=r+(l-1)*c+4;n.appendChild(f("rect",{x:h,y:t,width:_,height:24,rx:6,fill:a?g:"none","fill-opacity":a?.18:0,stroke:g,"stroke-opacity":a?.8:.45,"stroke-dasharray":i?"3 2":""})),n.appendChild(o(h+_/2,t+16,k,{anchor:"middle",size:8.5,mono:!0,fill:a?e.fg:e.dim,opacity:a?1:.6}))};n.appendChild(f("rect",{x:12,y:26,width:696,height:140,rx:10,fill:e.panel,"fill-opacity":.42,stroke:e.line})),n.appendChild(o(20,46,"colocated · unchunked",{size:10.5,weight:700,fill:e.fg})),n.appendChild(o(20,60,"one pool · prefill and decode share a batch",{size:9,fill:e.dim})),n.appendChild(o(20,90,"A/B/C decode",{size:9.5,fill:e.accent})),n.appendChild(o(20,120,"long prompt",{size:9.5,fill:e.warn}));for(let l=1;l<=Ne;l++){const t=Y&&l>=$&&l<=$+1;m(l,74,t?"stall":"D",t?e.bad:e.accent,!0,t),Y?l<$?m(l,104,"queue",e.warn,!0,!0):l<=$+1?m(l,104,"P",e.warn):m(l,104,"D",e.ok):m(l,104,"—",e.line,!1)}n.appendChild(o(20,154,Y?"decode stalls for 2 iterations → ITL spike":"all three requests decode every iteration",{size:9.5,fill:Y?e.bad:e.dim})),n.appendChild(f("rect",{x:12,y:304,width:696,height:184,rx:10,fill:e.panel,"fill-opacity":.42,stroke:e.line})),n.appendChild(o(20,324,"disaggregated",{size:10.5,weight:700,fill:e.fg})),n.appendChild(o(20,338,"separate pools · KV handoff",{size:9,fill:e.dim})),n.appendChild(o(700,324,"P:D = 1:4 · example",{anchor:"end",size:9,fill:e.dim})),n.appendChild(o(20,374,"prefill P0",{size:9.5,fill:e.warn})),n.appendChild(o(20,404,"decode D0",{size:9.5,fill:e.accent})),n.appendChild(o(20,434,"long prompt",{size:9.5,fill:e.ok}));for(let l=1;l<=Ne;l++)!Y||l<$||l>$+1?m(l,360,"—",e.line,!1):m(l,360,"P",e.warn),m(l,390,"D",e.accent),Y?l<$?m(l,420,"queue",e.warn,!0,!0):l<=$+1?m(l,420,"wait",e.dim,!0,!0):m(l,420,"D",e.ok):m(l,420,"—",e.line,!1);Y?(n.appendChild(o(20,458,"KV blocks move P0 → D0 before the first decode token",{size:9.5,fill:e.teal})),n.appendChild(o(20,474,"decode keeps running if D has capacity · TTFT pays the handoff",{size:9.5,fill:e.ok}))):n.appendChild(o(20,458,"no long prompt · both deployments are in steady state",{size:9.5,fill:e.dim})),n.appendChild(f("rect",{x:12,y:176,width:696,height:118,rx:10,fill:e.panel,"fill-opacity":.42,stroke:e.line})),n.appendChild(o(20,196,"colocated + chunked prefill",{size:10.5,weight:700,fill:e.fg})),n.appendChild(o(20,210,"same pool · prompt split into chunks",{size:9,fill:e.dim})),n.appendChild(o(20,234,"A/B/C decode",{size:9.5,fill:e.accent})),n.appendChild(o(20,264,"long prompt",{size:9.5,fill:e.warn}));for(let l=1;l<=Ne;l++)m(l,224,"D",e.accent),Y?l<$?m(l,254,"queue",e.warn,!0,!0):l<=$+3?m(l,254,"P",e.warn):m(l,254,"D",e.ok):m(l,254,"—",e.line,!1);n.appendChild(o(20,286,Y?"no decode gaps · the new prompt's first token slips to iteration 7":"no long prompt · steady state",{size:9.5,fill:Y?e.ok:e.dim})),n.appendChild(o(20,506,"Why split",{size:10.5,weight:700,fill:e.fg})),n.appendChild(o(20,522,"prefill is compute-bound; decode is memory-bound",{size:9.5,fill:e.dim})),n.appendChild(o(20,538,"size the two pools independently",{size:9.5,fill:e.dim})),n.appendChild(o(20,554,"chunked prefill is the usual baseline",{size:9.5,fill:e.dim})),n.appendChild(o(360,506,"What it costs",{size:10.5,weight:700,fill:e.fg})),n.appendChild(o(360,522,"KV transfer adds to TTFT",{size:9.5,fill:e.dim})),n.appendChild(o(360,538,"P:D imbalance can still queue decode",{size:9.5,fill:e.dim})),n.appendChild(o(360,554,"placement, more queues, more failure modes",{size:9.5,fill:e.dim})),n.appendChild(o(20,578,"Chunked prefill avoids the stall without a second pool; it just delays the new prompt's first token.",{size:9.5,fill:e.dim}))}function Cn(n){const r=(c,_,x,m,l,t)=>{n.appendChild(f("rect",{x:c,y:_,width:x,height:50,rx:8,fill:e.panel,"fill-opacity":.7,stroke:t,"stroke-opacity":.7})),n.appendChild(o(c+12,_+21,m,{size:10.5,weight:700,fill:e.fg})),n.appendChild(o(c+12,_+38,l,{size:8.5,fill:e.dim}))};n.appendChild(o(20,24,"control plane",{size:9.5,weight:700,fill:e.accent})),r(20,40,150,"scheduler","admit · batch · SLO",e.accent),r(190,40,160,"radix cache","prefix match · LRU",e.ok),r(370,40,150,"block manager","alloc · refcount",e.purple),r(540,40,150,"handoff","KV to decode pool",e.teal),D(n,170,65,190,65,e.dim,"arw-d"),D(n,350,65,370,65,e.dim,"arw-d"),D(n,520,65,540,65,e.dim,"arw-d"),n.appendChild(o(20,134,"data plane",{size:9.5,weight:700,fill:e.teal})),r(20,150,150,"attention","gather K/V by table",e.accent),r(190,150,160,"KV pool","physical blocks",e.purple),r(370,150,150,"prefill / decode","one iteration",e.ok),r(540,150,150,"append / evict","write KV · drop LRU",e.teal),D(n,170,175,190,175,e.dim,"arw-d"),D(n,350,175,370,175,e.dim,"arw-d"),D(n,520,175,540,175,e.dim,"arw-d"),n.appendChild(f("line",{x1:95,y1:90,x2:95,y2:150,stroke:e.accent,"stroke-width":1.2,"stroke-dasharray":"3 3","marker-end":"url(#arw-a)"})),n.appendChild(o(105,124,"block table / batch",{size:8.5,fill:e.dim})),D(n,690,220,20,220,e.dim,"arw-d"),n.appendChild(o(355,236,"next iteration",{anchor:"middle",size:8.5,fill:e.dim}))}function xn(n){return on[Math.max(0,Math.min(n,qe))]}function Ce(){se!==null&&(window.clearTimeout(se),se=null),le=!1}function zn(){if(le){Ce(),q();return}Q>=qe&&(Q=0),le=!0;const n=()=>{if(le){if(Q>=qe){le=!1,se=null,q();return}Q+=1,q(),se=window.setTimeout(n,750)}};se=window.setTimeout(n,450),q()}function vn(n){const{blocks:r,seqs:c,log:_}=xn(Q),x=t=>t==="A"?e.accent:t==="B"?e.ok:e.purple,m=t=>t.owners.length>1?e.warn:t.owners.length===1?x(t.owners[0]):e.dim;n.appendChild(o(20,24,"step "+Q+" / "+qe,{size:9.5,weight:700,fill:e.dim})),n.appendChild(o(350,24,"physical block pool · refs / fill",{size:9.5,weight:700,fill:e.dim})),c.forEach((t,k)=>{const g=48+k*78,a=x(t.id);n.appendChild(f("rect",{x:20,y:g,width:300,height:68,rx:9,fill:e.panel,"fill-opacity":.65,stroke:a,"stroke-opacity":.7})),n.appendChild(o(34,g+22,"request "+t.id,{size:11,weight:700,fill:a})),n.appendChild(o(286,g+22,t.phase,{anchor:"end",size:9,fill:t.phase==="done"?e.dim:a})),n.appendChild(o(34,g+40,"prompt "+t.promptLen+" · decoded "+t.produced+"/"+t.decodeTotal,{size:9.5,fill:e.dim})),n.appendChild(o(34,g+59,"blocks",{size:8.5,fill:e.dim})),t.table.forEach((i,h)=>{const p=78+h*34,u=m(r[i]);n.appendChild(f("rect",{x:p,y:g+48,width:28,height:16,rx:4,fill:u,"fill-opacity":.2,stroke:u})),n.appendChild(o(p+14,g+60,String(i),{anchor:"middle",size:8.5,mono:!0,fill:e.fg}))})}),c.length===0&&n.appendChild(o(20,80,"no requests yet — press Run or Step",{size:10,fill:e.dim})),r.forEach((t,k)=>{const g=k%4,a=Math.floor(k/4),i=350+g*90,h=48+a*78,p=m(t);n.appendChild(f("rect",{x:i,y:h,width:82,height:68,rx:8,fill:e.panel,"fill-opacity":t.refs?.8:.35,stroke:p,"stroke-opacity":t.refs?.9:.4})),n.appendChild(o(i+8,h+16,"#"+t.id,{size:9.5,weight:700,fill:t.refs?e.fg:e.dim})),n.appendChild(o(i+74,h+16,"refs "+t.refs,{anchor:"end",size:8,fill:e.dim})),n.appendChild(o(i+8,h+34,t.owners.length?t.owners.join("+"):"free",{size:8.5,fill:t.refs?p:e.dim}));for(let u=0;u<4;u++)n.appendChild(f("rect",{x:i+8+u*16,y:h+44,width:13,height:10,rx:2,fill:u<t.fill?p:"none","fill-opacity":.55,stroke:u<t.fill?p:e.line}));n.appendChild(o(i+8,h+64,t.fill+"/4",{size:8,fill:e.dim}))}),n.appendChild(f("rect",{x:360,y:220,width:390,height:260,rx:9,fill:e.panel,"fill-opacity":.45,stroke:e.line})),n.appendChild(o(372,242,"event log",{size:9.5,weight:700,fill:e.dim}));const l=_.slice(-7);l.length===0?n.appendChild(o(372,266,"the schedule starts empty",{size:9.5,fill:e.dim})):l.forEach((t,k)=>{n.appendChild(o(372,266+k*23,String(_.length-l.length+k+1).padStart(2,"0")+" · "+t,{size:9.5,fill:k===l.length-1?e.fg:e.dim}))}),R(n,20,500,86,"▶ Step",()=>{Ce(),Q<qe&&(Q+=1),q()}),R(n,116,500,86,le?"⏸ Pause":"▶ Run",()=>{zn()}),R(n,212,500,86,"↺ Reset",()=>{Ce(),Q=0,q()}),n.appendChild(o(20,548,"A and B share blocks 0–1; A's first decode copies block 1.",{size:8.5,fill:e.dim}))}const An=[an,rn,pn,hn,fn,mn,gn,wn,_n,yn,Cn,vn];function qn(n){return[]}function Sn(){pe<4&&(pe+=1),q()}function Bn(){pe=0,q()}function Tn(){ie<3&&(ie+=1),q()}function Pn(){ue||(ue=!0,Pe=ie),q()}function En(){ie=0,ue=!1,Pe=0,q()}function we(){me!==null&&(window.clearInterval(me),me=null)}function Rn(){we(),N<te&&(N+=1),q()}function Ln(){if(me!==null){we(),q();return}N>=te&&(N=0),q(),me=window.setInterval(()=>{N<te&&(N+=1,q()),N>=te&&(we(),q())},760)}function Nn(){we(),N=0,q()}function Ze(n){if(n==="A"){if(X>=Re)return;O===null&&(O="A"),X+=1}else{if(G>=Re)return;O===null&&(O="B"),G+=1}q()}function Mn(){X=ke,G=ke,O=null,q()}function Kn(){j<fe.length&&(j+=1),q()}function On(){j=0,q()}function Vn(){Y=!Y,q()}function Dn(){Oe||(d=d>=Se?Ke:d+1,C=!1,q())}function jn(){ge!==null&&window.clearTimeout(ge),d>=Se&&(d=Ke),C=!0,q(),ge=window.setTimeout(()=>{ge=null,Dn()},620)}function je(){ae!==null&&(window.clearInterval(ae),ae=null)}function In(){if(ae!==null){je(),q();return}oe>=3&&(oe=0),q(),ae=window.setInterval(()=>{oe+=1,oe>=3&&(oe=3,je()),q()},800)}function Wn(){je(),oe=0,q()}function Me(){re!==null&&(window.clearInterval(re),re=null)}function Yn(){if(re!==null){Me(),q();return}U>=be&&(U=0),q(),re=window.setInterval(()=>{U+=1,U>=be&&(U=be,Me()),q()},900)}function Hn(){Me(),U=Math.min(be,U+1),q()}function Fn(){Me(),U=0,q()}function q(){Oe||(H=Math.min(H,d-1),He.forEach((n,r)=>{n.svg.textContent="";const c=f("defs");c.append(Be("arw-a",e.accent),Be("arw-t",e.teal),Be("arw-d",e.dim),Be("arw-g",e.ok),Be("arw-w",e.warn)),n.svg.appendChild(c),An[r](n.svg),n.cards.textContent="";const _=qn();for(const x of _){const m=document.createElement("div");m.className="ill-card";const l=document.createElement("div");l.className="k",l.textContent=x.k;const t=document.createElement("div");if(t.className="v",t.textContent=x.v,m.append(l,t),x.hint){const k=document.createElement("div");k.className="ill-card-hint",k.textContent=x.hint,m.appendChild(k)}n.cards.appendChild(m)}}))}return q(),{reset(){d=Ke,pe=0,ie=0,ue=!1,Pe=0,N=0,X=ke,G=ke,O=null,j=0,Y=!1,Ce(),Q=0,we(),q()},destroy(){Oe=!0,ge!==null&&window.clearTimeout(ge),W!==null&&window.clearInterval(W),ae!==null&&window.clearInterval(ae),re!==null&&window.clearInterval(re),Ce(),we()}}};export{ko as default};
