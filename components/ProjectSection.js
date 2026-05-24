// Renders one project's artifact (code / terminal / image / video / table / arch).
// Used by /projects/[slug] inside its own page chrome.

const KEYWORDS = {
  beagle:  /\b(fn|let|use|as|loop|if|else|break|return|null|true|false|match|enum|struct|extend|with|handle|perform|resume)\b/g,
  simd:    /\b(fn|stream|over|carry|return|let|if|else|for|in|ptr|u8|u16|u32|u64|i8|i16|i32|i64|f32|f64)\b/g,
  tensor:  /\b(fn|let|return|for|in|if|else|axis)\b/g,
  datalog: /\b(define|enum|assert|find|where|as_of|as_of_time|string|i64|f64|bool|required|unique|indexed)\b/g,
  rust:    /\b(fn|let|mut|const|use|pub|struct|enum|impl|trait|match|if|else|for|while|loop|return|break|continue|in|as|self|Self|None|Some|Ok|Err|true|false|move|ref)\b/g,
};

function tokenize(line, lang) {
  const out = [];
  let i = 0;
  let buf = '';
  const flush = () => { if (buf) { out.push({ t: 'txt', v: buf }); buf = ''; } };
  while (i < line.length) {
    const rest = line.slice(i);
    if (rest.startsWith('//')) { flush(); out.push({ t: 'cmt', v: rest }); i = line.length; break; }
    const sm = rest.match(/^("[^"]*"|'[^']*'|`[^`]*`)/);
    if (sm) { flush(); out.push({ t: 'str', v: sm[0] }); i += sm[0].length; continue; }
    const nm = rest.match(/^\b\d+(\.\d+)?\b/);
    if (nm) { flush(); out.push({ t: 'num', v: nm[0] }); i += nm[0].length; continue; }
    buf += line[i];
    i++;
  }
  flush();
  const kwRe = KEYWORDS[lang];
  if (!kwRe) return out;
  const final = [];
  out.forEach((tok) => {
    if (tok.t !== 'txt') { final.push(tok); return; }
    let last = 0;
    let m;
    kwRe.lastIndex = 0;
    while ((m = kwRe.exec(tok.v)) !== null) {
      if (m.index > last) final.push({ t: 'txt', v: tok.v.slice(last, m.index) });
      final.push({ t: 'kw', v: m[0] });
      last = m.index + m[0].length;
    }
    if (last < tok.v.length) final.push({ t: 'txt', v: tok.v.slice(last) });
  });
  return final;
}

const TOK_CLS = { kw: 'tok-kw', str: 'tok-str', num: 'tok-num', cmt: 'tok-cmt', fn: 'tok-fn', type: 'tok-type' };

export function CodeBlock({ code }) {
  const lines = code.source.split('\n');
  return (
    <div className="proj-codeblock">
      <div className="proj-codeblock-bar">
        <span className="proj-codeblock-lang">{code.lang}</span>
        {code.filename && <span className="proj-codeblock-file">{code.filename}</span>}
      </div>
      <pre className="proj-codeblock-pre">
        {lines.map((line, idx) => {
          const toks = tokenize(line, code.lang);
          return (
            <div className="proj-codeblock-line" key={idx}>
              <span className="proj-codeblock-ln">{String(idx + 1).padStart(2, ' ')}</span>
              <span className="proj-codeblock-code">
                {toks.length === 0 ? ' ' : toks.map((t, i) => (
                  <span key={i} className={TOK_CLS[t.t] || ''}>{t.v}</span>
                ))}
              </span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}

function TerminalBlock({ lines, id }) {
  return (
    <div className="proj-terminal">
      <div className="proj-terminal-bar">
        <span className="proj-terminal-dots"><i /><i /><i /></span>
        <span className="proj-terminal-title">{id}</span>
        <span style={{ width: 36 }} />
      </div>
      <div className="proj-terminal-body">
        {lines.map((l, i) => {
          if (l.cmd) {
            return (
              <div className="proj-terminal-line" key={i}>
                <span className="proj-terminal-prompt">{l.prompt || '$'}</span>
                <span>{l.cmd}</span>
              </div>
            );
          }
          return (
            <div
              className={'proj-terminal-line proj-terminal-out' + (l.muted ? ' proj-terminal-muted' : '')}
              key={i}
            >
              {l.out || ' '}
            </div>
          );
        })}
        <div className="proj-terminal-line">
          <span className="proj-terminal-prompt">$</span>
          <span className="proj-terminal-caret" />
        </div>
      </div>
    </div>
  );
}

function PerfTable({ table }) {
  return (
    <div className="proj-perftable">
      <div className="proj-perftable-head">
        {table.headers.map((h, i) => <span key={i}>{h}</span>)}
      </div>
      {table.rows.map((row, i) => {
        const highlight = row[row.length - 1] === 'highlight';
        const cells = highlight ? row.slice(0, -1) : row;
        return (
          <div className={'proj-perftable-row' + (highlight ? ' is-highlight' : '')} key={i}>
            {cells.map((c, j) => <span key={j}>{c}</span>)}
          </div>
        );
      })}
      {table.caption && <div className="proj-perftable-caption">{table.caption}</div>}
      {table.note && <div className="proj-perftable-note">{table.note}</div>}
    </div>
  );
}

function ArchList({ arch }) {
  return (
    <div className="proj-archlist">
      {arch.title && <div className="proj-archlist-title">{arch.title}</div>}
      <div className="proj-archlist-items">
        {arch.items.map((it, i) => (
          <div className="proj-archlist-item" key={i}>
            <span className="proj-archlist-num">{String(i + 1).padStart(2, '0')}</span>
            <div className="proj-archlist-body">
              <b>{it.label}</b>
              <p>{it.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Artifact({ project }) {
  const { kind } = project;
  if (kind === 'code')        return <CodeBlock code={project.code} />;
  if (kind === 'code+table')  return <div className="stack-artifact"><CodeBlock code={project.code} /><PerfTable table={project.table} /></div>;
  if (kind === 'code+arch')   return <div className="stack-artifact"><CodeBlock code={project.code} /><ArchList arch={project.arch} /></div>;
  if (kind === 'terminal')    return <TerminalBlock lines={project.terminal} id={project.id} />;
  if (kind === 'image')       return (
    <figure className="proj-imgblock">
      <img src={project.image} alt={project.title} />
      {project.imageCaption && <figcaption>{project.imageCaption}</figcaption>}
    </figure>
  );
  if (kind === 'image-phone') return (
    <figure className="proj-imgblock proj-imgblock-phone">
      <img src={project.image} alt={project.title} />
      {project.imageCaption && <figcaption>{project.imageCaption}</figcaption>}
    </figure>
  );
  if (kind === 'video')       return (
    <figure className="proj-imgblock">
      <video src={project.video} autoPlay loop muted playsInline />
      {project.videoCaption && <figcaption>{project.videoCaption}</figcaption>}
    </figure>
  );
  return null;
}
