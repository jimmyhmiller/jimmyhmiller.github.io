import { Rules4 } from './bridge.js';
import { renderTerm, patch } from './vdom.js';
import {
  allModules as _allModules, assertNum,
} from './viz-modules.js';

const allModules = _allModules.filter(m => m.name !== 'iteration_table');

const { EditorView, basicSetup } = await import('https://esm.sh/codemirror@6.0.1');
const { ViewPlugin, Decoration } = await import('https://esm.sh/@codemirror/view@6');
const { StreamLanguage } = await import('https://esm.sh/@codemirror/language@6');
const { javascript } = await import('https://esm.sh/@codemirror/lang-javascript@6');

// ── rules4 syntax highlighting ──

const rules4Language = StreamLanguage.define({
  name: "rules4",
  startState() { return { inString: false }; },
  token(stream, state) {
    if (state.inString) {
      while (!stream.eol()) {
        if (stream.peek() === '\\') { stream.next(); stream.next(); }
        else if (stream.next() === '"') { state.inString = false; return "string"; }
      }
      return "string";
    }
    if (stream.eatSpace()) return null;
    if (stream.peek() === '#') { stream.skipToEnd(); return "lineComment"; }
    if (stream.peek() === '"') {
      stream.next(); state.inString = true;
      while (!stream.eol()) {
        if (stream.peek() === '\\') { stream.next(); stream.next(); }
        else if (stream.next() === '"') { state.inString = false; return "string"; }
      }
      return "string";
    }
    if (stream.eat('@')) { stream.eatWhile(/[a-zA-Z_0-9]/); return "meta"; }
    if (stream.eat('?')) { stream.eatWhile(/[a-zA-Z_0-9]/); return "variableName.special"; }
    if (stream.match(/^\d+(\.\d+)?/)) return "number";
    if (stream.match("=>")) return "operator";
    if (stream.match("->")) return "operator";
    if (stream.match("==")) return "operator";
    if (stream.match("!=")) return "operator";
    if (stream.match(">=")) return "operator";
    if (stream.match("<=")) return "operator";
    if (stream.eat(/[=+\-*\/<>%]/)) return "operator";
    if (stream.eat(/[()]/)) return "paren";
    if (stream.eat(/[[\]]/)) return "squareBracket";
    if (stream.eat(/[{}]/)) return "brace";
    if (stream.eat(',')) return "separator";
    if (stream.match(/^[a-zA-Z_][a-zA-Z_0-9]*/)) {
      const w = stream.current();
      if (w === "fn" || w === "rule") return "definitionKeyword";
      if (w === "if" || w === "then" || w === "else") return "controlKeyword";
      if (w === "true" || w === "false" || w === "nil") return "atom";
      if (w === "cons" || w === "result") return "keyword";
      return "name";
    }
    stream.next();
    return null;
  },
  languageData: { commentTokens: { line: "#" } },
});

// ── Tangle-style number scrubbing (shared) ──

function findNumberAt(lineText, col) {
  const commentIdx = lineText.indexOf('#');
  const searchEnd = commentIdx >= 0 ? commentIdx : lineText.length;
  const re = /\b(\d+(\.\d+)?)\b/g;
  let m;
  while ((m = re.exec(lineText)) !== null) {
    if (m.index >= searchEnd) break;
    if (col >= m.index && col < m.index + m[0].length) {
      return { text: m[0], start: m.index, end: m.index + m[0].length };
    }
  }
  return null;
}

const tangleNumberMark = Decoration.mark({ class: "cm-tangle-number" });

function buildNumberDecos(view) {
  const ranges = [];
  for (let i = 1; i <= view.state.doc.lines; i++) {
    const line = view.state.doc.line(i);
    const commentIdx = line.text.indexOf('#');
    const searchEnd = commentIdx >= 0 ? commentIdx : line.text.length;
    const re = /\b(\d+(\.\d+)?)\b/g;
    let m;
    while ((m = re.exec(line.text)) !== null) {
      if (m.index >= searchEnd) break;
      ranges.push(tangleNumberMark.range(line.from + m.index, line.from + m.index + m[0].length));
    }
  }
  return Decoration.set(ranges, true);
}

const tangleDecoPlugin = ViewPlugin.fromClass(class {
  constructor(view) { this.decorations = buildNumberDecos(view); }
  update(update) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = buildNumberDecos(update.view);
    }
  }
}, { decorations: v => v.decorations });

let isScrubbing = false;
let dragState = null;

function onDragMove(e) {
  if (!dragState) return;
  const dx = e.clientX - dragState.startX;
  const steps = Math.round(dx / 5);
  let newValue = dragState.startValue + steps * dragState.step;
  let newText;
  if (dragState.precision > 0) newText = newValue.toFixed(dragState.precision);
  else newText = String(Math.round(newValue));
  if (newText === dragState.lastText) return;
  dragState.view.dispatch({
    changes: { from: dragState.from, to: dragState.from + dragState.lastText.length, insert: newText },
  });
  dragState.lastText = newText;
}

function onDragEnd() {
  isScrubbing = false;
  dragState = null;
  document.body.classList.remove('tangle-dragging');
  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('mouseup', onDragEnd);
}

const tangleDragHandlers = EditorView.domEventHandlers({
  mousedown(event, view) {
    const pos = view.posAtCoords({ x: event.clientX, y: event.clientY });
    if (pos === null) return false;
    const line = view.state.doc.lineAt(pos);
    const col = pos - line.from;
    let num = findNumberAt(line.text, col);
    if (!num && col > 0) num = findNumberAt(line.text, col - 1);
    if (!num) num = findNumberAt(line.text, col + 1);
    if (!num) return false;
    event.preventDefault();
    isScrubbing = true;
    document.body.classList.add('tangle-dragging');
    const isFloat = num.text.includes('.');
    dragState = {
      view, startX: event.clientX, startValue: parseFloat(num.text),
      step: isFloat ? 0.1 : 1,
      precision: isFloat ? (num.text.split('.')[1] || '').length : 0,
      from: line.from + num.start, lastText: num.text,
    };
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    return true;
  },
});

function tangleExtension() {
  return [tangleDecoPlugin, tangleDragHandlers];
}

// ── Code constants ──

const VIEW_MARKER = '# === View ===';

function splitCode(code) {
  const idx = code.indexOf(VIEW_MARKER);
  if (idx >= 0) {
    return {
      program: code.substring(0, idx).trimEnd(),
      view: code.substring(idx + VIEW_MARKER.length).trimStart(),
    };
  }
  return { program: code, view: '' };
}

const FIB_CODE = `\
fn fib(0) = 0
fn fib(1) = 1
fn fib(?n) = fib(?n - 1) + fib(?n - 2)

# rule memo : @meta -> @rules {
#   result(?s, fib(?n), ?val) => rule(fib(?n), ?val)
# }

fn fact(0) = 1
fn fact(?n) = ?n * fact(?n - 1)

# === Meta Rules ===
rule tracer : @meta -> @rules {
  reduction(?step, ?old, ?new, fn(?name, ?idx)) =>
    if should_trace(?name) then {
      rule(trace(trace_count), reduced(?old, ?new, fn(?name, ?idx)))
      rule(trace_count, trace_count + 1)
    } else 0
  result(?step, ?call, ?val) => {
    rule(call_result(quote(?call)), ?val)
    rule(trace(trace_count), completed(quote(?call), ?val))
    rule(trace_count, trace_count + 1)
  }
}

# === Harness ===
{
  rule(trace_count, 0)
  rule(should_trace(fib), true)
  rule(should_trace(fact), true)
  rule(result_val, fib(5) + fact(4))
  rule(max_step, trace_count - 1)
}`;

const FIB_VIEW = `\
fn cls(?c) = attr("class", ?c)

fn node_fill(?i) =
  if current_step < node_entry(?i) then "#f0f0f0"
  else if current_step < node_completion(?i) then "#fff3e0"
  else "#e3f2fd"

fn node_stroke(?i) =
  if current_step < node_entry(?i) then "#ddd"
  else if current_step < node_completion(?i) then "#ff9800"
  else "#1976d2"

fn node_text_fill(?i) =
  if current_step < node_entry(?i) then "#bbb"
  else if current_step < node_completion(?i) then "#e65100"
  else "#1565c0"

fn node_label(?i) =
  if current_step >= node_completion(?i) then call_result(node_call(?i))
  else node_call(?i)

fn edge_stroke(?i) =
  if current_step >= node_entry(edge_to(?i)) then "#90caf9" else "#e8e8e8"

fn render_node(?i) = element("g", [], [
  element("circle", [
    attr("cx", node_cx(?i)), attr("cy", node_cy(?i)), attr("r", node_r),
    attr("fill", node_fill(?i)), attr("stroke", node_stroke(?i)),
    attr("stroke-width", 2)
  ], []),
  element("text", [
    attr("x", node_cx(?i)), attr("y", node_cy(?i) + 4),
    attr("text-anchor", "middle"), attr("font-size", 10),
    attr("font-weight", 700), attr("fill", node_text_fill(?i)),
    attr("font-family", "-apple-system, sans-serif")
  ], [text(node_label(?i))])])

fn render_edge(?i) = element("line", [
  attr("x1", node_cx(edge_from(?i))), attr("y1", node_cy(edge_from(?i)) + node_r),
  attr("x2", node_cx(edge_to(?i))),   attr("y2", node_cy(edge_to(?i)) - node_r),
  attr("stroke", edge_stroke(?i)), attr("stroke-width", 2)
], [])

fn render_nodes(?i) =
  if ?i >= node_count then nil
  else cons(render_node(?i), render_nodes(?i + 1))

fn render_edges(?i) =
  if ?i >= edge_count then nil
  else cons(render_edge(?i), render_edges(?i + 1))

fn append(nil, ?ys) = ?ys
fn append(cons(?x, ?xs), ?ys) = cons(?x, append(?xs, ?ys))

fn kind_badge(fn(?name, ?idx)) =
  element("span", [cls("kind-badge fn-badge")], [text(?name)])
fn kind_badge(builtin(?op)) =
  element("span", [cls("kind-badge builtin-badge")], [text(?op)])

fn step_card_for(reduced(?old, ?new, ?kind)) = element("div", [cls("step-card")], [
  element("span", [cls("step-num")], [text("STEP " ++ current_step)]),
  element("span", [cls("step-old")], [text(?old)]),
  element("span", [cls("step-arrow")], [text(" \u2192 ")]),
  element("span", [cls("step-new")], [text(?new)]),
  kind_badge(?kind)])

fn step_card_for(completed(?call, ?val)) = element("div", [cls("step-card")], [
  element("span", [cls("step-num")], [text("STEP " ++ current_step)]),
  element("span", [cls("step-old")], [text(?call)]),
  element("span", [cls("step-arrow")], [text(" = ")]),
  element("span", [cls("step-new result-val")], [text(?val)]),
  element("span", [cls("kind-badge result-badge")], [text("result")])])

fn step_card() = step_card_for(trace(current_step))

fn vt_color(0) = "#1976d2"
fn vt_color(1) = "#e65100"
fn vt_color(2) = "#2e7d32"
fn vt_color(3) = "#7b1fa2"

fn vt_dot_fill(?s, ?j) =
  if current_step >= vt_point_step(?s, ?j) then vt_color(?s) else "#e0e0e0"

fn vt_dot_r(?s, ?j) =
  if current_step >= vt_point_step(?s, ?j) then 5 else 3

fn vt_label_opacity(?s, ?j) =
  if current_step >= vt_point_step(?s, ?j) then 1 else 0

fn vt_render_point(?s, ?j) = element("g", [], [
  element("circle", [
    attr("cx", vt_point_x(?s, ?j)), attr("cy", vt_point_y(?s, ?j)),
    attr("r", vt_dot_r(?s, ?j)),
    attr("fill", vt_dot_fill(?s, ?j))
  ], []),
  element("text", [
    attr("x", vt_point_x(?s, ?j)), attr("y", vt_point_y(?s, ?j) - 8),
    attr("text-anchor", "middle"), attr("font-size", 9),
    attr("fill", vt_dot_fill(?s, ?j)),
    attr("opacity", vt_label_opacity(?s, ?j)),
    attr("font-family", "-apple-system, sans-serif")
  ], [text(vt_point_label(?s, ?j))])])

fn vt_render_points(?s, ?j) =
  if ?j >= vt_point_count(?s) then nil
  else cons(vt_render_point(?s, ?j), vt_render_points(?s, ?j + 1))

fn vt_render_series_label(?s) = element("text", [
  attr("x", 4), attr("y", vt_series_y(?s) + 4),
  attr("font-size", 11), attr("fill", vt_color(?s)),
  attr("font-weight", 700),
  attr("font-family", "-apple-system, sans-serif")
], [text(vt_series_name(?s))])

fn vt_render_series_row(?s) = element("g", [], append(
  cons(vt_render_series_label(?s),
    cons(element("line", [
      attr("x1", 40), attr("y1", vt_series_y(?s)),
      attr("x2", vt_svg_width - 20), attr("y2", vt_series_y(?s)),
      attr("stroke", "#f0f0f0"), attr("stroke-width", 1)
    ], []), nil)),
  vt_render_points(?s, 0)))

fn vt_render_all_series(?s) =
  if ?s >= vt_series_count then nil
  else cons(vt_render_series_row(?s), vt_render_all_series(?s + 1))

fn render_timeline() = element("div", [cls("timeline-container")], [
  element("svg", [
    attr("viewBox", "0 0 " ++ vt_svg_width ++ " " ++ vt_svg_height),
    attr("width", "100%")
  ], vt_render_all_series(0))])

fn render_call_tree() = element("div", [cls("tree-container")], [
  element("div", [cls("legend")], [
    element("span", [], [
      element("span", [cls("legend-dot"), attr("style", "background:#e0e0e0")], []),
      text(" waiting")]),
    element("span", [], [
      element("span", [cls("legend-dot"), attr("style", "background:#ffb74d")], []),
      text(" computing")]),
    element("span", [], [
      element("span", [cls("legend-dot"), attr("style", "background:#42a5f5")], []),
      text(" done")])]),
  element("svg", [
    attr("viewBox", "0 0 " ++ svg_width ++ " " ++ svg_height),
    attr("width", "100%")
  ], append(render_edges(0), render_nodes(0)))])

fn render() = @dom element("div", [], [
  render_call_tree(),
  render_timeline(),
  step_card()])

0`;

const BALL_PROGRAM = `\
# Bouncing ball animation

fn ball_x(?f) = ?f * 9 + 20

fn gravity() = 3

fn ball_vy(0) = 0
fn ball_vy(?f) =
  if ball_y(?f - 1) + ball_vy(?f - 1) + gravity() > 270
  then 0 - ball_vy(?f - 1)
  else ball_vy(?f - 1) + gravity()

fn ball_y(0) = 30
fn ball_y(?f) = ball_y(?f - 1) + ball_vy(?f)

# Drawing
fn draw(?f) = circle(ball_x(?f), ball_y(?f), 15)

fn ball_element() =
  element("circle",
    [attr("cx", ball_x(current_frame)),
     attr("cy", ball_y(current_frame)),
     attr("r", 15),
     attr("fill", "none"),
     attr("stroke", "#222"),
     attr("stroke-width", "2.5")], [])

fn render() = @dom element("svg",
  [attr("viewBox", "0 0 400 300"),
   attr("width", "100%"), attr("height", "100%")],
  cons(ball_element(), nil))

# State
fn init() = rule(current_frame, 0)
fn handle_event(set_frame, ?f) = rule(current_frame, ?f)

init()`;

const BALL_META = `\
# Ghost Trail Meta
# Two meta rules work together:
# 1. trace_draws captures draw() rewrites into @draw
# 2. render_override intercepts render() and replaces
#    its output with the ghost trail when active

rule trace_draws : @meta -> @draw {
  result(?step, draw(?f), ?shape) =>
    pair(ghost(?f), ?shape)
}

rule render_override : @meta -> @dom {
  result(?step, render(), ?val) =>
    if meta_active then
      element("svg",
        [attr("viewBox", "0 0 400 300"),
         attr("width", "100%"), attr("height", "100%")],
        ghost_and_ball(0))
    else ?val
}

# Drive all frames so draw() is evaluated for each
fn run_frames(?f) =
  if ?f >= 40 then 0
  else { draw(?f) run_frames(?f + 1) }

# Destructure circle terms
fn circle_cx(circle(?cx, ?cy, ?r)) = ?cx
fn circle_cy(circle(?cx, ?cy, ?r)) = ?cy
fn circle_r(circle(?cx, ?cy, ?r)) = ?r

# Ghost styling (past vs future)
fn ghost_opacity(?f) =
  if ?f < current_frame then "0.45"
  else "0.25"
fn ghost_stroke(?f) =
  if ?f < current_frame then "#555"
  else "#999"
fn ghost_sw(?f) =
  if ?f < current_frame then "1.2"
  else "0.9"

fn ghost_element(?f) =
  element("circle",
    [attr("cx", circle_cx(ghost(?f))),
     attr("cy", circle_cy(ghost(?f))),
     attr("r", circle_r(ghost(?f))),
     attr("fill", "none"),
     attr("stroke", ghost_stroke(?f)),
     attr("stroke-width", ghost_sw(?f)),
     attr("opacity", ghost_opacity(?f))], [])

# Build children: all ghosts + ball on top
fn ghost_and_ball(40) =
  cons(ball_element(), nil)
fn ghost_and_ball(?f) =
  if ?f == current_frame
  then ghost_and_ball(?f + 1)
  else cons(ghost_element(?f),
            ghost_and_ball(?f + 1))

# Meta state
fn meta_init() = rule(meta_active, false)
meta_init()

# Toggle meta on/off
fn handle_event(apply_meta, ?ev) =
  { run_frames(0) rule(meta_active, true) }
fn handle_event(remove_meta, ?ev) =
  rule(meta_active, false)`;

const FIB_JS_CODE = `\
// Load the Rules4 WASM engine
const r4 = await Rules4.load('./rules4.wasm');

// Parse & evaluate the program rules (fib, fact, tracer)
r4.eval(r4.loadProgram(programCode));

// Read computed values back from the engine
const maxStep = r4.termNum(r4.eval(r4.sym("max_step")));
const result  = r4.display(r4.eval(r4.sym("result_val")));

// Run viz-module analysis (call tree, timeline)
for (const mod of modules) {
  mod.analyze(r4, maxStep, tracedFns);
}

// Load the view code (rendering rules)
r4.eval(r4.loadProgram(viewCode));

// Step through the trace: set current_step, then render
function setStep(s) {
  r4.assertRule(r4.sym("current_step"), r4.num(s));

  // render() writes a vdom tree to the @dom scope
  r4.eval(r4.call(r4.sym("render"), []));
  const pending = r4.scopeTakePending("dom");
  const termId  = pending[pending.length - 1];

  // Patch the real DOM using the vdom diff
  tree = patch(r4, prevTermId, termId, tree, container, () => {});
  prevTermId = termId;
}`;

const BALL_JS_CODE = `\
// Load the Rules4 WASM engine
const r4 = await Rules4.load('./rules4.wasm');

// Parse program; optionally include meta rules
if (metaApplied) {
  r4.eval(r4.loadProgram(programCode + '\\n' + metaCode));
} else {
  r4.eval(r4.loadProgram(programCode));
}

// Set the initial frame and trigger meta if active
r4.eval(r4.call(r4.sym("handle_event"),
  [r4.sym("set_frame"), r4.num(currentFrame)]));

if (metaApplied) {
  r4.eval(r4.call(r4.sym("handle_event"),
    [r4.sym("apply_meta"), r4.num(0)]));
}

// Animation loop — advance frame every 3 ticks
function tick() {
  tickCounter++;
  if (tickCounter % 3 === 0) {
    currentFrame = (currentFrame + 1) % 40;
    r4.eval(r4.call(r4.sym("handle_event"),
      [r4.sym("set_frame"), r4.num(currentFrame)]));
    doRender();
  }
  requestAnimationFrame(tick);
}

// Render: collect @draw scope, then render @dom vdom
function doRender() {
  // Process any draw-scope outputs into rules
  for (const t of r4.scopeTakePending("draw")) {
    r4.assertRule(r4.termCallArg(t, 0), r4.termCallArg(t, 1));
  }

  // Evaluate render() and patch the DOM
  r4.eval(r4.call(r4.sym("render"), []));
  const pending = r4.scopeTakePending("dom");
  const termId  = pending[pending.length - 1];
  tree = patch(r4, prevTermId, termId, tree, container, () => {});
  prevTermId = termId;
}`;

// ══════════════════════════════════════════════
// Example class — self-contained section runtime
// ══════════════════════════════════════════════

const WASM_URL = '/term-rewriting-experiment-one/rules4.wasm';

class Example {
  constructor(containerEl, opts) {
    this.el = containerEl;
    this.mode = opts.mode; // 'trace' | 'animation'
    this.enabledModuleNames = new Set(opts.enabledModules || []);
    this.maxFrames = opts.maxFrames || 40;

    // DOM refs
    this.statusEl = this.el.querySelector('[data-role="status"]');
    this.errorEl = this.el.querySelector('[data-role="error"]');
    this.resultEl = this.el.querySelector('[data-role="result"]');
    this.vizEl = this.el.querySelector('[data-role="viz"]');
    this.sliderEl = this.el.querySelector('[data-role="slider"]');
    this.labelEl = this.el.querySelector('[data-role="step-label"]');
    this.playPauseBtn = this.el.querySelector('[data-role="play-pause"]');
    this.applyMetaBtn = this.el.querySelector('[data-role="apply-meta"]');

    // Tab switching
    const tabs = this.el.querySelectorAll('.tab');
    const panels = this.el.querySelectorAll('.editor-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const id = tab.dataset.tab;
        tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === id));
        panels.forEach(p => p.classList.toggle('active', p.dataset.panel === id));
      });
    });

    // Editors
    const scheduleRun = () => this.scheduleRun();
    this.programEditor = new EditorView({
      doc: opts.programCode,
      extensions: [
        basicSetup, rules4Language, tangleExtension(),
        EditorView.updateListener.of(u => { if (u.docChanged) scheduleRun(); }),
      ],
      parent: this.el.querySelector('[data-role="editor-program"]'),
    });
    this.viewEditor = new EditorView({
      doc: opts.viewCode,
      extensions: [
        basicSetup, rules4Language, tangleExtension(),
        EditorView.updateListener.of(u => { if (u.docChanged) scheduleRun(); }),
      ],
      parent: this.el.querySelector('[data-role="editor-view"]'),
    });

    // JS tab (read-only)
    const jsEl = this.el.querySelector('[data-role="editor-js"]');
    if (jsEl && opts.jsCode) {
      this.jsEditor = new EditorView({
        doc: opts.jsCode,
        extensions: [
          basicSetup, javascript(),
          EditorView.editable.of(false),
        ],
        parent: jsEl,
      });
    }

    // Engine state
    this.r4 = null;
    this.renderSym = null;
    this.currentTree = null;
    this.currentTermId = null;
    this.runGeneration = 0;
    this.runTimer = null;

    // Trace mode state
    this.maxStep = 0;

    // Animation mode state
    this.playing = true;
    this.metaApplied = false;
    this.currentFrame = 0;
    this.tickCounter = 0;
    this.raf = null;

    // Controls
    this.sliderEl.addEventListener('input', () => {
      if (this.mode === 'trace') {
        this.setStep(+this.sliderEl.value);
      } else {
        this.currentFrame = parseInt(this.sliderEl.value);
        if (this.r4) {
          this.r4.eval(this.r4.call(this.r4.sym("handle_event"),
            [this.r4.sym("set_frame"), this.r4.num(this.currentFrame)]));
          this.doRender();
          this.labelEl.textContent = `frame ${this.currentFrame}`;
        }
      }
    });

    if (this.playPauseBtn) {
      this.playPauseBtn.addEventListener('click', () => {
        this.playing = !this.playing;
        this.playPauseBtn.textContent = this.playing ? 'Pause' : 'Play';
        this.playPauseBtn.classList.toggle('active', !this.playing);
      });
    }

    if (this.applyMetaBtn) {
      this.applyMetaBtn.addEventListener('click', () => {
        this.metaApplied = !this.metaApplied;
        this.applyMetaBtn.textContent = this.metaApplied ? 'Remove Meta' : 'Apply Meta';
        this.applyMetaBtn.classList.toggle('active', this.metaApplied);
        this.scheduleRun();
      });
    }
  }

  scheduleRun() {
    clearTimeout(this.runTimer);
    this.runTimer = setTimeout(() => this.run(), isScrubbing ? 0 : 300);
  }

  async run() {
    const thisGen = ++this.runGeneration;
    this.statusEl.className = 'status-dot running';

    try {
      const r4 = await Rules4.load(WASM_URL);
      if (thisGen !== this.runGeneration) return;

      if (this.mode === 'animation') {
        this.runAnimation(r4, thisGen);
      } else {
        this.runTrace(r4, thisGen);
      }
    } catch (e) {
      if (thisGen !== this.runGeneration) return;
      console.error('[ERROR]', e);
      this.errorEl.textContent = e.message;
      this.errorEl.classList.add('visible');
      this.statusEl.className = 'status-dot err';
    }
  }

  runTrace(r4, thisGen) {
    const programCode = this.programEditor.state.doc.toString();
    r4.eval(r4.loadProgram(programCode));
    if (thisGen !== this.runGeneration) return;

    this.maxStep = r4.termNum(r4.eval(r4.sym("max_step")));
    const resultTerm = r4.eval(r4.sym("result_val"));
    if (this.resultEl) {
      this.resultEl.textContent = `result = ${r4.display(resultTerm)}`;
    }

    // Run viz modules
    const tracedFns = new Set();
    for (const mod of allModules) {
      if (this.enabledModuleNames.has(mod.name)) {
        mod.analyze(r4, this.maxStep, tracedFns);
      }
    }

    // Load view code
    const viewCode = this.viewEditor.state.doc.toString();
    if (viewCode.trim()) {
      r4.eval(r4.loadProgram(viewCode));
    }
    if (thisGen !== this.runGeneration) return;

    this.r4 = r4;
    this.renderSym = r4.sym("render");
    this.currentTree = null;
    this.currentTermId = null;

    r4.assertRule(r4.sym("current_step"), r4.num(0));
    this.doRender();

    this.sliderEl.max = this.maxStep;
    this.sliderEl.value = 0;
    this.labelEl.textContent = `Step 0 of ${this.maxStep}`;

    this.errorEl.classList.remove('visible');
    this.statusEl.className = 'status-dot ok';
  }

  runAnimation(r4, thisGen) {
    const programCode = this.programEditor.state.doc.toString();
    const metaCode = this.viewEditor.state.doc.toString();

    if (this.metaApplied && metaCode.trim()) {
      r4.eval(r4.loadProgram(programCode + '\n' + metaCode));
    } else {
      r4.eval(r4.loadProgram(programCode));
    }
    if (thisGen !== this.runGeneration) return;

    this.r4 = r4;
    this.renderSym = r4.sym("render");
    this.currentTree = null;
    this.currentTermId = null;

    r4.eval(r4.call(r4.sym("handle_event"),
      [r4.sym("set_frame"), r4.num(this.currentFrame)]));

    if (this.metaApplied) {
      r4.eval(r4.call(r4.sym("handle_event"),
        [r4.sym("apply_meta"), r4.num(0)]));
    }

    this.doRender();
    this.errorEl.classList.remove('visible');
    this.statusEl.className = 'status-dot ok';

    if (!this.raf) this.startAnimLoop();
  }

  processDrawRules() {
    if (!this.r4) return;
    const pending = this.r4.scopeTakePending("draw");
    for (const t of pending) {
      if (this.r4.termTag(t) === 2 && this.r4.termCallArity(t) === 2) {
        this.r4.assertRule(this.r4.termCallArg(t, 0), this.r4.termCallArg(t, 1));
      }
    }
  }

  doRender() {
    if (!this.r4 || !this.renderSym) return;
    try {
      if (this.mode === 'animation') this.processDrawRules();
      this.r4.eval(this.r4.call(this.renderSym, []));
      const pending = this.r4.scopeTakePending("dom");
      if (pending.length === 0) return;
      const newTermId = pending[pending.length - 1];

      if (this.currentTree === null) {
        const dom = renderTerm(this.r4, newTermId, () => {});
        this.vizEl.innerHTML = '';
        this.vizEl.appendChild(dom);
        this.currentTree = dom;
      } else {
        this.currentTree = patch(this.r4, this.currentTermId, newTermId,
          this.currentTree, this.vizEl, () => {});
      }
      this.currentTermId = newTermId;
    } catch (e) {
      console.error('[render]', e);
      this.errorEl.textContent = e.message;
      this.errorEl.classList.add('visible');
      this.statusEl.className = 'status-dot err';
    }
  }

  setStep(s) {
    if (!this.r4) return;
    s = Math.max(0, Math.min(this.maxStep, s));
    this.sliderEl.value = s;
    this.labelEl.textContent = `Step ${s} of ${this.maxStep}`;
    this.r4.assertRule(this.r4.sym("current_step"), this.r4.num(s));
    this.doRender();
  }

  startAnimLoop() {
    if (this.raf) return;
    const tick = () => {
      if (this.playing && this.r4 && this.mode === 'animation') {
        this.tickCounter++;
        if (this.tickCounter % 3 === 0) {
          try {
            this.currentFrame = (this.currentFrame + 1) % this.maxFrames;
            this.r4.eval(this.r4.call(this.r4.sym("handle_event"),
              [this.r4.sym("set_frame"), this.r4.num(this.currentFrame)]));
            this.doRender();
            this.sliderEl.value = this.currentFrame;
            this.labelEl.textContent = `frame ${this.currentFrame}`;
          } catch (e) {
            console.error("[rules4] anim tick error:", e);
          }
        }
      }
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }
}

// ── Create both sections ──

const fibExample = new Example(document.getElementById('sec-fib'), {
  mode: 'trace',
  enabledModules: ['call_tree', 'step_card', 'value_timeline'],
  programCode: FIB_CODE,
  viewCode: FIB_VIEW,
  jsCode: FIB_JS_CODE,
});

const ballExample = new Example(document.getElementById('sec-ball'), {
  mode: 'animation',
  maxFrames: 40,
  enabledModules: [],
  programCode: BALL_PROGRAM,
  viewCode: BALL_META,
  jsCode: BALL_JS_CODE,
});

// ── Page navigation (buttons) ──

const pages = [
  { el: document.getElementById('sec-basics'), example: null },
  { el: document.getElementById('sec-meta-explain'), example: null },
  { el: document.getElementById('sec-fib'), example: fibExample },
  { el: document.getElementById('sec-ball'), example: ballExample },
];
let currentPage = 0;

const pageIndicator = document.getElementById('page-indicator');
const pageNumberEl = document.getElementById('page-number');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');

function goToPage(idx) {
  if (idx < 0 || idx >= pages.length || idx === currentPage) return;
  pages[currentPage].el.classList.remove('active');
  currentPage = idx;
  pages[currentPage].el.classList.add('active');
  updateIndicator();
}

function updateIndicator() {
  pageIndicator.textContent = `page ${currentPage + 1} of ${pages.length}`;
  if (pageNumberEl) pageNumberEl.textContent = `\u2014 ${currentPage + 1} \u2014`;
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage === pages.length - 1;
}

prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

// ── Keyboard nav ──

document.addEventListener('keydown', e => {
  if (e.target.closest('.cm-editor') || e.target.tagName === 'INPUT') return;

  const ex = pages[currentPage].example;
  if (!ex) return;

  if (ex.mode === 'trace' && ex.r4) {
    const s = +ex.sliderEl.value;
    if (e.key === 'ArrowLeft')  { e.preventDefault(); ex.setStep(s - 1); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); ex.setStep(s + 1); return; }
    if (e.key === 'Home')       { e.preventDefault(); ex.setStep(0); return; }
    if (e.key === 'End')        { e.preventDefault(); ex.setStep(ex.maxStep); return; }
  }
});

// ── Init ──

updateIndicator();
await Promise.all([fibExample.run(), ballExample.run()]);
