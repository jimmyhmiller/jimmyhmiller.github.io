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
    tagline: "Dynamic, mostly-functional, compiles straight to machine code. (pre-alpha)",
    repo: "https://github.com/jimmyhmiller/beagle",
    bg: "#1a0e0a", fg: "#f0d8c0", accent: "#fb923c",
    kind: "code+arch",
    blurb: "Beagle is my programming language I've been working on for a while now. It is slowly approaching a stage I'm proud of. The code snippet on the right might seem unremarkable, but those socket/read calls don't block. Concurrency in this language is fully controllable, yet there is no function coloring.",
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
        { label: "Algebraic effects",            body: "Built-in algebraic effects make it easy to control and test IO." },
        { label: "Live coding",                  body: "Redefine functions, structs, and enums while your code is running." },
        { label: "Async without function coloring", body: "Delimited continuations give you transparent asynchrony." },
        { label: "Compiled",                     body: "No VM, no bytecode, straight to machine code." },
      ],
    },
    layout: "wide",
  },
  {
    id: "tensor-lang",
    title: "tensor-lang",
    tagline: "From-scratch tensor compiler: one DSL, three backends, enough to run gpt2.",
    bg: "#0d1410", fg: "#dfe8d8", accent: "#a3e635",
    kind: "code+table",
    blurb: "I wanted to see how hard it would be to write a from-scratch DSL for GPT-2. I targeted only as much support as nanoGPT. Along the way I was able to get GPT-2 working. I learned more about the kinds of optimizations that apply to neural network workloads. And I was able to train some models and build a visualizer for the inner workings of simple ones. There will definitely be a write-up about how all this works at some point.",
    code: {
      lang: "tensor",
      filename: "examples/gpt2.tensor",
      source: `fn layernorm(x, gamma, beta) {
    let mean = mul(sum(x, axis: 2), inv_d)
    let xc = sub(x, mean)
    let var = mul(sum(mul(xc, xc), axis: 2), inv_d)
    let std = sqrt(add(var, 0.00001))
    let normed = mul(xc, recip(std))
    add(mul(normed, gamma), beta)
}

fn clamp(x, lo, hi) {
    // clamp(x, lo, hi) = max(min(x, hi), lo)
    // min(a, b) = neg(max(neg(a), neg(b)))
    let upper = neg(max(neg(x), neg(hi)))
    max(upper, lo)
}

fn gelu(x) {
    let x3 = mul(mul(x, x), x)
    let inner = mul(0.7978845608028654, add(x, mul(0.044715, x3)))
    // Clamp for numerically stable tanh (tanh(10) ≈ 1.0)
    let clamped = clamp(inner, neg(10.0), 10.0)
    let z2 = mul(clamped, 2.0)
    let ez2 = exp(z2)
    let tanh_val = mul(sub(ez2, 1.0), recip(add(ez2, 1.0)))
    mul(mul(0.5, x), add(1.0, tanh_val))
}

fn linear(x, w, b) {
    add(matmul(x, w), b)
}

fn softmax_attn(x) {
    let m = max(x, axis: 3)
    let e = exp(sub(x, m))
    let s = sum(e, axis: 3)
    mul(recip(s), e)
}`,
    },
    table: {
      caption: "GPT-2 124M · 12 layers · T=16 · single-threaded · Apple Silicon",
      note: "Some of the numbers above are fudged a bit because I didn't feel like getting exact numbers, the final numbers are real.",
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
    tagline: "Building a visualizer is an amazing way to learn a codebase.",
    bg: "#0a0d14", fg: "#dde7f5", accent: "#22d3ee",
    kind: "video",
    video: "/images/turbopack-visualizer.mp4",
    blurb: "Check out the blog post below for full details. But this was a fun weekend project where I was able to build a stepping debugger for turbopack. One thing this definitely made me want to work on in the future is a more generic setup for all tokio apps. I tried the tokio console and found it very not useful for the kinds of things I wanted to understand. But there must be something there.",
    writeup: "/learn-codebase-visualizer",
    layout: "wide",
  },
  {
    id: "simd-lang",
    title: "simd-lang",
    tagline: "A language that makes it easy to write succinct SIMD code.",
    bg: "#0a0e1a", fg: "#dde7f5", accent: "#7fd1ff",
    kind: "code",
    blurb: "I've been wanting to understand SIMD for a while and really see how much performance you can get with it. But I also find the code to write simd rather confusing. I was curious if you could write something much cleaner and get the performance difference expected. Here I was able to use MLIR and make a language that can implement SIMD JSON and get within 75% of the actual library, with way less code (simplified below).",
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
    title: "live-whiteboard",
    tagline: "A whiteboard that comes to life.",
    bg: "#1a1410", fg: "#ece1cc", accent: "#fb923c",
    kind: "image",
    image: "/images/whiteboard.png",
    imageCaption: "This is a simple silly system, but I'm currently working on much more complicated custom gadgets including a fun game of life stress test.",
    blurb: "This is something I've been wanting to build for a long time and I'm finally starting to make progress on it. As software engineers we love to sketch a system on the whiteboard, but once we're done we have to play computer in our head. The goal of this project is to eliminate the need to do this. Expect a write-up soon on some of the tricky design aspects I'm still wrestling with.",
    layout: "wide",
  },
  {
    id: "datalog-db",
    title: "datalog-db",
    tagline: "A user-friendly Datalog database.",
    bg: "#0e0f1a", fg: "#dfe2f5", accent: "#a78bfa",
    kind: "code",
    blurb: "I'm working on building a database that works the way I always felt they should. For me this meant three things: a more expressive query language, algebraic data types, and datomic-inspired time travel. Right now it is just a toy, but I have some plans to make real use of it and push to be a bit more production ready.",
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
    tagline: "Like dtach, but with a friendlier CLI.",
    repo: "https://github.com/jimmyhmiller/keep-running",
    bg: "#0d1517", fg: "#dfe8e4", accent: "#0d7d3d",
    kind: "terminal",
    blurb: "Keep Running came out of me always wanting to run things on my framework desktop but being annoyed with tools like tmux for messing with scroll. I tried stuff like dtach but found it annoying. So I figured why not make something exactly the way I wanted it.",
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
