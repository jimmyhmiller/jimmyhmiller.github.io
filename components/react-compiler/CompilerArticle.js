import {Children, createContext, isValidElement, useContext, useEffect, useRef, useState} from 'react';
import article from '../../data/react-compiler/article.json';
import summaryBenchmarks from '../../data/react-compiler/summary-benchmarks.json';
import {frameHtml} from './frame';
import styles from './CompilerArticle.module.css';

const BenchmarkContext = createContext(null);

export function CompilerArticleProvider({children}) {
  const [results, setResults] = useState({});
  const [runs, setRuns] = useState({});
  const [running, setRunning] = useState(null);
  const controller = useRef(null);
  useEffect(() => () => controller.current?.abort(), []);

  async function run(id, specs, host, onProgress) {
    // The ref closes the gap before React updates disabled buttons.
    if (controller.current) throw new Error('Another run is finishing.');
    const current = new AbortController();
    controller.current = current;
    setRunning(id);
    try {
      const {measure} = await import('./benchmark');
      for (const spec of specs) {
        const result = await measure(spec.fixture, spec.variants, {
          host, signal:current.signal,
          onProgress:message => onProgress(specs.length > 1 ? article.fixtures[spec.fixture].label + ' · ' + message : message),
        });
        setRuns(previous => ({...previous, [id]:result}));
        setResults(previous => ({...previous, [spec.fixture]:{...result, medians:{...previous[spec.fixture]?.medians, ...result.medians}}}));
      }
    } finally {
      if (controller.current === current) {
        controller.current = null;
        setRunning(null);
      }
    }
  }

  return <BenchmarkContext.Provider value={{results, runs, running, run, stop:() => controller.current?.abort()}}>{children}</BenchmarkContext.Provider>;
}

// Keep the source examples in MDX so edits to the article are shown directly.
export function CompilerSourcePair({children}) {
  const examples = Children.toArray(children).filter(isValidElement);
  return <div className={styles.sourcePair}>
    {examples.map((example, index) => <section className={styles.sourcePanel} key={example.key ?? index}>
      <div className={styles.codeLabel}>{index === 0 ? 'Input' : 'Compiler output'}</div>
      {example}
    </section>)}
  </div>;
}

function HighlightedCode({source, emphasis}) {
  const tokens = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:import|from|export|function|return|const|let|if|else|async|await|for|new|null|true|false)\b)/g;
  return <pre>{source.split('\n').map((line, lineIndex) => {
    const parts = [];
    let last = 0;
    for (const match of line.matchAll(tokens)) {
      parts.push(line.slice(last, match.index));
      const className = match[0].startsWith('/') ? styles.comment : /^['"]/.test(match[0]) ? styles.string : styles.keyword;
      parts.push(<span className={className} key={match.index}>{match[0]}</span>);
      last = match.index + match[0].length;
    }
    parts.push(line.slice(last));
    return <span key={lineIndex} className={`${styles.codeLine} ${emphasis?.some(text => line.includes(text)) ? styles.changed : ''}`}>{parts.length === 1 && parts[0] === '' ? ' ' : parts}</span>;
  })}</pre>;
}

export function CompilerCode({id}) {
  const config = article.placements[id];
  return <figure className={`${styles.widget} ${styles.codeWidget}`} id={`widget-${id}`}>
    <details className={styles.fullOutput}>
      <summary>Show full compiler output</summary>
      {config.panels.map(panel => <section className={styles.fullOutputPanel} key={panel.build} aria-label={panel.label.replace(' · map callback', '')}>
        <div className={styles.codeLabel}>{panel.label.replace(' · map callback', '')}</div>
        <HighlightedCode source={article.fixtures[config.fixture].builds[panel.build].generated} />
      </section>)}
    </details>
    {config.aside && <div className={styles.codeAside}><span>{config.aside.label}</span><code>{config.aside.code}</code></div>}
  </figure>;
}

function RunControl({id, specs, children, label = 'Run benchmark', again = 'Run again', controlsFirst = false}) {
  const {running, run, stop} = useContext(BenchmarkContext);
  const [status, setStatus] = useState('');
  const [hasRun, setHasRun] = useState(false);
  const host = useRef(null);
  const mounted = useRef(true);
  useEffect(() => {mounted.current = true; return () => {mounted.current = false;};}, []);
  async function click() {
    if (running === id) {stop(); return;}
    try {
      setStatus('Preparing benchmark…');
      await run(id, specs, host.current, message => {if (mounted.current) setStatus(message);});
      if (mounted.current) {setStatus(specs.length > 1 ? 'Your browser results appear under the references.' : 'Your browser · median of 3 runs'); setHasRun(true);}
    } catch (error) {
      if (mounted.current) setStatus(error.message);
    }
  }
  const showRunArea = running === id || (hasRun && specs.length === 1);
  const controls = <div className={styles.timingFoot}>
      <span className={styles.runStatus} role="status">{status}</span>
      <button type="button" className={styles.runHere} onClick={click} disabled={running !== null && running !== id}>{running === id ? 'Stop' : hasRun ? again : label}</button>
    </div>;
  const runArea = <div className={`${styles.runArea} ${showRunArea ? styles.runAreaVisible : ''}`}>
      {showRunArea && <div className={styles.runAreaHeading}>{running === id ? 'Running benchmark' : 'Example component'}</div>}
      <div ref={host} className={styles.runStage} />
      {running !== id && hasRun && specs.length === 1 && <iframe className={styles.previewFrame} title={`${article.fixtures[specs[0].fixture].label} example`} srcDoc={frameHtml(specs[0].fixture, 'compiler', {preview:true})} />}
    </div>;
  return controlsFirst ? <>{controls}{runArea}{children}</> : <>{children}{controls}{runArea}</>;
}

export function CompilerTiming({id}) {
  const config = article.placements[id];
  const {runs} = useContext(BenchmarkContext);
  const saved = article.saved.results[config.fixture];
  const local = runs[id];
  const maximum = Math.max(...config.variants.map(variant => saved.medians[variant]));
  let caption = config.caption;
  if (config.comparison) {
    const {before, after, subject} = config.comparison;
    const baseline = saved.medians[before], optimized = saved.medians[after];
    const direction = optimized > baseline ? 'slower' : 'faster';
    caption = `${subject} is ${(Math.max(baseline, optimized) / Math.min(baseline, optimized)).toFixed(1)}× ${direction} in this reference run.`;
  }
  return <figure id={`widget-${id}`} className={`${styles.widget} ${styles.timingWidget} ${local ? styles.hasLocal : ''} ${id === 'lists' ? styles.listGroups : ''}`}>
    <div className={styles.timingHeading}>{article.fixtures[config.fixture].workload}</div>
    <RunControl id={id} specs={[{fixture:config.fixture, variants:[...new Set(['compiler', ...config.variants])]}]}>
      <div className={styles.results}>
        {local && <div className={styles.localLegend}><span>Reference</span><span>Your browser</span></div>}
        {config.variants.map(variant => <div className={styles.resultRow} data-variant={variant} key={variant}>
          <span className={styles.rowLabel}>{config.labels[variant]}</span>
          <div className={styles.track} aria-label={`Reference: ${saved.medians[variant].toFixed(1)} milliseconds`}><div className={styles.fill} style={{width:100 * saved.medians[variant] / maximum + '%'}} /></div>
          <span className={`${styles.time} ${local ? styles.referenceTime : ''}`}>{saved.medians[variant].toFixed(1)} ms</span>
          {local && <span className={`${styles.time} ${styles.localTime}`}>{local.medians[variant].toFixed(1)} ms</span>}
        </div>)}
      </div>
      <figcaption className={styles.timingCaption}>{caption}</figcaption>
    </RunControl>
  </figure>;
}

export function CompilerSummary() {
  const featured = summaryBenchmarks.featured.map(({fixture, ...display}) => ({
    ...display,
    step:`article/${fixture}`,
    medians:article.saved.results[fixture].medians,
  }));
  const rows = [...featured, ...summaryBenchmarks.results.filter(row => !summaryBenchmarks.excludeSteps.includes(row.step))]
    .filter(({medians}) => medians.compiler / medians.all >= summaryBenchmarks.minimumImprovementOverCompiler && medians.plain / medians.all >= summaryBenchmarks.minimumOverallSpeedup)
    .sort((a, b) => b.medians.plain / b.medians.all - a.medians.plain / a.medians.all)
    .slice(0, summaryBenchmarks.maxResults);
  const left = 38;
  const groupWidth = 48;
  const width = left + rows.length * groupWidth + 10;
  const top = 30;
  const plotHeight = 280;
  const bottom = top + plotHeight;
  const height = bottom + 100;
  const maxSpeedup = Math.ceil(Math.max(...rows.map(row => row.medians.plain / row.medians.all)) / 5) * 5;
  const y = speedup => bottom - speedup / maxSpeedup * plotHeight;
  const ticks = Array.from({length:Math.floor(maxSpeedup / 10)}, (_, index) => (index + 1) * 10);
  const series = [
    {id:'plain', label:'No compiler'},
    {id:'compiler', label:'React Compiler'},
    {id:'all', label:'All prototypes'},
  ];
  return <figure id="widget-summary" className={`${styles.widget} ${styles.summaryWidget}`}>
    <div className={styles.summaryLegend} aria-label="Chart series">{series.map(item => <span className={styles.summaryLegendItem} data-variant={item.id} key={item.id}><i />{item.label}</span>)}</div>
    <div className={styles.summaryChart}>
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-labelledby="summary-title summary-description">
        <title id="summary-title">Benchmark speedups across {rows.length} workloads</title>
        <desc id="summary-description">One grouped bar chart. Benchmarks are on the horizontal axis and speedup compared with no compiler is on the vertical axis. Each benchmark has bars for No compiler, React Compiler, and All prototypes. The red horizontal line marks 1×. The exact median timings are available in each bar's tooltip.</desc>
        {ticks.map(tick => <g key={tick} className={styles.summaryGrid}><line x1={left - 8} x2={width - 12} y1={y(tick)} y2={y(tick)} /><text x={left - 14} y={y(tick) + 4} textAnchor="end">{tick}×</text></g>)}
        <line className={styles.summaryBaseline} x1={left - 8} x2={width - 12} y1={y(1)} y2={y(1)} />
        <text className={styles.summaryBaselineLabel} x={left - 14} y={y(1) + 4} textAnchor="end">1×</text>
        {rows.map((row, index) => {
          const groupX = left + index * groupWidth;
          return <g data-step={row.step} key={row.step}>
            <text className={styles.summaryPlotLabel} transform={`translate(${groupX + 34} ${bottom + 10}) rotate(-65)`} textAnchor="end">{row.shortLabel}</text>
            {series.map((item, seriesIndex) => {
              const speedup = row.medians.plain / row.medians[item.id];
              return <rect className={styles.summaryBar} data-variant={item.id} x={groupX + seriesIndex * 11 + 6} y={y(speedup)} width="9" height={bottom - y(speedup)} key={item.id}>
                <title>{row.label} · {item.label}: {row.medians[item.id].toFixed(1)} ms, {speedup.toFixed(1)}× baseline speed · median of {row.rounds ?? summaryBenchmarks.iterations} runs</title>
              </rect>;
            })}
            <text className={styles.summaryValue} x={groupX + 34} y={y(row.medians.plain / row.medians.all) - 5} textAnchor="middle">{(row.medians.plain / row.medians.all).toFixed(1)}×</text>
          </g>;
        })}
        <text className={styles.summaryAxisLabel} x="10" y="18">Speedup</text>
      </svg>
    </div>
  </figure>;
}
