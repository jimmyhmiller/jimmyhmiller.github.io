import { useState, useEffect } from 'react';
import NextLink from 'next/link';

export default function MobileProjectPager({ projects, currentId, prev, next }) {
  const [open, setOpen] = useState(false);
  const idx = projects.findIndex((p) => p.id === currentId);
  const count = projects.length;
  const current = projects[idx];

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, [open]);

  return (
    <>
      <div className="projpage-mobilepager">
        {prev ? (
          <NextLink href={`/projects/${prev.id}`} className="mp-side" aria-label={`Previous: ${prev.title}`}>←</NextLink>
        ) : <span className="mp-side mp-disabled" aria-hidden="true">←</span>}
        <button
          type="button"
          className="mp-center"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <span className="mp-counter">{String(idx + 1).padStart(2, '0')}/{String(count).padStart(2, '0')}</span>
          <span className="mp-name">{current.title}</span>
          <span className="mp-caret" aria-hidden="true">▾</span>
        </button>
        {next ? (
          <NextLink href={`/projects/${next.id}`} className="mp-side" aria-label={`Next: ${next.title}`}>→</NextLink>
        ) : <span className="mp-side mp-disabled" aria-hidden="true">→</span>}
      </div>

      {open && (
        <div className="projpage-mobilesheet" role="dialog" aria-modal="true" aria-label="All projects">
          <div className="mp-backdrop" onClick={() => setOpen(false)} />
          <div className="mp-panel">
            <div className="mp-panel-head">
              <span className="mp-panel-title">Projects</span>
              <button type="button" className="mp-close" onClick={() => setOpen(false)} aria-label="Close">×</button>
            </div>
            <ol className="mp-list">
              {projects.map((p, i) => (
                <li
                  key={p.id}
                  className={p.id === currentId ? 'is-current' : ''}
                  style={{ '--row-accent': p.accent }}
                >
                  <NextLink href={`/projects/${p.id}`} onClick={() => setOpen(false)}>
                    <span className="n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="dot" />
                    <span className="name">{p.title}</span>
                  </NextLink>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </>
  );
}
