// Project metadata for the showcase page + index Projects section.
// Edit freely — `kind` controls which artifact treatment renders.
//
// kinds:
//   "code"        — syntax-highlighted code block
//   "code+table"  — code + perf table
//   "code+arch"   — code + architecture list
//   "terminal"    — CLI mock
//   "image"       — full-bleed screenshot
//   "image-phone" — phone-shaped screenshot
//   "video"       — looping video clip
//
// layouts: "wide" | "narrow" | "split" | "code-right" | "code-left"

export const projects = [
  {
    id: "beagle",
    title: "beagle",
    tagline: "Dynamic, mostly-functional, compiles straight to machine code.",
    year: "2025",
    role: "solo",
    stack: ["rust", "x86-64 asm", "arm64 asm"],
    repo: "https://github.com/jimmyhmiller/beagle",
    bg: "#1a0e0a", fg: "#f0d8c0", accent: "#fb923c",
    kind: "code+arch",
    blurb: "No VM, no bytecode, no JIT warm-up. Algebraic effects in a dynamic language, plus continuation-multiplexed I/O — socket/read looks blocking but suspends the continuation and resumes when the kernel has bytes. Open three nc sessions, all concurrent, on a single thread.",
    code: {
      lang: "beagle",
      filename: "examples/echo_server.bg",
      source: `use beagle.socket as socket

fn main() {
    let listener = socket/listen("0.0.0.0", 8080)
    println("Echo server listening on port 8080")

    socket/on-connection(listener, fn(conn) {
        loop {
            let data = socket/read(conn, 4096)
            if data == "" || data == null {
                socket/close(conn)
                break(null)
            } else {
                socket/write(conn, data)
            }
        }
    })
}`,
    },
    arch: {
      title: "Two snippets, one runtime",
      items: [
        { label: "Algebraic effects", body: "Perform/handle with resume — same language as the host, dynamic dispatch." },
        { label: "Continuations",     body: "The kernel suspends on I/O; the runtime parks the frame and resumes on readiness." },
        { label: "No async syntax",   body: "The function looks synchronous; concurrency falls out of the runtime." },
        { label: "Compiled",          body: "No VM, no bytecode — direct machine code via a register allocator and small backends." },
      ],
    },
    layout: "wide",
  },
  {
    id: "tensor-lang",
    title: "tensor-lang",
    tagline: "From-scratch tensor compiler — one DSL, three backends, real models.",
    year: "2026",
    role: "solo",
    stack: ["rust", "arm64 asm", "wasm", "wgpu"],
    repo: "https://github.com/jimmyhmiller/PlayGround/tree/master/claude-experiments/nano-gpt-ideas",
    bg: "#0d1410", fg: "#dfe8d8", accent: "#a3e635",
    kind: "code+table",
    blurb: "Write the model once in tensor-lang — a compact functional notation with symbolic dimensions — and compile it to native ARM, WASM, or wgpu compute shaders. The whole GPT-2 forward pass is ~80 lines. Autodiff on the graph IR plus a numerical gradient-check oracle, so it trains models from scratch — the headline example is a music model: MIDI → tokens → train → sample. A separate visualizer renders every tensor in the model live (weights, activations, gradients, loss) as training ticks.",
    code: {
      lang: "tensor",
      filename: "examples/gpt2.tl — the layernorm",
      source: `fn layernorm(x, gamma, beta) {
    let mean   = mul(sum(x, axis: 2), inv_d)
    let xc     = sub(x, mean)
    let var    = mul(sum(mul(xc, xc), axis: 2), inv_d)
    let std    = sqrt(add(var, 0.00001))
    let normed = mul(xc, recip(std))
    add(mul(normed, gamma), beta)
}

// the unlock: ~95% of time was in index math (SDIV).
// before:
for oi in 0..total_size {
    d0   = (oi / stride[0]) % shape[0]   // SDIV: 12-20 cycles
    d1   = (oi / stride[1]) % shape[1]   // SDIV: 12-20 cycles
    addr = d0 * input_stride_0 + d1 * input_stride_1
}
// after: nested loops. address falls out of the counters.
for d0 in 0..shape[0] {
    for d1 in 0..shape[1] {
        addr = d0 * input_stride_0 + d1 * input_stride_1
    }
}`,
    },
    table: {
      caption: "GPT-2 124M · 12 layers · T=16 · single-threaded · Apple Silicon",
      headers: ["pass", "time", "speedup"],
      rows: [
        ["baseline (old ARM backend)",     "3740 ms", "1.00x"],
        ["+ nested loops",                 "3595 ms", "1.04x"],
        ["+ k-invariant hoisting",         "3201 ms", "1.17x"],
        ["+ matmul unfusion + MR=8 kernel","1475 ms", "2.54x"],
        ["+ pointer incrementing",         "1434 ms", "2.61x"],
        ["+ all combined",                 "198 ms",  "18.90x", "highlight"],
        ["llm.c -O3 (reference)",          "84 ms",   "—"],
      ],
    },
    layout: "wide",
  },
  {
    id: "turbopack-visualizer",
    title: "turbopack-visualizer",
    tagline: "Build the debugger before you read the codebase.",
    year: "2025",
    role: "solo · learning project",
    stack: ["rust", "websocket", "react"],
    repo: "https://github.com/jimmyhmiller/PlayGround/tree/master/claude-experiments/visualizer",
    bg: "#0a0d14", fg: "#dde7f5", accent: "#22d3ee",
    kind: "video",
    video: "/images/turbopack-visualizer.mp4",
    blurb: "Turbopack's core is Vc — value cells in an incremental graph. You can read the types, but you can't see why a parse task fanned out into three children. So I built a websocket bridge from the scheduler to a browser visualizer: pause, step forward, watch the graph evolve. The moment it clicked: seeing all the values that didn't recompute on edit.",
    writeup: "/learn-codebase-visualizer",
    layout: "wide",
  },
  {
    id: "simd-lang",
    title: "simd-lang",
    tagline: "A language where every value is a SIMD vector.",
    year: "2026",
    role: "solo",
    stack: ["llvm", "rust", "arm neon", "avx-512"],
    repo: "https://github.com/jimmyhmiller/PlayGround/tree/master/claude-experiments/simd-lang",
    bg: "#0a0e1a", fg: "#dde7f5", accent: "#7fd1ff",
    kind: "code",
    blurb: "Vectorized iteration with cross-iteration state. The stream, over, and carry keywords make SIMD code read like a normal loop. Hits ~73% of simdjson stage-1 throughput on M1 (~3.5 GB/s) and ~76% for full DOM parse (~1.15 GB/s).",
    code: {
      lang: "simd",
      filename: "examples/json_stage1.simd",
      source: `fn json_stage1(input: ptr[u8], positions: ptr[i32]) -> i32[1] {
    stream chunk: u8[64] over input carry (prev_in_string: u64[1] = 0,
                                           pos: i32[1] = 0) {
        quote_vec      = chunk == '"'
        bs_vec         = chunk == '\\\\'
        real_quote_vec = quote_vec & ~lane_shr(bs_vec, 1)

        structural_vec = (chunk == '{') | (chunk == '}') | (chunk == '[')
                       | (chunk == ']') | (chunk == ':') | (chunk == ',')

        quote_bits           = to_bitmask(real_quote_vec)
        in_string_raw        = clmul(quote_bits, ~0)
        in_string_with_carry = in_string_raw ^ prev_in_string

        real_structural_bits = to_bitmask(structural_vec) & ~in_string_with_carry
        real_structural_vec  = from_bitmask(real_structural_bits, 64)

        indices = iota(64) + chunk_offset
        compressstore(positions, pos, indices, real_structural_vec)

        carry prev_in_string = in_string_with_carry >> 63 * ~0
        carry pos            = pos + popcount(real_structural_vec)
    }
    return pos
}`,
    },
    layout: "wide",
  },
  {
    id: "bevy-whiteboard",
    title: "bevy-whiteboard",
    tagline: "The diagram on the whiteboard, but it actually runs.",
    year: "2025",
    role: "solo",
    stack: ["rust", "bevy", "custom .flow DSL"],
    repo: "https://github.com/jimmyhmiller/PlayGround/tree/master/claude-experiments/bevy-whiteboard",
    bg: "#1a1410", fg: "#ece1cc", accent: "#fb923c",
    kind: "image",
    image: "/images/whiteboard.png",
    imageCaption: "Conway's Game of Life running as 9 self-ticking nodes — packets in flight, no global clock.",
    blurb: "A simulation engine where nodes are little programs, edges are delays, and packets flow between them. Pause, rewind, and inspect any packet in flight. Conway's Life is the showcase: every cell is its own self-ticking node — synchronicity falls out of the formalism.",
    layout: "wide",
  },
  {
    id: "datalog-db",
    title: "datalog-db",
    tagline: "A Datomic-shape database with a real surface syntax.",
    year: "2025",
    role: "solo",
    stack: ["rust", "rocksdb", "json wire"],
    repo: "https://github.com/jimmyhmiller/PlayGround/tree/master/claude-experiments/datalog-db",
    bg: "#0e0f1a", fg: "#dfe2f5", accent: "#a78bfa",
    kind: "code",
    blurb: "Built on RocksDB. The wire protocol is JSON, but the REPL has a proper surface syntax — schema, transactions, and queries all in one little language. ?u binds the entity, > 27 is a range pattern, #42 is a ref to entity id 42, and as_of / as_of_time give you point-in-time queries against the immutable history. EAVT/AEVT indexes underneath, with a query planner and executor.",
    code: {
      lang: "datalog",
      filename: "repl session",
      source: `define User {
    name:  string required,
    age:   i64,
    email: string unique indexed,
}

define enum Status {
    Active,
    Suspended { reason: string },
}

assert User { name: "Alice",   age: 30, email: "alice@example.com" }
assert User { name: "Bob",     age: 25, email: "bob@example.com"   }
assert User { name: "Charlie", age: 35, email: "charlie@example.com" }

find ?name, ?age
  where ?u: User { name: ?name, age: > 27 }
  as_of_time "2026-04-30T00:00:00Z"`,
    },
    layout: "code-right",
  },
  {
    id: "keep-running",
    title: "keep-running",
    tagline: "Like dtach, but with a friendlier CLI and a replay buffer.",
    year: "2025",
    role: "solo",
    stack: ["go", "unix sockets", "pty"],
    repo: "https://github.com/jimmyhmiller/keep-running",
    bg: "#0d1517", fg: "#dfe8e4", accent: "#0d7d3d",
    kind: "terminal",
    blurb: "Run a long process, detach, let it keep going, and reattach later from anywhere. A small utility, but the kind of thing you reach for every day once it exists. The daemon owns the PTY and a ring buffer; reattach replays what you missed before going live.",
    terminal: [
      { prompt: "$", cmd: "keep-running run -n build -- cargo build --release" },
      { out: "→ session 'build' started · pid 84219" },
      { out: "→ detach with ctrl-\\ ctrl-\\" },
      { out: "" },
      { prompt: "$", cmd: "keep-running ls" },
      { out: "NAME    PID     STATUS     UPTIME    BUF" },
      { out: "build   84219   running    14m       482 KB" },
      { out: "tests   84402   running     3m        91 KB" },
      { out: "" },
      { prompt: "$", cmd: "keep-running attach build" },
      { out: "→ replaying last 482 KB from buffer..." },
      { out: "    Compiling porter v0.4.1 (/Users/_/code/porter)", muted: true },
      { out: "    Compiling tokio v1.36.0", muted: true },
      { out: "→ live", muted: true },
    ],
    layout: "split",
  },
];

export function findProject(slug) {
  return projects.find((p) => p.id === slug) || null;
}

export function projectSlugs() {
  return projects.map((p) => ({ params: { slug: p.id } }));
}
