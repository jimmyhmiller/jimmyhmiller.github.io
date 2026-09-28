import article from '../../data/react-compiler/article.json';

const previewStyle = `
  * { box-sizing: border-box; }
  body { margin: 0; padding: 14px; font: 12px/1.5 system-ui, sans-serif; color: #27372f; background: #fbfcf8; }
  main { min-width: 0; }
  button { margin: 0 7px 9px 0; padding: 6px 10px; border: 1px solid #b9cdbf; border-radius: 5px; background: #edf5ee; color: #28543b; font: inherit; cursor: pointer; }
  button:hover { background: #e0eee3; }
  button:focus-visible, li[onclick]:focus-visible { outline: 2px solid #267154; outline-offset: 2px; }
  ul { max-height: 116px; margin: 1px 0 0; padding: 0; overflow: auto; border: 1px solid #dbe5dc; border-radius: 5px; background: white; list-style: none; }
  li { display: flex; align-items: center; gap: 12px; min-height: 27px; padding: 5px 10px; border-bottom: 1px solid #edf1ec; }
  li:last-child { border-bottom: 0; }
  li > span { min-width: 28px; color: #6e8073; font-variant-numeric: tabular-nums; }
  li > strong { font-weight: 550; }
  li.selected { background: #dbefe0; color: #20583a; }
  li.mine { color: #276846; }
  li[id^="row-"] { cursor: pointer; }
  li[id^="row-"]:hover { background: #f1f8f2; }
`;

export function frameHtml(fixtureId, variantId, {preview = false} = {}) {
  const url = article.fixtures[fixtureId].builds[variantId].bundleUrl;
  const prefill = preview && fixtureId === 'append' ? `<script>
    const observer = new MutationObserver(() => {
      const button = document.querySelector('button:not(#run-2000)');
      if (!button) return;
      observer.disconnect();
      for (let i = 0; i < 4; i++) button.click();
    });
    observer.observe(document.getElementById('root'), {childList:true, subtree:true});
  <\/script>` : '';
  return `<!doctype html><html><head><meta charset="utf-8"><style>${previewStyle}</style></head><body><div id="root"></div><script>window.__errors=[];window.addEventListener('error',e=>window.__errors.push(e.message || 'Could not load '+e.target.src),true);window.addEventListener('unhandledrejection',e=>window.__errors.push(String(e.reason)));<\/script>${prefill}<script src="${url}"><\/script></body></html>`;
}
