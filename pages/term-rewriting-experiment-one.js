import { useEffect } from 'react';
import Head from 'next/head';

function EditorSection({ id, tabs, children }) {
  return (
    <div className="example" id={id}>
      {children}
    </div>
  );
}

function TabBar({ tabs }) {
  return (
    <div className="tab-bar">
      {tabs.map((tab, i) => (
        <button key={tab.id} className={`tab${i === 0 ? ' active' : ''}`} data-tab={tab.id}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function EditorPanels({ tabs }) {
  return (
    <div className="editor-wrap">
      {tabs.map((tab, i) => (
        <div key={tab.id} className={`editor-panel${i === 0 ? ' active' : ''}`} data-panel={tab.id}>
          <div data-role={tab.role} />
        </div>
      ))}
    </div>
  );
}

export default function TermRewritingExperimentOne() {
  useEffect(() => {
    const urlPath = encodeURIComponent(window.location.pathname.replace(/^\//, ''));
    fetch(`https://github-sites-simple-stats-jimmyhmiller.vercel.app/api/${urlPath}`);

    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/term-rewriting-experiment-one/app.js';
    document.body.appendChild(script);
    return () => script.remove();
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <title>Execution Meta-Programming &mdash; Rules4</title>
      </Head>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #e8e0d8;
          background-image: linear-gradient(135deg, #ece4dc 0%, #d5ccc2 50%, #c8bfb5 100%);
        }
        #__next {
          height: 100vh; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .book {
          max-width: 1200px; width: calc(100% - 40px);
          height: calc(100vh - 40px); max-height: 950px;
          display: flex; flex-direction: column;
          position: relative;
        }
        .book-header {
          display: flex; align-items: baseline; gap: 16px;
          margin-bottom: 8px; flex-shrink: 0;
          padding: 0 8px;
        }
        .book-header h1 {
          font-family: 'Georgia', 'Palatino Linotype', 'Book Antiqua', serif;
          font-size: 20px; font-weight: 700; color: #5a4a3a;
        }
        .page-indicator {
          font-family: 'Georgia', serif;
          font-size: 13px; color: #8a7a6a;
          font-style: italic;
        }
        .book-body {
          flex: 1; position: relative;
          min-height: 0;
        }
        .example {
          position: absolute; inset: 0;
          background-color: #fefcf9;
          padding: 28px 36px 20px 36px;
          display: flex; flex-direction: column;
          overflow: hidden;
          opacity: 0; pointer-events: none;
          z-index: 0;
        }
        .example.active {
          opacity: 1; pointer-events: auto; z-index: 2;
        }
        .page-prose {
          padding: 40px 60px;
          overflow-y: auto;
          font-family: 'Georgia', 'Palatino Linotype', 'Book Antiqua', serif;
          color: #3a3025;
          line-height: 1.7;
        }
        .page-prose h2 {
          font-size: 22px; font-weight: 700; color: #5a4a3a;
          margin-bottom: 20px; border-bottom: 1.5px solid #e0dbd3;
          padding-bottom: 8px;
        }
        .page-prose h3 {
          font-size: 16px; font-weight: 700; color: #5a4a3a;
          margin-top: 24px; margin-bottom: 8px;
        }
        .page-prose p {
          margin-bottom: 14px; font-size: 15px;
        }
        .page-prose code {
          font-family: 'SF Mono', 'Fira Code', 'Menlo', monospace;
          font-size: 13px; background: #f5f0ea; padding: 2px 6px;
          border-radius: 4px; color: #1565c0;
        }
        .page-prose pre {
          background: #faf8f4; border: 1px solid #e0dbd3;
          border-radius: 8px; padding: 14px 18px;
          margin-bottom: 16px; overflow-x: auto;
          font-family: 'SF Mono', 'Fira Code', 'Menlo', monospace;
          font-size: 13px; line-height: 1.55; color: #3a3025;
        }
        .page-prose ul {
          margin-bottom: 14px; padding-left: 24px;
        }
        .page-prose li {
          margin-bottom: 6px; font-size: 15px;
        }
        .page-prose a {
          color: #1565c0; text-decoration: none;
          border-bottom: 1px solid rgba(21, 101, 192, 0.3);
        }
        .page-prose a:hover {
          border-bottom-color: #1565c0;
        }
        .page-nav {
          display: flex; gap: 6px; margin-left: auto;
        }
        .page-nav button {
          background: none; border: 1.5px solid #b0a898;
          border-radius: 6px; padding: 3px 12px;
          font-family: 'Georgia', serif; font-size: 13px;
          color: #7a6a5a; cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .page-nav button:hover:not(:disabled) {
          background: #5a4a3a; color: #fefcf9; border-color: #5a4a3a;
        }
        .page-nav button:disabled {
          opacity: 0.35; cursor: default;
        }
        .book-footer {
          text-align: center; padding-top: 8px; flex-shrink: 0;
        }
        .book-footer .page-number {
          font-family: 'Georgia', serif;
          font-size: 12px; color: #a09585;
          font-style: italic;
        }
        .example-header {
          display: flex; align-items: center; gap: 10px; margin-bottom: 12px;
          flex-shrink: 0;
        }
        .example-header h2 {
          font-size: 17px; font-weight: 700; color: #333;
        }
        .status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          display: inline-block; transition: background 0.2s;
        }
        .status-dot.ok { background: #22c55e; }
        .status-dot.err { background: #ef4444; }
        .status-dot.running { background: #f59e0b; }
        .result-badge {
          font-weight: 700; color: #2e7d32; background: #e8f5e9;
          padding: 1px 8px; border-radius: 8px;
          font-family: 'SF Mono', monospace; font-size: 13px;
        }
        .main {
          display: flex; gap: 16px; margin-bottom: 10px;
          flex: 1; min-height: 0;
        }
        .editor-col {
          flex: 6; display: flex; flex-direction: column; min-width: 0;
        }
        .viz-col {
          flex: 5; min-width: 0;
          display: flex; flex-direction: column; gap: 10px;
        }
        .viz-wrap {
          flex: 1;
          background: white;
          border: 1px solid #e0dbd3;
          border-radius: 12px;
          overflow-y: auto;
          padding: 12px;
        }
        .tab-bar {
          display: flex; gap: 0;
          border-bottom: 2px solid #e0dbd3;
          flex-shrink: 0;
        }
        .tab {
          padding: 8px 18px;
          border: none; background: none;
          font-size: 13px; font-weight: 600;
          color: #888; cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          transition: color 0.15s, border-color 0.15s;
        }
        .tab:hover { color: #555; }
        .tab.active { color: #1976d2; border-bottom-color: #1976d2; }
        .editor-wrap {
          flex: 1;
          border: 2px solid #e0dbd3;
          border-top: none;
          border-radius: 0 0 10px 10px;
          overflow: hidden;
          position: relative;
        }
        .editor-panel {
          position: absolute; inset: 0;
          display: none;
          overflow: hidden;
        }
        .editor-panel.active { display: flex; flex-direction: column; }
        .editor-panel > div { flex: 1; overflow: hidden; }
        .cm-editor { height: 100%; overflow: hidden; }
        .cm-editor .cm-scroller { overflow: auto !important; }
        .cm-editor .cm-content {
          font-family: 'SF Mono', 'Fira Code', 'Menlo', monospace;
          font-size: 13px;
        }
        .cm-editor .cm-gutters { background: #faf8f4; border-right: 1px solid #eae5dd; }
        .cm-editor.cm-focused { outline: none; }
        .error {
          background: #fef2f2; color: #dc2626; border-radius: 8px;
          padding: 6px 10px; font-size: 11px; margin-top: 6px;
          font-family: 'SF Mono', monospace;
          max-height: 50px; overflow: auto;
          display: none; white-space: pre-wrap;
        }
        .error.visible { display: block; }
        .controls {
          display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
        }
        input[type="range"] {
          flex: 1; height: 6px; background: #ddd;
          border-radius: 3px; outline: none; cursor: pointer;
          -webkit-appearance: none; appearance: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 20px; height: 20px;
          background: white; border-radius: 50%;
          border: 3px solid #1976d2; cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.18);
        }
        .frame-label {
          font-size: 12px; color: #999; min-width: 90px; text-align: center;
          font-variant-numeric: tabular-nums; font-weight: 600;
        }
        .step-label {
          font-size: 12px; color: #999; min-width: 110px; text-align: center;
          font-variant-numeric: tabular-nums; font-weight: 600;
        }
        .btn {
          padding: 6px 16px;
          border: 2px solid #1976d2;
          background: transparent;
          color: #1976d2;
          font-size: 12px; font-weight: 600;
          border-radius: 8px; cursor: pointer;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .btn:hover { background: #1976d2; color: white; }
        .btn.active { background: #1976d2; color: white; }
        .cm-tangle-number {
          color: #1976d2;
          border-bottom: 1.5px dashed rgba(25, 118, 210, 0.5);
          cursor: col-resize;
          padding: 3px 2px;
        }
        .cm-tangle-number:hover {
          background: rgba(25, 118, 210, 0.1);
          border-bottom-style: solid;
        }
        body.tangle-dragging, body.tangle-dragging * {
          cursor: col-resize !important;
          user-select: none !important;
        }
        .tree-container {
          background: white; border: 1px solid #e0dbd3; border-radius: 12px;
          padding: 16px 8px 8px 8px; margin-bottom: 16px; overflow-x: auto;
        }
        .tree-container svg { display: block; margin: 0 auto; }
        .tree-container circle { transition: fill 0.12s, stroke 0.12s; }
        .tree-container line   { transition: stroke 0.12s; }
        .tree-container text   { transition: fill 0.12s; }
        .legend {
          display: flex; gap: 16px; justify-content: center;
          margin-bottom: 10px; font-size: 11px; color: #999;
        }
        .legend-dot {
          display: inline-block; width: 10px; height: 10px;
          border-radius: 50%; margin-right: 4px; vertical-align: middle;
        }
        .step-card {
          background: white; border: 1px solid #e0dbd3; border-radius: 10px;
          padding: 12px 16px; display: flex; align-items: baseline; gap: 10px;
          flex-wrap: wrap; min-height: 44px;
        }
        .step-num { color: #bbb; font-size: 11px; font-weight: 700; letter-spacing: 0.4px; }
        .step-old { font-family: 'SF Mono', monospace; font-size: 14px; color: #555; }
        .step-arrow { color: #ccc; font-weight: bold; font-size: 14px; }
        .step-new { font-family: 'SF Mono', monospace; font-size: 14px; color: #1565c0; font-weight: 600; }
        .kind-badge {
          margin-left: auto; font-size: 10px; padding: 2px 8px;
          border-radius: 8px; font-weight: 700; letter-spacing: 0.3px;
        }
        .fn-badge { background: #e3f2fd; color: #1565c0; }
        .builtin-badge { background: #fff3e0; color: #e65100; }
        .result-val { color: #2e7d32; font-weight: 600; }
        .result-badge { background: #e8f5e9; color: #2e7d32; }
        .timeline-container {
          background: white; border: 1px solid #e0dbd3; border-radius: 12px;
          padding: 16px 8px 8px 8px; margin-bottom: 16px; overflow-x: auto;
        }
        .timeline-container svg { display: block; margin: 0 auto; }
      `}</style>

      <div className="book">
        <div className="book-header">
          <h1>Execution Meta-Programming</h1>
          <span className="page-indicator" id="page-indicator">page 1 of 5</span>
          <div className="page-nav">
            <button id="prev-page" disabled>&larr; Prev</button>
            <button id="next-page">Next &rarr;</button>
          </div>
        </div>

        <div className="book-body">
          {/* Page 1: Introduction */}
          <div className="example active page-prose" id="sec-intro">
            <h2>A Simple Language for Inspecting Execution</h2>
            <p>I&rsquo;ve always enjoyed things like{' '}
            <a href="https://worrydream.com/LearnableProgramming/">Bret Victor&rsquo;s Learnable Programming</a> or
            his impressive programming demos in{' '}
            <a href="https://www.youtube.com/watch?v=PUv66718DII">Inventing on Principle</a>.
            There have been a number of things that try to add more of these direct manipulation bits into programming
            languages (<a href="https://people.cs.uchicago.edu/~brianhempel/Maniposynth-Bimodal-Tangible-Functional-Programming-with-Appendices.pdf">Maniposynth</a>,{' '}
            <a href="https://web.eecs.umich.edu/~comar/livelits-tyde.pdf">LiveLits</a>).
            But I&rsquo;m interested in something slightly different. I&rsquo;ve always felt there was a gap that wasn&rsquo;t being filled.</p>

            <p>How do we take a normal program not meant to be visual, not created with the idea of being an explorable
            explanation and layer on this kind of diagramming? The way I see people create these is by an external approach.
            They will create their own little vm that will run the program and from the outside capture all the state they
            need to do the visualization. What if instead, all of that could be done inside one programming language? What
            if the actual steps a program takes to execute could be accessed in the language itself?</p>

            <p>What follows is a quick exploration of that idea. There are so many ways it takes shortcuts, so many rough
            edges. So many semantic questions I need to resolve if it were to be more than this demo. But I think the small
            amount shows the idea. The next two pages are a quick tutorial on the language and the final two are little
            demos showing how we can write code not designed to be inspected, and inspect the execution and play it back.</p>
          </div>

          {/* Page 2: Basics of Term Rewriting */}
          <div className="example page-prose" id="sec-basics">
            <h2>Basics of Term Rewriting</h2>
            <p>Rules4 programs are built from <strong>terms</strong> &mdash; nested tree structures like{' '}
            <code>fib(5)</code> or <code>circle(100, 200, 15)</code>. A term is either a number, a symbol,
            or a function call: a name applied to arguments.</p>

            <h3>Pattern Matching &amp; Variables</h3>
            <p>A <strong>rule</strong> says &ldquo;when you see <em>this</em> pattern, replace it with <em>that</em>.&rdquo;{' '}
            Variables start with <code>?</code> and match anything:</p>
            <pre>{'rule(double(?x), ?x + ?x)      # double(5) => 5 + 5'}</pre>
            <p>Rules are tried top-to-bottom. The first matching pattern wins.</p>

            <h3>Functions as Sugar</h3>
            <p>Writing <code>fn</code> definitions is just shorthand for rules:</p>
            <pre>{'fn fib(0) = 0                   # same as: rule(fib(0), 0)\nfn fib(1) = 1\nfn fib(?n) = fib(?n - 1) + fib(?n - 2)'}</pre>

            <h3>Evaluation = Repeated Rewriting</h3>
            <p>The engine rewrites terms over and over until nothing changes.{' '}
            <code>fib(3)</code> becomes <code>fib(2) + fib(1)</code>, then each part rewrites
            further, until only numbers remain and arithmetic produces the final answer.</p>
            <p>There are no statements, assignments, or side effects &mdash; just terms being
            rewritten by pattern-matching rules.</p>
          </div>

          {/* Page 2: How Meta Works */}
          <div className="example page-prose" id="sec-meta-explain">
            <h2>How Meta Works</h2>

            <h3>Scopes</h3>
            <p>Every rule lives in a <strong>scope</strong>. Ordinary rules live in the default scope.
            Prefixes like <code>@meta</code>, <code>@dom</code>, and <code>@draw</code> name other scopes.</p>
            <p>Scopes are isolated: rules in <code>@draw</code> don&rsquo;t interfere with rules in the default scope.</p>

            <h3>Meta-rules</h3>
            <p>A <strong>meta-rule</strong> observes the engine as it works. It reacts to two events:</p>
            <ul>
              <li><code>reduction(?step, ?old, ?new, ?kind)</code> &mdash; a term was rewritten</li>
              <li><code>result(?step, ?call, ?val)</code> &mdash; a function call finished evaluating</li>
            </ul>
            <pre>{'rule tracer : @meta -> @rules {\n  result(?step, fib(?n), ?val) =>\n    rule(fib(?n), ?val)          # inject a memo rule!\n}'}</pre>
            <p>The header <code>{': @meta -> @rules'}</code> means: &ldquo;observe from <code>@meta</code>, write results
            into <code>@rules</code>.&rdquo; The arrow target determines where the output goes.</p>

            <h3>Writing to @rules</h3>
            <p>When a meta-rule produces <code>rule(fib(3), 2)</code> and its target is <code>@rules</code>,
            that new rule is injected into the default scope. Future evaluations of <code>fib(3)</code>{' '}
            will match immediately &mdash; memoization for free.</p>

            <p>Meta-rules can target any scope: <code>@dom</code> to produce UI,{' '}
            <code>@draw</code> to capture drawing commands, or even <code>@rules</code> to modify
            the program&rsquo;s own rules while it runs.</p>
          </div>

          {/* Page 3: Fibonacci */}
          <div className="example" id="sec-fib">
            <div className="example-header">
              <h2>Tracing Fibonacci</h2>
              <span className="status-dot ok" data-role="status" />
              <span className="result-badge" data-role="result">...</span>
            </div>
            <div className="main">
              <div className="editor-col">
                <TabBar tabs={[
                  { id: 'program', label: 'Program' },
                  { id: 'view', label: 'View' },
                  { id: 'js', label: 'JS' },
                ]} />
                <EditorPanels tabs={[
                  { id: 'program', role: 'editor-program' },
                  { id: 'view', role: 'editor-view' },
                  { id: 'js', role: 'editor-js' },
                ]} />
                <div className="error" data-role="error" />
              </div>
              <div className="viz-col">
                <div className="viz-wrap" data-role="viz" />
                <div className="controls">
                  <input type="range" data-role="slider" min="0" max="0" defaultValue="0" />
                  <span className="step-label" data-role="step-label">Step 0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Page 4: Bouncing Ball */}
          <div className="example" id="sec-ball">
            <div className="example-header">
              <h2>Ghost Trail</h2>
              <span className="status-dot ok" data-role="status" />
            </div>
            <div className="main">
              <div className="editor-col">
                <TabBar tabs={[
                  { id: 'animation', label: 'Animation' },
                  { id: 'meta', label: 'Meta' },
                  { id: 'js', label: 'JS' },
                ]} />
                <EditorPanels tabs={[
                  { id: 'animation', role: 'editor-program' },
                  { id: 'meta', role: 'editor-view' },
                  { id: 'js', role: 'editor-js' },
                ]} />
                <div className="error" data-role="error" />
              </div>
              <div className="viz-col">
                <div className="viz-wrap" data-role="viz" />
                <div className="controls">
                  <button className="btn" data-role="play-pause">Pause</button>
                  <input type="range" data-role="slider" min="0" max="39" defaultValue="0" />
                  <span className="frame-label" data-role="step-label">frame 0</span>
                  <button className="btn" data-role="apply-meta">Apply Meta</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="book-footer">
          <span className="page-number" id="page-number">&mdash; 1 &mdash;</span>
        </div>
      </div>
    </>
  );
}
