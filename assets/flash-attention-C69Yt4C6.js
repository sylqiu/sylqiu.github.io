import{s as We,e as we}from"./code-highlight-Ct8t2e3l.js";const Ze="http://www.w3.org/2000/svg",e={fg:"#e6edf3",dim:"#8b949e",line:"#2a3140",panel:"#161b22",panel2:"#1c2230",accent:"#58a6ff",ok:"#3fb950",warn:"#d29922",bad:"#f85149",teal:"#39c5cf",purple:"#a371f7"};function n(_,l={}){const w=document.createElementNS(Ze,_);for(const[g,f]of Object.entries(l))w.setAttribute(g,String(f));return w}function Je(_,l,w,g,f={}){const U=n("text",{x:l,y:w,fill:f.fill??e.dim,"font-size":f.size??11,"text-anchor":f.anchor??"start","font-family":f.mono===!0?"ui-monospace, SFMono-Regular, Menlo, monospace":"inherit"});return f.weight!==void 0&&U.setAttribute("font-weight",String(f.weight)),U.textContent=g,_.appendChild(U),U}function Ye(){return typeof window<"u"&&!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches}function Ke(_){const l=Math.min(1,Math.max(0,_));return 1-Math.pow(1-l,3)}function $e(_,l,w){const g=Math.min(1,Math.max(0,(_-l)/(w-l)));return Ke(g)}const pe={stepSeconds:1.35,frameSeconds:1/60,ease:Ke,segment:$e,seconds(_){return Ye()?.001:_}};function et(_,l){const w=n("g",{class:"ill-controls"});_.appendChild(w);const g=new Map;let f=new Map,U=0;const D=K=>{const R=K?.closest?.("g[data-btn]");if(!R||!_.contains(R))return!1;const Z=f.get(R.getAttribute("data-btn")||"");return Z?(Z(),!0):!1};return _.addEventListener("pointerdown",K=>{U=Date.now(),D(K.target)&&K.preventDefault()}),_.addEventListener("click",K=>{Date.now()-U<700||D(K.target)&&K.preventDefault()}),_.addEventListener("keydown",K=>{(K.key==="Enter"||K.key===" ")&&D(K.target)&&K.preventDefault()}),{beginFrame(){f=new Map},button(K,R,Z,B,ie,X=!0){const k=K+","+R+","+Z;let C=g.get(k);if(!C){const J=n("g",{class:"ill-svg-btn"}),G=n("rect",{x:K,y:R,width:Z,height:26,rx:13}),V=n("text",{x:K+Z/2,y:R+17,"text-anchor":"middle","font-size":10.5,"font-weight":600});V.textContent=B,J.append(G,V),w.appendChild(J),C={g:J,rect:G,label:V},g.set(k,C)}const Q=X?e.accent:e.dim;C.rect.setAttribute("fill",Q),C.rect.setAttribute("fill-opacity",String(X?.12:.06)),C.rect.setAttribute("stroke",Q),C.label.textContent=B,C.label.setAttribute("fill",Q),C.g.setAttribute("data-btn",k),C.g.setAttribute("cursor",X?"pointer":"default"),C.g.setAttribute("role","button"),C.g.setAttribute("tabindex","0"),C.g.style.display=X?"":"none",X&&f.set(k,ie)}}}const tt=720;let ke=null,ve=null;function t(_,l,w,g={}){if(!ke)throw new Error("txt() called outside a draw");return Je(ke,_,l,w,g)}function be(_,l){const w=n("marker",{id:_,viewBox:"0 0 10 10",refX:"9",refY:"5",markerWidth:"5",markerHeight:"5",orient:"auto-start-reverse"});return w.appendChild(n("path",{d:"M 0 0 L 10 5 L 0 10 z",fill:l})),w}function Y(_,l,w,g,f,U,D,K=1.2){_.appendChild(n("line",{x1:l,y1:w,x2:g,y2:f,stroke:U,"stroke-width":K,"marker-end":"url(#"+D+")"}))}function $(_,l,w,g,f,U,D=!0){ve?.button(l,w,g,f,U,D)}const Pe=[{id:"memory",title:"Hardware preliminary",blurb:"The CPU orchestrates; GPU programs stage tiles explicitly through SMEM and rely on caches; TPU programs hand tiles to the compiler, which schedules CMEM and the MXU. Unified memory removes explicit copies, but not HBM bandwidth.",h:590},{id:"definition",title:"Attention as softmax(QK^T)V",blurb:"Take one query Q, pair it with every key K and get those logits, then turn them into weights with a softmax, then pair each weight with its value V and sum.",h:510},{id:"naive",title:"Naive implementation",blurb:"If implemented as above, a sequence of kernels will be launched and the N×N score and probability matrices will be materialized in HBM. The trace shows CPU launches, HBM reads/writes, compute-active time, and the memory and communication traffic bill.",h:560},{id:"fused",title:"Fused attention: one kernel, no intermediates",blurb:"The same workload through PyTorch's fused SDPA. One kernel reads Q/K/V and writes O; S and P never exist as whole tensors. This is the memory-efficient SM75 path, not exactly FlashAttention, but very close.",h:500},{id:"tiling",title:"FlashAttention: better scale up KV with online-softmax update",blurb:"Q meets the new K to form a logit s. That logit updates the running maximum m and the running denominator ℓ, and produces the new weight p = exp(s − m). Then p, ℓ and the new V flow can be used to update O: p·V is accumulated and ℓ normalizes the result. Everything can be done in one kernel.",h:670}],ze=4,ye=3,it=Array.from({length:ze},(_,l)=>Array.from({length:ye},(w,g)=>Math.sin((l+1)*.7+(g+1)*.4))),at=Array.from({length:ze},(_,l)=>Array.from({length:ye},(w,g)=>Math.cos((l+1)*.5+(g+1)*.8))),nt=Array.from({length:ze},(_,l)=>Array.from({length:ye},(w,g)=>Math.cos(l*1.1+g*.7)));it.map(_=>at.map(l=>_.reduce((w,g,f)=>w+g*l[f],0)/Math.sqrt(ye)));const lt=[{title:"PyTorch SDPA",lang:"python",tag:"v2 · any GPU",note:"PyTorch is the high-level tensor library. q, k, and v are dense tensors shaped (batch, heads, sequence, head_dim); torch.float16 is the operand type. F.scaled_dot_product_attention is one fused op, not a hand-written loop. SDPBackend is an enum of kernel families and sdpa_kernel is a context manager that pins one family.",code:`import torch
import torch.nn.functional as F
from torch.nn.attention import SDPBackend, sdpa_kernel

# torch.randn allocates random-normal values. Shape:
# (batch, heads, sequence, head_dim) = (2, 8, 4096, 64).
# float16 is the matmul precision; PyTorch accumulates softmax in fp32.
q = torch.randn(2, 8, 4096, 64, device="cuda", dtype=torch.float16)
k = torch.randn_like(q)   # same shape, dtype, and device as q
v = torch.randn_like(q)

# One op fuses Q @ K^T, the 1/sqrt(d) scale, the causal mask,
# softmax, and P @ V. is_causal=True means query i sees keys j <= i.
out = F.scaled_dot_product_attention(q, k, v, is_causal=True)

# SDPBackend names the kernel families (FLASH_ATTENTION, EFFICIENT_ATTENTION,
# CUDNN_ATTENTION, MATH). sdpa_kernel pins one for the block.
with sdpa_kernel(SDPBackend.FLASH_ATTENTION):
    out = F.scaled_dot_product_attention(q, k, v, is_causal=True)`,refs:'<p class="ill-refs"><a href="https://pytorch.org/docs/stable/generated/torch.nn.functional.scaled_dot_product_attention.html">torch.nn.functional.scaled_dot_product_attention</a> · <a href="https://pytorch.org/blog/accelerating-large-language-models/">PyTorch SDPA backends</a></p>'},{title:"Triton FA-2 forward",lang:"python",tag:"v2 · Ampere / Hopper",note:"Triton is a Python-embedded GPU kernel language: the decorated function becomes a kernel, and each program is one CTA. tl.arange builds index vectors, [:, None] adds a dimension for broadcasting, and tl.load takes a base pointer plus element offsets. BLOCK_M/BLOCK_N are compile-time tile sizes. tl.dot lowers to the target's matrix instructions; tl.max(..., 1) reduces each row.",code:`# Triton is a Python-embedded GPU language. @triton.jit turns this
# function into a kernel; each program (CTA) owns BLOCK_M query rows
# for one (batch, head) pair.
@triton.jit
def _attn_fwd(Q, K, V, O, sm_scale,
              # Element strides, not bytes. For a contiguous tensor,
              # stride_qm is head_dim and stride_qk is 1.
              stride_qz, stride_qh, stride_qm, stride_qk,
              stride_kz, stride_kh, stride_kn, stride_kk,
              stride_vz, stride_vh, stride_vn, stride_vk,
              stride_oz, stride_oh, stride_om, stride_on,
              Z, H, N_CTX,
              # tl.constexpr = known at compile time, so Triton can size
              # registers and shared memory for the tile.
              BLOCK_M: tl.constexpr, BLOCK_N: tl.constexpr,
              HEAD_DIM: tl.constexpr):
    # program_id(0) selects the query tile; program_id(1) selects
    # the flattened (batch, head) slice.
    start_m = tl.program_id(0)
    off_hz = tl.program_id(1)
    qvk_offset = off_hz * stride_qh

    # tl.arange builds a vector of indices. [:, None] makes it a column,
    # so row and column offsets broadcast into a BLOCK_M x HEAD_DIM tile.
    q = tl.load(Q + qvk_offset + start_m * BLOCK_M * stride_qm
                + tl.arange(0, BLOCK_M)[:, None] * stride_qm
                + tl.arange(0, HEAD_DIM)[None, :] * stride_qk)

    # Running softmax state, one value per query row.
    m_i = tl.full([BLOCK_M], -float("inf"), tl.float32)  # row max
    l_i = tl.zeros([BLOCK_M], tl.float32)                # row denominator
    acc = tl.zeros([BLOCK_M, HEAD_DIM], tl.float32)      # P @ V accumulator

    for start_n in range(0, N_CTX, BLOCK_N):
        # Load one BLOCK_N x HEAD_DIM K tile.
        k = tl.load(K + qvk_offset + start_n * stride_kn
                    + tl.arange(0, BLOCK_N)[:, None] * stride_kn
                    + tl.arange(0, HEAD_DIM)[None, :] * stride_kk)
        # tl.dot is the matrix multiply (tensor cores); tl.trans transposes.
        qk = tl.dot(q, tl.trans(k)) * sm_scale

        # tl.max(qk, 1) reduces along axis 1 (each row); tl.maximum is elementwise.
        m_new = tl.maximum(m_i, tl.max(qk, 1))
        # If the row max grew, rescale the old denominator.
        alpha = tl.exp(m_i - m_new)
        p = tl.exp(qk - m_new[:, None])
        # tl.sum(p, 1) is the new row sum, added to the rescaled old sum.
        l_i = l_i * alpha + tl.sum(p, 1)

        v = tl.load(V + qvk_offset + start_n * stride_vn
                    + tl.arange(0, BLOCK_N)[:, None] * stride_vn
                    + tl.arange(0, HEAD_DIM)[None, :] * stride_vk)
        # p.to(v.dtype) casts probabilities to fp16 for the tensor-core dot.
        acc = acc * alpha[:, None] + tl.dot(p.to(v.dtype), v)
        m_i = m_new

    # Divide once at the end; p stayed unnormalized through the loop.
    acc = acc / l_i[:, None]
    tl.store(O + qvk_offset + start_m * BLOCK_M * stride_om
             + tl.arange(0, BLOCK_M)[:, None] * stride_om
             + tl.arange(0, HEAD_DIM)[None, :] * stride_on, acc)`,refs:'<p class="ill-refs"><a href="https://github.com/triton-lang/triton/blob/main/python/tutorials/06-fused-attention.py">Triton fused-attention tutorial</a> · <a href="https://github.com/Dao-AILab/flash-attention">Dao-AILab/flash-attention</a></p>'},{title:"Hopper CUTLASS (FA-3)",lang:"cuda",tag:"v3 · H100 · SM90",note:"This is a CuTe/CUTLASS-style schedule sketch, not a complete translation unit. __global__ marks a host-launched kernel, __shared__ places a tile in per-CTA shared memory (SMEM), half is fp16, and barrier is an arrive/wait barrier. A TMA descriptor (TmaDescriptor, make_tma_copy) describes an asynchronous bulk copy; copy(tmaK.with(barK), ...) enqueues it. WGMMA is Hopper's warpgroup matrix instruction, and GMMA::ScaleOut says whether to overwrite or accumulate.",code:`// Sketch, not a full TU: BQ, BK, D, num_k_tiles, warp_idx,
// sQ_desc, sK_desc, and idesc come from the enclosing CUTLASS kernel.
// One CTA owns BQ query rows. Warp 0 is the producer (TMA);
// the other warps are consumers (WGMMA + online softmax).
#include <cute/tensor.hpp>
#include <cuda/barrier>

using namespace cute;   // CuTe layout/tensor vocabulary

__global__ void flash_fwd_h100(const half* Q, const half* K,
                               const half* V, half* O) {
  // __shared__ = per-CTA SMEM. alignas(128) keeps TMA/WGMMA aligned.
  __shared__ alignas(128) half sQ[BQ][D];
  __shared__ alignas(128) half sK[BK][D];
  __shared__ alignas(128) half sV[BK][D];
  __shared__ barrier barK, barV;   // mbarrier: arrive/wait for TMA

  // A TMA descriptor describes a multidimensional bulk copy. make_tma_copy
  // builds it for a tensor and a shared-memory layout.
  TmaDescriptor tmaQ = make_tma_copy(SM90_TMA_LOAD{}, Q, ...);
  TmaDescriptor tmaK = make_tma_copy(SM90_TMA_LOAD{}, K, ...);
  TmaDescriptor tmaV = make_tma_copy(SM90_TMA_LOAD{}, V, ...);
  copy(tmaQ, Q + blockIdx.x * BQ * D, sQ);   // enqueue Q tile

  if (warp_idx == 0) {                        // producer warp
    for (int kt = 0; kt < num_k_tiles; ++kt) {
      // .with(barK) attaches the barrier that signals copy completion.
      copy(tmaK.with(barK), K + kt * BK * D, sK);
      copy(tmaV.with(barV), V + kt * BK * D, sV);
    }
  } else {                                    // consumer warpgroups
    float m[BQ], l[BQ], acc[BQ][D];
    for (int kt = 0; kt < num_k_tiles; ++kt) {
      barK.wait(0);   // wait for the K tile
      // WGMMA: warpgroup matrix multiply-accumulate. ScaleOut::Zero
      // overwrites the accumulator; ScaleOut::One accumulates into it.
      wgmma(acc, sQ, sK, GMMA::ScaleOut::Zero);   // S = Q K^T
      online_softmax(acc, m, l);                  // rescale by exp(m_old - m_new)
      barV.wait(0);   // wait for the V tile
      wgmma(acc, acc, sV, GMMA::ScaleOut::One);   // O += P V
    }
  }
}`,refs:'<p class="ill-refs"><a href="https://github.com/Dao-AILab/flash-attention/tree/main/hopper">FA-3 Hopper kernels</a> · <a href="https://github.com/NVIDIA/cutlass">CUTLASS</a> · <a href="https://arxiv.org/abs/2407.08608">FlashAttention-3 paper</a></p>'},{title:"Blackwell tcgen05 (FA-4)",lang:"cuda",tag:"v4 · B200 · SM100",note:"Blackwell's tcgen05 path moves the accumulator out of registers into Tensor Memory (TMEM). tcgen05_alloc reserves TMEM columns and returns an address; tcgen05_mma issues the 2-SM matrix instruction; idesc is the instruction descriptor (dtype, shape, transpose); tcgen05_commit and mma_bar order completion; tcgen05_ld/st move the softmax tile between TMEM and registers. elect_one_sync picks one thread for the allocation.",code:`// Sketch, not a full TU: BQ, BK, D, num_k_tiles, sQ_desc, sK_desc,
// sV_desc, and idesc come from the enclosing kernel.
// A CTA pair owns 256 Q rows; K/V tiles arrive by TMA.
#include <cuda/barrier>

__global__ void flash_fwd_b200(const half* Q, const half* K,
                               const half* V, half* O) {
  __shared__ alignas(1024) half sQ[256][D];
  __shared__ alignas(1024) half sK[BK][D];
  __shared__ alignas(1024) half sV[BK][D];
  __shared__ uint32_t tmem_addr;      // TMEM base address, in columns
  __shared__ barrier barK, barV, mma_bar;

  // elect_one_sync = one thread in the warp performs the allocation.
  if (elect_one_sync()) tcgen05_alloc(&tmem_addr, 512);

  TmaDescriptor tmaK = make_tma_copy(SM100_TMA_LOAD{}, K, ...);
  TmaDescriptor tmaV = make_tma_copy(SM100_TMA_LOAD{}, V, ...);

  for (int kt = 0; kt < num_k_tiles; ++kt) {
    copy(tmaK.with(barK), K + kt * BK * D, sK);
    copy(tmaV.with(barV), V + kt * BK * D, sV);
    barK.wait(0);

    // tcgen05_mma = Blackwell 2-SM matrix multiply-accumulate.
    // idesc describes operand dtype/shape/transpose; ScaleOut::Zero resets.
    tcgen05_mma(tmem_addr + 0, sQ_desc, sK_desc, idesc,
                GMMA::ScaleOut::Zero, mma_bar);
    tcgen05_commit(mma_bar);   // make the MMA visible to the barrier
    mma_bar.wait(0);

    // tcgen05_ld/st copy between TMEM and registers around the softmax.
    tcgen05_ld(tmem_addr + 0, s_reg);     // S tile -> registers
    online_softmax(s_reg, m, l);
    tcgen05_st(s_reg, tmem_addr + 0);     // P tile -> TMEM
    barV.wait(0);
    tcgen05_mma(tmem_addr + 256, tmem_addr + 0, sV_desc, idesc,
                GMMA::ScaleOut::One, mma_bar);   // O += P V
  }
}`,refs:'<p class="ill-refs"><a href="https://github.com/Dao-AILab/flash-attention">Dao-AILab/flash-attention (v4)</a> · <a href="https://docs.nvidia.com/cuda/cuda-c-programming-guide/">CUDA tcgen05 / TMEM guide</a></p>'},{title:"AMD ROCm (CDNA3)",lang:"python",tag:"MI300 · MFMA",note:"CDNA3 is AMD's data-center GPU architecture, and MFMA is its matrix instruction. The Triton loop is the same as the NVIDIA card, but the launch knobs differ: matrix_instr_nonkdim=32 selects 32x32 MFMA shapes, waves_per_eu controls how many wavefronts share a compute unit, and num_stages pipelines shared-memory (LDS) loads. grid is the number of programs; each owns BLOCK_M query rows.",code:`# CDNA3 (MI300): the same online-softmax loop, lowered to MFMA.
# Triton launch knobs select 32x32 MFMA shapes and LDS/occupancy tradeoffs.
@triton.jit
def _attn_fwd_rocm(Q, K, V, O, sm_scale, stride_m, stride_k, N_CTX,
                   BLOCK_M: tl.constexpr, BLOCK_N: tl.constexpr,
                   HEAD_DIM: tl.constexpr):
    # off_m is the first query row owned by this program.
    off_m = tl.program_id(0) * BLOCK_M

    # One running softmax state per query row, in fp32.
    m_i = tl.full([BLOCK_M], -float("inf"), tl.float32)
    l_i = tl.zeros([BLOCK_M], tl.float32)
    acc = tl.zeros([BLOCK_M, HEAD_DIM], tl.float32)

    # tl.arange + [:, None] builds the row indices; [None, :] builds columns.
    q = tl.load(Q + off_m * stride_m
                + tl.arange(0, BLOCK_M)[:, None] * stride_m
                + tl.arange(0, HEAD_DIM)[None, :])

    for start_n in range(0, N_CTX, BLOCK_N):
        k = tl.load(K + start_n * stride_k
                    + tl.arange(0, BLOCK_N)[:, None] * stride_k
                    + tl.arange(0, HEAD_DIM)[None, :])
        # tl.dot lowers to MFMA on CDNA; the math is unchanged.
        qk = tl.dot(q, tl.trans(k)) * sm_scale
        m_new = tl.maximum(m_i, tl.max(qk, 1))
        alpha = tl.exp(m_i - m_new)
        p = tl.exp(qk - m_new[:, None])
        l_i = l_i * alpha + tl.sum(p, 1)

        v = tl.load(V + start_n * stride_k
                    + tl.arange(0, BLOCK_N)[:, None] * stride_k
                    + tl.arange(0, HEAD_DIM)[None, :])
        # Cast p to fp16 so the MFMA operand matches v.
        acc = acc * alpha[:, None] + tl.dot(p.to(tl.float16), v)
        m_i = m_new

    tl.store(O + off_m * stride_m
             + tl.arange(0, BLOCK_M)[:, None] * stride_m
             + tl.arange(0, HEAD_DIM)[None, :], acc / l_i[:, None])

# grid = number of programs. num_warps/num_stages and the MFMA shape
# are launch-time tuning knobs; waves_per_eu limits occupancy per CU.
_attn_fwd_rocm[(grid_m, grid_h)](..., num_warps=8, num_stages=2,
                                 matrix_instr_nonkdim=32, waves_per_eu=1)`,refs:'<p class="ill-refs"><a href="https://github.com/ROCm/composable_kernel">Composable Kernel</a> · <a href="https://rocm.docs.amd.com/">ROCm docs</a> · <a href="https://github.com/triton-lang/triton">Triton on AMD</a></p>'},{title:"TPU Pallas",lang:"python",tag:"TPU v5e / v6e",note:"Pallas is JAX's kernel language for TPU and GPU. pl.pallas_call launches a kernel over a grid; pl.BlockSpec says which slice of each input the program sees and how the block index maps to it. q_ref[...] reads the block and o_ref[...] = ... writes it. jnp is JAX's NumPy-like API; jax.ShapeDtypeStruct declares the output shape and dtype. XLA maps the block to CMEM and the MXU.",code:`import jax
import jax.numpy as jnp
from jax.experimental import pallas as pl

# Pallas passes each input as a ref (a view of one block), not a whole tensor.
def flash_kernel(q_ref, k_ref, v_ref, o_ref, *, BQ: int, BK: int, D: int):
    # q_ref[...] reads the current block into a JAX array; astype is a cast.
    q = q_ref[...].astype(jnp.float32)

    # Running softmax state. jnp.full/zeros allocate arrays on the TPU.
    m = jnp.full((BQ,), -jnp.inf, jnp.float32)
    l = jnp.zeros((BQ,), jnp.float32)
    acc = jnp.zeros((BQ, D), jnp.float32)

    for kt in range(k_ref.shape[0]):
        k = k_ref[kt].astype(jnp.float32)
        v = v_ref[kt].astype(jnp.float32)

        # jnp.dot lowers to the MXU; k.T is a transpose view.
        s = jnp.dot(q, k.T) * (1.0 / jnp.sqrt(D))
        # jnp.max(..., axis=1) reduces each row; jnp.maximum is elementwise.
        m_new = jnp.maximum(m, jnp.max(s, axis=1))
        alpha = jnp.exp(m - m_new)
        p = jnp.exp(s - m_new[:, None])
        l = l * alpha + jnp.sum(p, axis=1)
        # [:, None] broadcasts the row scale across the D columns.
        acc = acc * alpha[:, None] + jnp.dot(p.astype(v.dtype), v)
        m = m_new

    # o_ref[...] = ... writes the output block back to HBM.
    o_ref[...] = (acc / l[:, None]).astype(o_ref.dtype)

# pl.pallas_call launches the kernel. grid says how many programs run;
# each BlockSpec maps a program index to an input/output block.
def flash_attention(q, k, v, BQ=128, BK=128):
    return pl.pallas_call(
        flash_kernel,
        grid=(q.shape[0] // BQ,),
        in_specs=[
            pl.BlockSpec((BQ, q.shape[-1]), lambda i: (i, 0)),
            pl.BlockSpec((q.shape[0] // BK, BK, k.shape[-1]), lambda i: (0, 0, 0)),
            pl.BlockSpec((q.shape[0] // BK, BK, v.shape[-1]), lambda i: (0, 0, 0)),
        ],
        out_specs=pl.BlockSpec((BQ, v.shape[-1]), lambda i: (i, 0)),
        out_shape=jax.ShapeDtypeStruct((q.shape[0], v.shape[-1]), q.dtype),
    )(q, k, v)`,refs:'<p class="ill-refs"><a href="https://github.com/jax-ml/jax/tree/main/jax/experimental/pallas/ops/tpu/attention">Pallas TPU attention</a> · <a href="https://jax.readthedocs.io/en/latest/pallas/index.html">Pallas docs</a> · <a href="https://arxiv.org/abs/2308.14089">Pallas paper</a></p>'},{title:"FP8 variant",lang:"python",tag:"Hopper / Blackwell",note:"FP8 is a storage and matmul format, not a softmax format. tl.float8e4nv is the E4M3 variant (4 exponent bits, 3 mantissa bits). per_tile_quant is a stand-in for a quantization helper that returns the FP8 tile plus a scale; the scales are applied after the dot. m, l, and acc stay in fp32 because exponentiation and accumulation lose too much precision in FP8.",code:`# FP8 on Hopper/Blackwell: quantize operands per tile, accumulate in fp32.
# The softmax state stays fp32; only the matmul operands are low precision.
# per_tile_quant is a helper: it returns (fp8_tile, scale) for each tile.
q8, q_scale = per_tile_quant(q, axis=-1, dtype=tl.float8e4nv)
k8, k_scale = per_tile_quant(k, axis=-1, dtype=tl.float8e4nv)
v8, v_scale = per_tile_quant(v, axis=-1, dtype=tl.float8e4nv)

# The dot sees fp8 operands; the per-tile scales are applied afterwards.
s = tl.dot(q8, tl.trans(k8)) * (q_scale[:, None] * k_scale[None, :]) * sm_scale
m_new = tl.maximum(m_i, tl.max(s, 1))
p = tl.exp(s - m_new[:, None])
l_i = l_i * tl.exp(m_i - m_new) + tl.sum(p, 1)
# Cast p down for the P @ V dot, then undo v_scale in fp32.
acc = acc * tl.exp(m_i - m_new)[:, None] + tl.dot(p.to(tl.float8e4nv), v8) * v_scale
m_i = m_new`,refs:'<p class="ill-refs"><a href="https://arxiv.org/abs/2407.08608">FlashAttention-3</a> · <a href="https://github.com/Dao-AILab/flash-attention">FP8 kernels</a> · <a href="https://docs.nvidia.com/deeplearning/transformer-engine/">Transformer Engine</a></p>'}];function Se(_){return we(_).replace(/"/g,"&quot;")}function ot(){const _='<p>The equation is fixed; the kernel is a schedule. Each release moves the same online-softmax loop onto a different memory path and matrix unit. The snippets are representative sketches, not drop-in code — the links point at the production kernels.</p><p class="kernel-note"><strong>Reading guide.</strong> B/H/N/D mean batch, heads, sequence length, and head dimension. BQ/BK and BLOCK_M/BLOCK_N are tile sizes. HBM is global memory; SMEM/LDS is per-SM shared memory; TMEM is Blackwell tensor memory; CMEM is TPU on-chip memory. MMA, WGMMA, tcgen05, MFMA, and MXU are matrix instructions or units. Strides are in elements, not bytes.</p>',l='<div class="kernel-table-wrap"><table class="kernel-table"><thead><tr><th>Release</th><th>Year</th><th>Hardware</th><th>Schedule change</th></tr></thead><tbody><tr><td>v1</td><td>2022</td><td>A100 · SM80</td><td>IO-aware tiling; recompute S/P instead of storing them.</td></tr><tr><td>v2</td><td>2023</td><td>A100 / H100</td><td>Better work partitioning; fewer non-matmul FLOPs; causal fast path.</td></tr><tr><td>v3</td><td>2024</td><td>H100 · SM90</td><td>Warp specialization, TMA, WGMMA, FP8.</td></tr><tr><td>v4</td><td>2025</td><td>B200 · SM100</td><td>tcgen05 MMA, Tensor Memory, 2-SM cooperation.</td></tr></tbody></table></div><p class="kernel-note">Upstream versions are FlashAttention releases. Triton, ROCm, and Pallas are ports of the same algorithm to other toolchains.</p>',w=lt.map(f=>'<h3 class="kernel-h">'+we(f.title)+'</h3><p class="kernel-note">'+we(f.note)+'</p><pre data-lang="'+f.lang+'" data-title="'+Se(f.title)+'" data-tag="'+Se(f.tag)+'"><code>'+we(f.code.trim())+"</code></pre>"+f.refs);return[_,l,...w,'<p class="ill-refs"><strong>More:</strong> <a href="https://github.com/Dao-AILab/flash-attention">Dao-AILab/flash-attention</a> · <a href="https://github.com/NVIDIA/cutlass">CUTLASS</a> · <a href="https://github.com/triton-lang/triton">Triton</a> · <a href="https://github.com/jax-ml/jax/tree/main/jax/experimental/pallas">Pallas</a> · <a href="https://arxiv.org/abs/2205.14135">FlashAttention</a> · <a href="https://arxiv.org/abs/2307.08691">FlashAttention-2</a> · <a href="https://arxiv.org/abs/2407.08608">FlashAttention-3</a></p>']}Pe.push({id:"kernels",title:"Kernel implementations: versions and hardware variants",blurb:"v1 through v4 keep the same online-softmax math and move it across memory hierarchies and matrix units. Below: a representative kernel for each path, from the PyTorch dispatch to Triton, CUTLASS on Hopper, tcgen05 on Blackwell, ROCm, Pallas on TPU, and the FP8 variant.",h:160,prose:ot()});const rt=_=>{let l=1,w=!1,g=0,f=0,U=[!1,!1,!1,!1],D=null,K=0,R=!1,Z="gpu",B=0,ie=!1,X=null,k=0,C=!1,Q=0;const J=[!1,!1,!1,!1];let G=0,V=null,re=0,he=!1;const xe=document.createElement("div");xe.className="ill";const ce=[];Pe.forEach((i,o)=>{const s=document.createElement("section");s.className="ill-sec",s.id="ill-"+i.id;const x=document.createElement("div");x.className="ill-sec-head";const h=document.createElement("h2");h.textContent=o+1+" · "+i.title;const u=document.createElement("div");u.className="ill-sec-ctl",x.append(h,u);const r=document.createElement("p");r.className="ill-sec-blurb",r.textContent=i.blurb;const c=document.createElement("div");c.className="ill-fig";const m=n("svg",{viewBox:"0 0 "+tt+" "+i.h,role:"img","aria-label":i.title}),d=n("g",{class:"ill-art"});m.appendChild(d);const p=et(m);if(c.appendChild(m),s.append(x,r,c),i.prose){const z=document.createElement("div");z.className="ill-prose",z.innerHTML=i.prose.map(a=>a.trim().startsWith("<")?a:"<p>"+a+"</p>").join(""),We(z),s.appendChild(z)}xe.appendChild(s),ce.push({svg:m,art:d,controls:p,ctl:u,section:s})}),_.appendChild(xe);const me=new Set;let de=null;if("IntersectionObserver"in window){de=new IntersectionObserver(i=>{for(const o of i){const s=ce.findIndex(x=>x.section===o.target);s<0||(o.isIntersecting?me.add(s):me.delete(s),s===1&&o.isIntersecting&&w&&D===null?(K=performance.now(),D=window.requestAnimationFrame(Me)):s===1&&!o.isIntersecting&&D!==null&&(window.cancelAnimationFrame(D),D=null),s===4&&o.isIntersecting&&C&&V===null?(re=performance.now(),V=window.requestAnimationFrame(ge)):s===4&&!o.isIntersecting&&V!==null&&(window.cancelAnimationFrame(V),V=null))}},{rootMargin:"160px 0px"});for(const{section:i}of ce)de.observe(i)}const De=[Fe,qe,He,Ie,Re,Xe];function H(i){const{art:o,controls:s}=ce[i];for(ve=s,s.beginFrame();o.firstChild;)o.removeChild(o.firstChild);ke=o,De[i](o),ke=null,ve=null}function Oe(){for(let i=0;i<ce.length;i++)H(i)}function qe(i){i.appendChild(be("arw-def",e.dim));const o=30,s=70,x=70,h=70,u=150,r=232,c=310,m=[80,130,180,230],d=[180,275,370,465],p=Math.min(1,Math.max(0,f)),z=pe.ease(p),a={x:o+s/2,y:m[g]+15},M=m[g]+15,O=b=>Math.min(1,Math.max(0,b));t(20,24,"one Q  →  every K  →  softmax  →  every V  →  one O",{size:10,weight:700,fill:e.fg}),t(20,40,"each Q loops over the K/V tokens; the animation runs the loop for you",{size:8.5,fill:e.dim}),t(o,58,"Q loop",{size:9,weight:700,fill:e.dim}),m.forEach((b,L)=>{const P=L===g;i.appendChild(n("rect",{x:o,y:b,width:s,height:30,rx:6,fill:P?e.accent:e.panel2,"fill-opacity":P?.18:.55,stroke:P?e.accent:e.line,"stroke-width":P?1.6:1})),t(o+s/2,b+19,"Q",{anchor:"middle",size:11,weight:700,fill:P?e.fg:e.dim,mono:!0})}),t(o,272,"one Q at a time",{size:8.5,fill:e.dim}),t(180,58,"K loop · every key",{size:9,weight:700,fill:e.dim}),t(180,296,"V loop · every value",{size:9,weight:700,fill:e.dim});const T=(b,L,P,N,y,I=32,j=20)=>{y<=.02||(i.appendChild(n("rect",{x:b-I/2,y:L-j/2,width:I,height:j,rx:5,fill:N,"fill-opacity":.08+.16*y,stroke:N,"stroke-opacity":.6*y})),t(b,L+3.5,P,{anchor:"middle",size:7.5,fill:N,mono:!0}))};if(d.forEach((b,L)=>{const P={x:b+h/2,y:u};i.appendChild(n("rect",{x:b,y:x,width:h,height:30,rx:6,fill:l>=1?e.ok:e.panel2,"fill-opacity":l>=1?.16:.55,stroke:l>=1?e.ok:e.line})),t(b+h/2,x+19,"K",{anchor:"middle",size:11,weight:700,fill:l>=1?e.fg:e.dim,mono:!0});const N=l>=3;if(i.appendChild(n("rect",{x:b,y:c,width:h,height:30,rx:6,fill:N?e.purple:e.panel2,"fill-opacity":N?.16:.55,stroke:N?e.purple:e.line})),t(b+h/2,c+19,"V",{anchor:"middle",size:11,weight:700,fill:N?e.fg:e.dim,mono:!0}),l===1&&p<.9){const y={x:a.x+(P.x-a.x)*z,y:a.y+(P.y-a.y)*z},I={x:P.x,y:x+15+(P.y-(x+15))*z};T(y.x,y.y,"Q",e.accent,.95),T(I.x,I.y,"K",e.ok,.95)}if(l===1&&p>.68&&T(P.x,P.y,"logit",e.warn,1,44,20),l===2&&p<.52){const y=O(p/.52),I=1-Math.pow(1-y,3);T(P.x+(360-P.x)*I,u+(190-u)*I,"logit",e.warn,1,44,20)}if(l>=2){const y=l===2?O((p-.42)/.58):1,j=Math.max(3,[28,48,58,36][L]*y);i.appendChild(n("rect",{x:P.x-j/2,y:r,width:j,height:10,rx:5,fill:e.ok,"fill-opacity":.75,stroke:e.ok,"stroke-opacity":.8}))}if(l>=3){const y=O(p/.45),I=1-Math.pow(1-y,3),j=b+h/2;y<.98&&T(j,r+10+(c+15-(r+10))*I,"w",e.ok,1,22,16),y>.55&&T(j,c+15,"w·V",e.purple,1,34,16);const le=O((p-.45-L*.05)/.5);le>0&&le<1&&T(j+(640-j)*le,c+15+(M-(c+15))*le,"w·V",e.purple,1-le,34,16)}}),l===2){const b=O((p-.2)/.25);T(360,190,"Σ",e.teal,b,44,24),b>.2&&t(360,214,"denominator",{anchor:"middle",size:7.5,fill:e.teal}),O((p-.42)/.58)>0&&t(170,r+8,"weights",{size:8.5,fill:e.ok,anchor:"end"})}else l===1&&t(170,u-5,"logits",{size:8.5,fill:e.warn,anchor:"end"});t(590,58,"O loop · one per Q",{size:9,weight:700,fill:e.dim}),m.forEach((b,L)=>{const P=L===g,N=U[L],y=N||P&&l>=3;i.appendChild(n("rect",{x:590,y:b,width:100,height:30,rx:6,fill:y?e.purple:e.panel2,"fill-opacity":y?N?.22:.12+.1*p:.55,stroke:y?e.purple:e.line,"stroke-width":P?1.5:1})),t(640,b+19,"O",{anchor:"middle",size:11,weight:700,fill:y?e.fg:e.dim,mono:!0})}),t(590,260,"one O per Q",{size:8.5,fill:e.dim});const W=["","1 · Merge the active Q with every K at once; each pair becomes a logit.","2 · Merge the logits into the softmax denominator; normalize them into weights.","3 · Merge each weight with its V; sum the weighted values into O. Then the next Q begins."][l];t(20,424,W,{size:10,fill:e.fg}),$(i,20,446,82,"▶ Step",()=>{Ne()}),$(i,110,446,92,w?"⏸ Pause":"▶ Run",()=>{Ee()}),$(i,210,446,80,"↺ Reset",()=>{Le()}),t(305,464,"step "+l+" / 3",{size:9.5,fill:e.dim,mono:!0}),t(20,492,"The inner loop is over K/V; the outer loop is over Q.",{size:9,fill:e.dim})}function ae(){H(1)}function ne(){w=!1,D!==null&&(window.cancelAnimationFrame(D),D=null)}function Ae(i=!1){D!==null&&(window.cancelAnimationFrame(D),D=null),w=!0,R=i,K=performance.now(),ae(),D=window.requestAnimationFrame(Me)}function Me(i){if(D=null,!w)return;const o=Math.min(.05,(i-K)/1e3);if(K=i,f+=o/(l===1?.9:l===2?.85:1.05),f>=1)if(f=0,l===1){if(R){f=1,ne(),ae();return}l=2}else if(l===2){if(R){f=1,ne(),ae();return}l=3}else{if(U[g]=!0,R){f=1,ne(),ae();return}g=(g+1)%4,l=1}ae(),w&&(de===null||me.has(1))&&(D=window.requestAnimationFrame(Me))}function Ne(){ne(),l===1?l=2:l===2?l=3:(g=(g+1)%4,l=1),f=0,Ae(!0)}function Ee(){if(w){ne(),ae();return}Ae(!1)}function Le(){ne(),g=0,l=1,f=0,U=[!1,!1,!1,!1],ae()}function Fe(i){i.appendChild(be("arw-mem",e.dim));const o=Z==="gpu",s=Z==="tpu",x=(u,r,c,m,d,p,z,a=!1)=>{i.appendChild(n("rect",{x:u,y:r,width:c,height:m,rx:7,fill:e.panel,"fill-opacity":a?.3:.7,stroke:z,"stroke-opacity":a?.28:.7})),t(u+12,r+16,d,{size:10,weight:700,fill:a?e.dim:z}),t(u+12,r+m-8,p,{size:8,fill:e.dim})};i.appendChild(n("rect",{x:20,y:20,width:680,height:52,rx:9,fill:e.panel,"fill-opacity":.55,stroke:e.line})),t(34,40,"CPU host",{size:11,weight:700,fill:e.fg}),t(34,56,"launches kernels · schedules DMA · owns page tables / coherence",{size:8.5,fill:e.dim}),t(688,40,"control plane",{size:8,fill:e.dim,anchor:"end"}),Y(i,185,72,185,126,e.dim,"arw-mem"),Y(i,535,72,535,126,e.dim,"arw-mem"),t(195,94,"launch / DMA",{size:8,fill:e.dim}),t(545,94,"launch / DMA",{size:8,fill:e.dim}),i.appendChild(n("rect",{x:20,y:100,width:330,height:240,rx:10,fill:e.panel,"fill-opacity":o?.4:.18,stroke:e.accent,"stroke-opacity":o?.55:.2})),t(34,118,"GPU",{size:13,weight:700,fill:o?e.accent:e.dim}),t(335,118,o?"selected":"dimmed",{size:7.5,fill:o?e.accent:e.dim,anchor:"end"}),x(35,128,300,42,"HBM3","80 GB · 3.35 TB/s",e.accent,!o),x(95,188,180,32,"L2 cache","50 MB · shared by SMs",e.teal,!o),i.appendChild(n("rect",{x:35,y:238,width:300,height:86,rx:8,fill:e.panel,"fill-opacity":o?.55:.25,stroke:e.accent,"stroke-opacity":o?.5:.2})),t(47,256,"SM · streaming multiprocessor",{size:9,weight:700,fill:e.dim}),t(47,274,"SMEM 228 KB · tensor cores",{size:8.5,fill:e.fg,mono:!0}),t(47,292,"explicit tiling",{size:8.5,fill:e.fg}),t(47,308,"caches help; tiling decides",{size:8.5,fill:e.warn}),Y(i,185,170,185,188,e.dim,"arw-mem"),Y(i,185,220,185,238,e.dim,"arw-mem"),Y(i,210,238,210,220,e.dim,"arw-mem"),Y(i,210,188,210,170,e.dim,"arw-mem"),t(220,182,"3.35 TB/s",{size:8,fill:e.accent,mono:!0}),t(220,232,"on-chip",{size:8,fill:e.dim}),i.appendChild(n("rect",{x:370,y:100,width:330,height:240,rx:10,fill:e.panel,"fill-opacity":s?.4:.18,stroke:e.purple,"stroke-opacity":s?.55:.2})),t(384,118,"TPU",{size:13,weight:700,fill:s?e.purple:e.dim}),t(685,118,s?"selected":"dimmed",{size:7.5,fill:s?e.purple:e.dim,anchor:"end"}),x(385,128,300,42,"HBM","95 GB · 2.76 TB/s",e.purple,!s),x(445,188,180,32,"CMEM","compiler-managed SRAM",e.teal,!s),i.appendChild(n("rect",{x:385,y:238,width:300,height:86,rx:8,fill:e.panel,"fill-opacity":s?.55:.25,stroke:e.purple,"stroke-opacity":s?.5:.2})),t(397,256,"MXU + vector unit",{size:9,weight:700,fill:e.dim}),t(397,274,"systolic array · softmax",{size:8.5,fill:e.purple,mono:!0}),t(397,292,"compiler-scheduled DMA",{size:8.5,fill:e.fg}),t(397,308,"block shapes, not caches",{size:8.5,fill:e.warn}),Y(i,535,170,535,188,e.dim,"arw-mem"),Y(i,535,220,535,238,e.dim,"arw-mem"),Y(i,560,238,560,220,e.dim,"arw-mem"),Y(i,560,188,560,170,e.dim,"arw-mem"),t(570,182,"2.76 TB/s",{size:8,fill:e.purple,mono:!0}),t(570,232,"on-chip",{size:8,fill:e.dim}),i.appendChild(n("rect",{x:20,y:352,width:680,height:94,rx:9,fill:e.panel,"fill-opacity":.55,stroke:e.teal,"stroke-opacity":.45})),t(34,372,"bandwidth ladder · H100-class · approximate",{size:9.5,weight:700,fill:e.teal}),[{label:"HBM",value:"3.35 TB/s",frac:3.35/30,color:e.accent},{label:"L2 / on-chip path",value:"~10 TB/s",frac:10/30,color:e.teal},{label:"SMEM → RF",value:"~30 TB/s agg.",frac:1,color:e.ok}].forEach((u,r)=>{const c=386+r*18;t(34,c+8,u.label,{size:8,fill:e.dim}),i.appendChild(n("rect",{x:150,y:c,width:290,height:8,rx:4,fill:e.panel2,stroke:e.line})),i.appendChild(n("rect",{x:150,y:c,width:Math.max(2,290*u.frac),height:8,rx:4,fill:u.color,"fill-opacity":.85})),t(455,c+8,u.value,{size:8,fill:u.color,mono:!0})}),t(34,438,"TB/s, approximate; compute FLOP/s is a separate axis",{size:7.5,fill:e.dim}),i.appendChild(n("rect",{x:20,y:462,width:680,height:70,rx:9,fill:e.panel,"fill-opacity":.5,stroke:e.teal,"stroke-opacity":.45})),t(34,482,"Unified memory · the case",{size:10.5,weight:700,fill:e.teal}),t(34,500,"CPU and accelerator share one address space; no explicit H2D/D2H copies",{size:8.5,fill:e.fg}),t(34,516,"still HBM-bound; coherence and capacity are the trade-offs",{size:8.5,fill:e.warn}),$(i,20,548,90,o?"✓ GPU":"GPU",()=>{Z="gpu",H(0)}),$(i,118,548,90,s?"✓ TPU":"TPU",()=>{Z="tpu",H(0)}),t(220,566,"toggle target: architectures and scheduling differ",{size:8.5,fill:e.dim})}function fe(){X!==null&&(window.clearTimeout(X),X=null),ie=!1}function Qe(){if(ie){fe(),H(2);return}B>=4&&(B=0),ie=!0;const i=()=>{if(ie){if(B>=4){ie=!1,X=null,H(2);return}B+=1,H(2),X=window.setTimeout(i,950)}};X=window.setTimeout(i,500),H(2)}function Ve(){fe(),B=B>=4?0:B+1,H(2)}function Ue(){fe(),B=0,H(2)}function He(i){const o={total:61.3,steps:[{label:"QKᵀ",cpu:[.46,6.06],gpu:[5.86,15.61],kind:"tensor",kernel:"turing_fp16_s1688gemm",read:"Q, K",write:"S",readBytes:"32 MiB",writeBytes:"1 GiB",color:e.ok},{label:"scale/mask",cpu:[6.16,6.34],gpu:[15.61,24.38],kind:"vector",kernel:"vectorized_elementwise",read:"S",write:"S",readBytes:"1 GiB",writeBytes:"1 GiB",color:e.warn},{label:"softmax",cpu:[6.36,10.33],gpu:[24.38,54.11],kind:"vector",kernel:"cunn_SoftMaxForward",read:"S",write:"P",readBytes:"1 GiB",writeBytes:"1 GiB",color:e.warn},{label:"PV",cpu:[10.35,10.6],gpu:[54.11,61.25],kind:"tensor",kernel:"turing_fp16_s1688gemm",read:"P, V",write:"O",readBytes:"1.01 GiB",writeBytes:"16 MiB",color:e.ok}]},s=150,x=680,h=a=>s+a/o.total*(x-s),u=a=>a/o.total*(x-s),r=a=>B===a+1,c=a=>B>a+1,m=(a,M,O,T,W,b,L=18)=>{i.appendChild(n("rect",{x:a,y:M,width:Math.max(2,O),height:L,rx:3,fill:T,"fill-opacity":b?.28:.07,stroke:T,"stroke-opacity":b?.95:.22})),O>36&&t(a+5,M+L-5,W,{size:6.5,fill:b?T:e.dim,mono:!0})};t(20,24,"naive attention · real trace",{size:11,weight:700,fill:e.fg}),t(20,42,"Tesla T4 · torch 2.11.0+cu130 · B=4 H=8 N=4096 D=64 · FP16",{size:8,fill:e.dim}),t(688,24,"wall 61.3 ms · GPU active 55.4 ms",{size:8,fill:e.dim,anchor:"end"}),t(688,42,"peak 2.22 GB",{size:8,fill:e.warn,anchor:"end"}),t(20,70,"CPU",{size:8.5,weight:700,fill:e.dim}),o.steps.forEach((a,M)=>{const O=r(M)||c(M);m(h(a.cpu[0]),56,u(a.cpu[1]-a.cpu[0]),e.dim,a.label,O,14)}),i.appendChild(n("rect",{x:h(10.68),y:74,width:u(61.27-10.68),height:6,rx:3,fill:e.panel2,stroke:e.line})),t(h(10.68)+4,90,"CPU waits on GPU",{size:7,fill:e.dim}),t(20,116,"GPU stream",{size:8.5,weight:700,fill:e.dim}),o.steps.forEach((a,M)=>{const O=r(M)||c(M);m(h(a.gpu[0]),102,u(a.gpu[1]-a.gpu[0]),a.color,a.label+" "+(a.gpu[1]-a.gpu[0]).toFixed(1)+" ms",O)}),t(h(0)+4,134,"idle / launch",{size:6.5,fill:e.bad}),t(20,160,"HBM traffic",{size:8.5,weight:700,fill:e.dim}),o.steps.forEach((a,M)=>{const O=r(M)||c(M),T=h(a.gpu[0]),W=u(a.gpu[1]-a.gpu[0]);m(T,146,W,a.kind==="tensor"?e.ok:e.warn,"read "+a.read,O,10),m(T,158,W,e.bad,"write "+a.write,O,10)}),t(20,190,"compute active",{size:8.5,weight:700,fill:e.dim}),o.steps.forEach((a,M)=>{const O=r(M)||c(M);m(h(a.gpu[0]),176,u(a.gpu[1]-a.gpu[0]),a.kind==="tensor"?e.ok:e.warn,a.kind,O,10)}),t(20,224,"HBM buffers",{size:8.5,weight:700,fill:e.dim});const d=(a,M,O,T,W,b)=>{i.appendChild(n("rect",{x:a,y:234,width:M,height:26,rx:5,fill:T?W:e.panel2,"fill-opacity":T?.18:.45,stroke:T?W:e.line})),t(a+6,251,O,{size:8.5,fill:T?e.fg:e.dim,mono:!0}),t(a+M-6,251,b,{size:6.5,fill:T?W:e.dim,anchor:"end",mono:!0})};d(150,42,"Q",!0,e.accent,"16 MiB"),d(198,42,"K",!0,e.accent,"16 MiB"),d(246,42,"V",!0,e.accent,"16 MiB"),d(294,88,"S",B>=1,e.bad,"1 GiB"),d(388,88,"P",B>=3,e.purple,"1 GiB"),d(482,44,"O",B>=4,e.ok,"16 MiB"),t(540,251,B>=3?"peak: S + P":"S/P not yet live",{size:7.5,fill:e.bad});const p=B>0?o.steps[B-1]:null;i.appendChild(n("rect",{x:20,y:280,width:680,height:96,rx:9,fill:e.panel,"fill-opacity":.55,stroke:p?p.color:e.line,"stroke-opacity":.55})),p?(t(34,302,p.label+" · "+(p.gpu[1]-p.gpu[0]).toFixed(2)+" ms GPU",{size:10.5,weight:700,fill:p.color}),t(34,320,"kernel: "+p.kernel,{size:8,fill:e.fg,mono:!0}),t(34,338,"HBM: read "+p.readBytes+" · write "+p.writeBytes,{size:8.5,fill:e.fg}),t(34,356,"buffers: "+(B>=3?"S and P live":B>=1?"S live":"Q/K/V live"),{size:8.5,fill:e.warn})):(t(34,302,"baseline · Q/K/V resident in HBM",{size:10,weight:700,fill:e.accent}),t(34,320,"Press Play or Step to advance through the captured trace.",{size:8.5,fill:e.fg}),t(34,338,"CPU launches; GPU work is serialized on one stream.",{size:8.5,fill:e.dim})),t(20,398,"CPU enqueues all four kernels by 10.6 ms; the GPU spends 55.4 ms executing.",{size:8,fill:e.dim}),t(20,414,"HBM bytes are derived from tensor shapes; timing comes from the captured T4 profile.",{size:8,fill:e.dim});const z=B>0?h(o.steps[B-1].gpu[1]):h(0);i.appendChild(n("line",{x1:z,y1:50,x2:z,y2:270,stroke:e.accent,"stroke-opacity":.7,"stroke-dasharray":"3 3"})),$(i,20,500,100,ie?"⏸ Pause":"▶ Play",()=>{Qe()}),$(i,130,500,90,"▶ Step",()=>{Ve()}),$(i,230,500,90,"↺ Reset",()=>{Ue()}),t(340,518,"step "+B+" / 4",{size:9.5,fill:e.dim,mono:!0})}function Ie(i){const h=m=>150+m/27.1*530,u=m=>m/27.1*530,r=(m,d,p,z,a,M=16)=>{i.appendChild(n("rect",{x:m,y:d,width:p,height:M,rx:3,fill:z,"fill-opacity":.24,stroke:z,"stroke-opacity":.85})),t(m+5,d+M-5,a,{size:6.5,fill:z,mono:!0})};t(20,24,"fused attention · real trace",{size:11,weight:700,fill:e.fg}),t(20,42,"Tesla T4 · torch 2.11.0+cu130 · B=4 H=8 N=4096 D=64 · FP16",{size:8,fill:e.dim}),t(688,24,"18.9 ms GPU · 64 MiB peak",{size:8,fill:e.teal,anchor:"end"}),t(688,42,"1 kernel · no S/P",{size:8,fill:e.fg,anchor:"end"}),t(20,70,"CPU",{size:8.5,weight:700,fill:e.dim}),r(h(0),56,u(8.41),e.dim,"launch / setup",14),i.appendChild(n("rect",{x:h(8.52),y:74,width:u(18.6),height:6,rx:3,fill:e.panel2,stroke:e.line})),t(h(8.52)+4,90,"CPU waits on GPU",{size:7,fill:e.dim}),t(20,118,"GPU stream",{size:8.5,weight:700,fill:e.dim}),r(h(8.21),104,u(18.9),e.teal,"fused SDPA · 18.9 ms",20),t(h(8.21)+4,138,"one kernel",{size:6.5,fill:e.dim}),t(20,160,"HBM traffic",{size:8.5,weight:700,fill:e.dim}),r(h(8.21),146,u(18.9),e.accent,"read Q/K/V · 48 MiB",10),r(h(8.21),158,u(18.9),e.bad,"write O · 16 MiB",10),t(20,190,"compute active",{size:8.5,weight:700,fill:e.dim}),r(h(8.21),176,u(18.9),e.teal,"1 fused kernel",10),t(20,218,"HBM buffers",{size:8.5,weight:700,fill:e.dim});const c=(m,d,p,z,a,M=!1)=>{i.appendChild(n("rect",{x:m,y:228,width:d,height:26,rx:5,fill:M?"none":a,"fill-opacity":.16,stroke:a,"stroke-opacity":.7,"stroke-dasharray":M?"4 3":"0"})),t(m+6,245,p,{size:8.5,fill:M?e.dim:e.fg,mono:!0}),t(m+d-6,245,z,{size:6.5,fill:a,anchor:"end",mono:!0})};c(150,42,"Q","16 MiB",e.accent),c(198,42,"K","16 MiB",e.accent),c(246,42,"V","16 MiB",e.accent),c(294,110,"S / P","not materialized",e.bad,!0),c(410,44,"O","16 MiB",e.ok),i.appendChild(n("rect",{x:20,y:274,width:680,height:112,rx:9,fill:e.panel,"fill-opacity":.55,stroke:e.teal,"stroke-opacity":.5})),t(34,296,"what the fused kernel buys",{size:10.5,weight:700,fill:e.teal}),t(34,314,"naive: 55.4 ms GPU · 2.22 GB peak · ~6.1 GiB HBM traffic",{size:8.5,fill:e.dim}),t(34,332,"fused: 18.9 ms GPU · 64 MiB peak · ~64 MiB HBM traffic",{size:8.5,fill:e.fg}),t(34,350,"2.9× less GPU time · 34× lower peak · ~97× less traffic",{size:9,weight:700,fill:e.ok}),t(34,368,"PyTorch efficient attention on SM75 — not FlashAttention; true FA needs SM80+.",{size:8,fill:e.warn}),t(20,412,"The full N×N scores and probabilities never exist; the kernel keeps tiles on chip.",{size:8,fill:e.dim})}function ue(){V!==null&&(window.cancelAnimationFrame(V),V=null),C=!1}function ge(i){if(V=null,!C)return;const o=Math.min(.05,(i-re)/1e3);re=i,G=Math.min(1,G+o/pe.seconds(pe.stepSeconds)),G>=1&&(G=1,k>=3&&(J[Q]=!0),he?(he=!1,C=!1):k<3?(k+=1,G=0):(J[Q]=!0,Q<3?(Q+=1,k=1,G=0):C=!1)),H(4),C&&(de===null||me.has(4))&&(V=window.requestAnimationFrame(ge))}function Ge(){if(C){ue(),H(4);return}k>=3&&Q>=3&&(Q=0,J.fill(!1),k=0),k===0&&(k=1),G=0,he=!1,C=!0,re=performance.now(),V=window.requestAnimationFrame(ge),H(4)}function je(){ue(),k>=3?(J[Q]=!0,Q<3?(Q+=1,k=1):(Q=0,J.fill(!1),k=0)):k===0?k=1:k+=1,G=0,he=!0,C=!0,re=performance.now(),V=window.requestAnimationFrame(ge),H(4)}function Re(i){const o=[[-.68,-1.14,.34],[.12,-.4,.8],[.2,-.1,.45],[-.3,.1,.05]],s=nt.slice(0,3),x=Q,h=o[x],u=A=>{let v=-1/0,q=0;const E=[0,0,0];for(let S=0;S<=A;S++){const F=Math.max(v,h[S]),ee=v===-1/0?0:Math.exp(v-F),se=Math.exp(h[S]-F);q=q*ee+se;for(let te=0;te<3;te++)E[te]=E[te]*ee+se*s[S][te];v=F}return{m:v,l:q,o:E}},r=u(1),c=u(2),m=Math.exp(h[2]-c.m),d=Math.min(1,Math.max(0,G)),p=pe.ease(d),z=(A,v)=>pe.segment(d,A,v),a=k===2?p:k>=3?1:0,M=k===2?p:k>=3?1:0,O=k>=3?z(.62,1):0,T=78+x*50,W=r.m+(c.m-r.m)*a,b=r.l+(c.l-r.l)*a,L=Math.min(...h),P=Math.max(...h),N=(A,v,q,E,S=1,F=40,ee=20)=>{S<=.02||(i.appendChild(n("rect",{x:A-F/2,y:v-ee/2,width:F,height:ee,rx:5,fill:E,"fill-opacity":.1+.16*S,stroke:E,"stroke-opacity":.7*S})),t(A,v+3.5,q,{anchor:"middle",size:7.2,fill:E,mono:!0}))},y=A=>k===A;t(20,24,"one new K/V · online softmax in three steps",{size:10.5,weight:700,fill:e.fg}),t(20,42,"Q·K → s  ·  s + (m, ℓ) → p  ·  p, ℓ, V → O",{size:8,fill:e.dim});for(let A=0;A<4;A++){const v=A===x,q=J[A],E=v||q,S=78+A*50;i.appendChild(n("rect",{x:30,y:S,width:70,height:30,rx:6,fill:v?e.accent:e.panel2,"fill-opacity":v?.18:.5,stroke:v?e.accent:e.line,"stroke-width":v?1.6:1})),t(65,S+19,"Q"+A,{anchor:"middle",size:10,weight:700,fill:E?e.fg:e.dim,mono:!0});const F=q?1:v?O:0;i.appendChild(n("rect",{x:590,y:S,width:100,height:30,rx:6,fill:F>0?e.purple:e.panel2,"fill-opacity":F>0?.12+.22*F:.5,stroke:F>0?e.purple:e.line,"stroke-width":v?1.5:1})),t(640,S+19,q?"O ✓":"O",{anchor:"middle",size:10,weight:700,fill:F>0?e.fg:e.dim,mono:!0})}if(t(30,267,"Q loop",{size:7.5,fill:e.dim}),t(590,267,"one O per Q",{size:7.5,fill:e.dim}),i.appendChild(n("rect",{x:350,y:62,width:90,height:30,rx:6,fill:e.ok,"fill-opacity":k>=1?.22:.12,stroke:e.ok})),t(395,81,"K new",{anchor:"middle",size:10,weight:700,fill:e.fg,mono:!0}),i.appendChild(n("rect",{x:350,y:382,width:90,height:30,rx:6,fill:e.purple,"fill-opacity":.18,stroke:e.purple})),t(395,401,"V new",{anchor:"middle",size:10,weight:700,fill:e.fg,mono:!0}),k===1){const A=Math.max(0,1-(d-.7)/.2),v={x:65,y:T+15},q={x:v.x+(395-v.x)*p,y:v.y+(150-v.y)*p};N(q.x,q.y,"Q",e.accent,A,30,18);const E={x:395,y:85+60*p};if(N(E.x,E.y,"K",e.ok,A,30,18),d>.55){const S=Math.min(1,(d-.55)/.3);i.appendChild(n("circle",{cx:395,cy:150,r:7+18*S,fill:"none",stroke:e.warn,"stroke-opacity":.55*(1-S)}))}d>.45&&N(395,150,"s",e.warn,Math.min(1,(d-.45)/.3),40,20),d>.45&&t(430,146,"logit",{size:8,fill:e.warn})}i.appendChild(n("rect",{x:20,y:282,width:330,height:108,rx:8,fill:e.panel,"fill-opacity":.5,stroke:e.line})),t(34,300,"state for Q"+x,{size:8.5,weight:700,fill:e.dim}),t(34,325,"m",{size:8.5,fill:e.accent,mono:!0}),t(50,325,"running max",{size:7.5,fill:e.dim}),i.appendChild(n("rect",{x:96,y:316,width:210,height:8,rx:4,fill:e.panel2,stroke:e.line}));const I=96+210*(P===L?1:(W-L)/(P-L));i.appendChild(n("circle",{cx:I,cy:320,r:4,fill:e.accent}));const j=a>.02;if(t(236,328,r.m.toFixed(2),{anchor:"end",size:7.5,fill:e.dim,mono:!0}),t(244,328,"→",{anchor:"middle",size:7.5,fill:e.dim}),t(332,328,c.m.toFixed(2),{anchor:"end",size:8,fill:j?e.accent:e.dim,mono:!0}),t(34,353,"ℓ",{size:8.5,fill:e.teal,mono:!0}),t(50,353,"running denominator",{size:7.5,fill:e.dim}),i.appendChild(n("rect",{x:96,y:344,width:210,height:8,rx:4,fill:e.panel2,stroke:e.line})),i.appendChild(n("rect",{x:96,y:344,width:Math.max(2,210*(b/Math.max(r.l,c.l))),height:8,rx:4,fill:e.teal,"fill-opacity":.85})),t(236,356,r.l.toFixed(2),{anchor:"end",size:7.5,fill:e.dim,mono:!0}),t(244,356,"→",{anchor:"middle",size:7.5,fill:e.dim}),t(332,356,c.l.toFixed(2),{anchor:"end",size:8,fill:j?e.teal:e.dim,mono:!0}),t(34,381,"p",{size:8.5,fill:e.ok,mono:!0}),t(50,381,"new weight",{size:7.5,fill:e.dim}),i.appendChild(n("rect",{x:96,y:372,width:210,height:8,rx:4,fill:e.panel2,stroke:e.line})),i.appendChild(n("rect",{x:96,y:372,width:Math.max(2,210*m*M),height:8,rx:4,fill:e.ok,"fill-opacity":.85})),t(332,384,M>.05?m.toFixed(2):"—",{anchor:"end",size:8,fill:e.ok,mono:!0}),k===2){const A=395+-95*p,v=150+156*p;N(A,v,"s",e.warn,1-.75*p,40);const q=z(.4,.95);if(q>0&&q<1){const S=96+210*(b/Math.max(r.l,c.l));i.appendChild(n("circle",{cx:300+(I-300)*q,cy:306+14*q,r:3.5,fill:e.accent,"fill-opacity":.9})),i.appendChild(n("circle",{cx:300+(S-300)*q,cy:306+42*q,r:3.5,fill:e.teal,"fill-opacity":.9}))}const E=1-Math.abs(.5-Math.min(1,d))*2;d<1&&(i.appendChild(n("circle",{cx:I,cy:320,r:3+4*E,fill:"none",stroke:e.accent,"stroke-opacity":.35+.3*E})),i.appendChild(n("circle",{cx:332,cy:356,r:3+4*E,fill:"none",stroke:e.teal,"stroke-opacity":.35+.3*E}))),d>.5&&N(320,381,"p",e.ok,Math.min(1,(d-.5)/.25),24,18)}if(k===3){const A={x:640,y:T+15},v={x:340,y:381},q={x:340,y:353},E={x:395,y:397},S=z(.02,.62),F=z(.1,.7),ee=z(.38,.94),se=(oe,_e)=>{i.appendChild(n("line",{x1:oe.x,y1:oe.y,x2:A.x,y2:A.y,stroke:_e,"stroke-opacity":.16,"stroke-dasharray":"3 4"}))};se(v,e.ok),se(q,e.teal),se(E,e.purple);const te=(oe,_e)=>({x:oe.x+(A.x-oe.x)*_e,y:oe.y+(A.y-oe.y)*_e}),Be=te(v,S),Ce=te(q,ee),Te=te(E,F);N(Be.x,Be.y,"p",e.ok,1-S*S*S,22,18),N(Ce.x,Ce.y,"ℓ",e.teal,1-ee*ee*ee,22,18),N(Te.x,Te.y,"V",e.purple,1-F*F*F,22,18)}i.appendChild(n("rect",{x:20,y:430,width:330,height:166,rx:8,fill:e.panel,"fill-opacity":.5,stroke:e.line})),t(34,448,"what the letters mean",{size:8.5,weight:700,fill:e.dim}),t(34,470,"m · running max",{size:8.5,weight:700,fill:e.accent}),t(34,484,"the largest logit seen so far",{size:8,fill:e.dim}),t(34,496,"subtracting it keeps exp() finite",{size:8,fill:e.dim}),t(34,516,"ℓ · running denominator",{size:8.5,weight:700,fill:e.teal}),t(34,530,"sum of exp(s − m) over all K/V so far",{size:8,fill:e.dim}),t(34,542,"the divisor that normalizes O at the end",{size:8,fill:e.dim}),t(34,562,"p · new weight",{size:8.5,weight:700,fill:e.ok}),t(34,576,"exp(sₙ − mₙ) for the new K/V",{size:8,fill:e.dim}),t(34,588,"p/ℓ is its final softmax probability",{size:8,fill:e.dim}),i.appendChild(n("rect",{x:358,y:430,width:342,height:166,rx:8,fill:e.panel,"fill-opacity":.5,stroke:e.line})),t(370,448,"update formulas",{size:8.5,weight:700,fill:e.dim}),y(1)&&i.appendChild(n("rect",{x:362,y:456,width:334,height:22,rx:5,fill:e.accent,"fill-opacity":.08})),t(370,472,"1",{size:8,fill:y(1)?e.accent:e.dim,mono:!0}),t(386,472,"sₙ = q · kₙ / √d",{size:9,fill:y(1)?e.fg:e.dim,mono:!0}),y(2)&&i.appendChild(n("rect",{x:362,y:482,width:334,height:54,rx:5,fill:e.accent,"fill-opacity":.08})),t(370,498,"2",{size:8,fill:y(2)?e.accent:e.dim,mono:!0}),t(386,498,"mₙ = max(mₒ, sₙ)",{size:9,fill:y(2)?e.fg:e.dim,mono:!0}),t(386,514,"p = exp(sₙ − mₙ)",{size:9,fill:y(2)?e.fg:e.dim,mono:!0}),t(386,530,"ℓₙ = exp(mₒ − mₙ) · ℓₒ + p",{size:9,fill:y(2)?e.fg:e.dim,mono:!0}),y(3)&&i.appendChild(n("rect",{x:362,y:540,width:334,height:26,rx:5,fill:e.accent,"fill-opacity":.08})),t(370,558,"3",{size:8,fill:y(3)?e.accent:e.dim,mono:!0}),t(386,558,"Oₙ = (exp(mₒ − mₙ) · Oₒ + p · Vₙ) / ℓₙ",{size:8.8,fill:y(3)?e.fg:e.dim,mono:!0}),t(370,578,"p is unnormalized; the division by ℓ is the last operation.",{size:7.5,fill:e.dim});const le=["Press Step or Run. m, ℓ and O carry over from one key/value tile to the next.","1 · Form the new logit: sₙ = q · kₙ / √d.","2 · Update m and ℓ, then form p = exp(sₙ − mₙ).","3 · p·V accumulates into O; ℓ is the divisor that normalizes it."][k];t(20,650,le,{size:9.5,fill:e.fg}),$(i,20,606,82,"▶ Step",()=>{je()}),$(i,110,606,100,C?"⏸ Pause":"▶ Run",()=>{Ge()}),$(i,218,606,82,"↺ Reset",()=>{ue(),Q=0,J.fill(!1),k=0,G=0,H(4)}),t(318,622,"Q "+(x+1)+" / 4 · step "+k+" / 3",{size:9.2,fill:e.dim,mono:!0})}function Xe(i){i.appendChild(be("arw-k",e.dim));const o=[{v:"v1",year:"2022",hw:"A100 · SM80",note:"IO-aware tiling"},{v:"v2",year:"2023",hw:"A100 / H100",note:"work partitioning"},{v:"v3",year:"2024",hw:"H100 · SM90",note:"TMA · WGMMA · FP8"},{v:"v4",year:"2025",hw:"B200 · SM100",note:"tcgen05 · TMEM"}],s=[e.dim,e.teal,e.accent,e.ok],x=150,h=24,u=20,r=34;o.forEach((c,m)=>{const d=u+m*(x+h);i.appendChild(n("rect",{x:d,y:r,width:x,height:84,rx:8,fill:e.panel,"fill-opacity":.6,stroke:s[m],"stroke-opacity":.8})),t(d+12,r+24,c.v,{size:14,weight:700,fill:s[m],mono:!0}),t(d+44,r+23,c.year,{size:8.5,fill:e.dim,mono:!0}),t(d+12,r+47,c.hw,{size:8,fill:e.fg,mono:!0}),t(d+12,r+65,c.note,{size:8,fill:e.dim}),m<o.length-1&&Y(i,d+x+3,r+42,d+x+h-3,r+42,e.dim,"arw-k")}),t(20,142,"same math · one forward pass · the schedule moves between units",{size:8.5,fill:e.dim})}return Oe(),{destroy(){de?.disconnect(),ne(),fe(),ue()}}};export{rt as default};
