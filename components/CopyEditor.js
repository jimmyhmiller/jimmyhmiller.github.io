// CopyEditor — localhost-only in-browser tool for editing copy on the page.
//
// Activation: Cmd+Shift+E (mac) / Ctrl+Shift+E (win/linux).
// Once active, hovering any text element outlines it; click to edit inline.
// Press Enter or click outside to commit; Esc to cancel one edit.
// The floating panel "Copy edits" button writes a structured diff to the
// clipboard so you can paste it back to chat — page URL + a selector hint
// + before/after text per change.

import { useEffect, useRef, useState } from 'react';

const HOST_OK = (h) => h === 'localhost' || h === '127.0.0.1' || h === '0.0.0.0';

// True if the element has at least one direct text-node child with content.
const hasDirectText = (el) => {
  for (const node of el.childNodes) {
    if (node.nodeType === 3 && node.textContent.trim()) return true;
  }
  return false;
};

// Build a short hint that helps locate this element in source.
const describeEl = (el) => {
  const tag = el.tagName.toLowerCase();
  const cls = el.className && typeof el.className === 'string'
    ? el.className.split(/\s+/).filter(Boolean).slice(0, 3).map((c) => `.${c}`).join('')
    : '';
  const id = el.id ? `#${el.id}` : '';
  // Walk up to find the closest section/article/main with an id or className for context
  let ctx = '';
  for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
    if (node.id) { ctx = `${node.tagName.toLowerCase()}#${node.id} `; break; }
    if (typeof node.className === 'string' && /(section|hero|band|article|projpage|home-|intro|popular|podcast|advent|papers|talks|triplets|article-foot)/.test(node.className)) {
      const c = node.className.split(/\s+/).filter(Boolean)[0];
      ctx = `.${c} `;
      break;
    }
  }
  return `${ctx}${tag}${id}${cls}`.trim();
};

export default function CopyEditor() {
  const [active, setActive] = useState(false);
  // When true, links work normally and text editing is paused. Toggle via the
  // panel button or pressing `L` while edit mode is open.
  const [followLinks, setFollowLinks] = useState(false);
  const [edits, setEdits] = useState([]); // [{ page, where, before, after }]
  const [hoverEl, setHoverEl] = useState(null);
  const [editingEl, setEditingEl] = useState(null);
  const [savedBefore, setSavedBefore] = useState(null);
  const [savedContentEditable, setSavedContentEditable] = useState(null);
  const [toast, setToast] = useState(null);
  const panelRef = useRef(null);

  // Persisted "I've reviewed this" set across reloads.
  // Stored in localStorage; key per element = page + selector + text snippet.
  const REVIEWED_LS_KEY = 'copyeditor.reviewed.v1';
  const [reviewed, setReviewed] = useState(() => new Set());
  // Bump to trigger a re-apply of data-reviewed attributes when needed.
  const [reviewedTick, setReviewedTick] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(REVIEWED_LS_KEY);
      if (raw) setReviewed(new Set(JSON.parse(raw)));
    } catch (_) {}
  }, []);

  const persistReviewed = (set) => {
    try { localStorage.setItem(REVIEWED_LS_KEY, JSON.stringify([...set])); }
    catch (_) {}
  };

  const keyForEl = (el) => {
    const path = (typeof window !== 'undefined') ? window.location.pathname : '';
    const text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120);
    return `${path}::${describeEl(el)}::${text}`;
  };

  const toggleReviewed = (el) => {
    if (!el || !el.hasAttribute('data-needs-review')) return;
    const k = keyForEl(el);
    setReviewed((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      persistReviewed(next);
      return next;
    });
  };

  // Apply data-reviewed attribute to flagged elements whose key is in the
  // reviewed set. Re-run on activation, on set changes, and on DOM mutations
  // (so newly-rendered elements after client-side nav get the right state).
  useEffect(() => {
    if (!active || typeof document === 'undefined') return;
    const apply = () => {
      document.querySelectorAll('[data-needs-review]').forEach((el) => {
        if (reviewed.has(keyForEl(el))) el.dataset.reviewed = '1';
        else delete el.dataset.reviewed;
      });
    };
    apply();
    const obs = new MutationObserver(() => apply());
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reviewed, reviewedTick]);

  // Mount: only set up listeners on localhost.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!HOST_OK(window.location.hostname)) return;

    const onKey = (e) => {
      const isToggle = e.shiftKey && (e.metaKey || e.ctrlKey) && (e.key === 'E' || e.key === 'e');
      if (isToggle) {
        e.preventDefault();
        setActive((a) => !a);
      }
      // While the editor is active and not inside an input/contentEditable,
      // L toggles the "follow links" submode.
      if (active && (e.key === 'L' || e.key === 'l') && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        const t = e.target;
        const inField = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
        if (!inField) {
          e.preventDefault();
          setFollowLinks((v) => !v);
        }
      }
      // R toggles "reviewed" on the hovered flagged element.
      if (active && (e.key === 'R' || e.key === 'r') && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        const t = e.target;
        const inField = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
        if (!inField) {
          // Find the nearest [data-needs-review] under the cursor.
          const el = (hoverEl && hoverEl.closest('[data-needs-review]')) ||
            document.querySelector('[data-needs-review]:hover');
          if (el) {
            e.preventDefault();
            toggleReviewed(el);
          }
        }
      }
      if (e.key === 'Escape' && active) {
        // Cancel current edit if any
        if (editingEl) {
          editingEl.textContent = savedBefore;
          finishEditing(false);
          e.preventDefault();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, editingEl, savedBefore, hoverEl]);

  // When toggled on, mark body so hover outlines kick in.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (active) {
      document.body.dataset.editMode = '1';
    } else {
      delete document.body.dataset.editMode;
      // If we leave the mode mid-edit, just cancel.
      if (editingEl && savedBefore !== null) {
        editingEl.textContent = savedBefore;
        finishEditing(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Hover / click delegation while active
  useEffect(() => {
    if (!active) return;
    const inPanel = (el) => panelRef.current && panelRef.current.contains(el);
    const editable = (el) => {
      if (!el || el.nodeType !== 1) return false;
      if (inPanel(el)) return false;
      if (el.closest('[data-edit-skip]')) return false;
      return hasDirectText(el);
    };
    const onOver = (e) => {
      if (editingEl) return;
      if (followLinks) { setHoverEl(null); return; }
      const t = e.target;
      if (editable(t)) setHoverEl(t);
      else setHoverEl(null);
    };
    const onOut = () => {
      if (!editingEl) setHoverEl(null);
    };
    const onClick = (e) => {
      const t = e.target;
      const link = t.closest && t.closest('a');

      // Follow-links submode: hand clicks back to the browser, don't edit.
      if (followLinks) return;

      // Edit submode (default): block link navigation; if Cmd/Ctrl is held,
      // the browser still opens in a new tab, which is fine.
      if (link && !(e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!editable(t)) return;
      // If clicking the currently-editing element, leave it be
      if (editingEl && t === editingEl) return;
      if (!link) {
        e.preventDefault();
        e.stopPropagation();
      }
      // If already editing something else, commit it first
      if (editingEl) finishEditing(true);
      startEditing(t);
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('click', onClick, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, editingEl, followLinks]);

  // Apply outline classes on hover/editing element via inline style — keeps
  // CSS small and avoids needing globals.css changes.
  useEffect(() => {
    const tag = (el, color) => {
      if (!el) return;
      el.style.outline = `2px solid ${color}`;
      el.style.outlineOffset = '2px';
      el.style.borderRadius = el.style.borderRadius || '2px';
      el.style.cursor = 'text';
    };
    const untag = (el) => {
      if (!el) return;
      el.style.outline = '';
      el.style.outlineOffset = '';
      el.style.cursor = '';
    };
    if (hoverEl && hoverEl !== editingEl) tag(hoverEl, '#fb923c');
    if (editingEl) tag(editingEl, '#58a6ff');
    return () => {
      if (hoverEl && hoverEl !== editingEl) untag(hoverEl);
      // don't untag editingEl here — finishEditing handles that
    };
  }, [hoverEl, editingEl]);

  const startEditing = (el) => {
    const before = el.textContent;
    setSavedBefore(before);
    setSavedContentEditable(el.contentEditable);
    el.contentEditable = 'plaintext-only';
    el.spellcheck = true;
    el.focus();
    // Move caret to end
    const sel = window.getSelection();
    sel.removeAllRanges();
    const r = document.createRange();
    r.selectNodeContents(el);
    r.collapse(false);
    sel.addRange(r);
    setEditingEl(el);

    const onKeyInEl = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        finishEditing(true);
      }
    };
    el.addEventListener('keydown', onKeyInEl);
    el.__copyEditorCleanup = () => el.removeEventListener('keydown', onKeyInEl);
  };

  const finishEditing = (commit) => {
    const el = editingEl;
    if (!el) return;
    const after = el.textContent;
    const before = savedBefore;
    if (el.__copyEditorCleanup) el.__copyEditorCleanup();
    el.contentEditable = savedContentEditable || 'inherit';
    el.style.outline = '';
    el.style.outlineOffset = '';
    el.style.cursor = '';
    if (commit && before !== null && after !== before) {
      setEdits((prev) => ([
        ...prev,
        {
          page: window.location.pathname + window.location.search + window.location.hash,
          where: describeEl(el),
          before,
          after,
        },
      ]));
    } else if (!commit && before !== null) {
      el.textContent = before;
    }
    setEditingEl(null);
    setSavedBefore(null);
    setSavedContentEditable(null);
    setHoverEl(null);
  };

  const formatEdits = () => {
    if (edits.length === 0) return '(no edits)';
    const byPage = edits.reduce((acc, e) => {
      (acc[e.page] = acc[e.page] || []).push(e);
      return acc;
    }, {});
    const out = [];
    for (const [page, list] of Object.entries(byPage)) {
      out.push(`PAGE: ${page}`);
      list.forEach((e, i) => {
        out.push(`\n[${i + 1}] ${e.where}`);
        out.push(`  was: ${JSON.stringify(e.before)}`);
        out.push(`  new: ${JSON.stringify(e.after)}`);
      });
      out.push('');
    }
    return out.join('\n').trim();
  };

  const copyAll = async () => {
    const text = formatEdits();
    try {
      await navigator.clipboard.writeText(text);
      setToast('copied');
    } catch {
      // Fallback for non-https local
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); setToast('copied'); }
      catch { setToast('copy failed'); }
      document.body.removeChild(ta);
    }
    setTimeout(() => setToast(null), 1200);
  };

  const clearAll = () => setEdits([]);

  // Render nothing if not on localhost. Use state-driven check to avoid SSR
  // mismatch — render the panel always, but it only opens on localhost.
  const [hostOk, setHostOk] = useState(false);
  useEffect(() => {
    setHostOk(typeof window !== 'undefined' && HOST_OK(window.location.hostname));
  }, []);

  // Count of `[data-needs-review]` markers on the current page. Re-counted
  // whenever the editor opens so the panel knows how many AI-stub spots
  // remain on this view.
  const [needsCount, setNeedsCount] = useState(0);
  useEffect(() => {
    if (!active || typeof document === 'undefined') return;
    const count = () => setNeedsCount(document.querySelectorAll('[data-needs-review]').length);
    count();
    const t = setInterval(count, 800);
    return () => clearInterval(t);
  }, [active]);

  const jumpToNextReview = () => {
    // Only the unreviewed ones are interesting to jump to.
    const list = Array.from(document.querySelectorAll('[data-needs-review]:not([data-reviewed])'));
    if (list.length === 0) return;
    const y = window.scrollY + 80;
    const next = list.find((el) => el.getBoundingClientRect().top + window.scrollY > y) || list[0];
    next.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Counts derived from current DOM + reviewed set.
  const unreviewedCount = Math.max(0, needsCount - reviewed.size);

  const copyReviewedList = async () => {
    if (reviewed.size === 0) return;
    const lines = [...reviewed].sort().map((k) => `- ${k}`);
    const text = `REVIEWED (${reviewed.size})\n${lines.join('\n')}`;
    try { await navigator.clipboard.writeText(text); setToast('copied'); }
    catch { setToast('copy failed'); }
    setTimeout(() => setToast(null), 1200);
  };

  const clearReviewed = () => {
    setReviewed(new Set());
    try { localStorage.removeItem(REVIEWED_LS_KEY); } catch (_) {}
    setReviewedTick((n) => n + 1);
  };

  if (!hostOk) return null;
  if (!active) return null;

  return (
    <div
      ref={panelRef}
      data-edit-skip
      style={{
        position: 'fixed',
        right: 18,
        bottom: 18,
        zIndex: 9999,
        width: 320,
        maxHeight: '60vh',
        overflow: 'auto',
        background: 'rgba(13, 17, 23, 0.96)',
        color: '#e6edf3',
        border: '1px solid #21262d',
        borderRadius: 8,
        padding: '12px 14px',
        boxShadow: '0 16px 48px -16px rgba(0,0,0,0.6)',
        fontFamily: 'var(--mono, monospace)',
        fontSize: 12,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ color: '#b1bac4', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          Copy editor · {edits.length} {edits.length === 1 ? 'edit' : 'edits'}
        </span>
        {needsCount > 0 && (
          <button
            onClick={jumpToNextReview}
            style={{
              ...btnStyle,
              borderColor: unreviewedCount > 0 ? '#ef4444' : '#4ade80',
              color: unreviewedCount > 0 ? '#ef4444' : '#4ade80',
              fontSize: 10,
              padding: '3px 7px',
              marginLeft: 8,
            }}
            title="Jump to next unreviewed flagged element"
          >
            {unreviewedCount > 0
              ? `${unreviewedCount} flagged ↓`
              : `✓ all ${needsCount} reviewed`}
          </button>
        )}
        <button
          onClick={() => setActive(false)}
          style={{
            background: 'transparent',
            border: 0,
            color: '#6e7681',
            cursor: 'pointer',
            fontSize: 16,
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div style={{ color: '#6e7681', marginBottom: 10, lineHeight: 1.45 }}>
        Hover any text and click to edit. <kbd style={kbdStyle}>Enter</kbd> commits, <kbd style={kbdStyle}>Esc</kbd> cancels.
        Hover a red <span style={{ color: '#ef4444' }}>needs-review</span> element and press <kbd style={kbdStyle}>R</kbd> to mark it reviewed (persists across reloads).
        Toggle the panel with <kbd style={kbdStyle}>⌘/Ctrl</kbd>+<kbd style={kbdStyle}>⇧</kbd>+<kbd style={kbdStyle}>E</kbd>.
      </div>

      {reviewed.size > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button
            onClick={copyReviewedList}
            style={{ ...btnStyle, flex: 1, borderColor: '#4ade80', color: '#4ade80' }}
            title="Copy the list of reviewed keys to clipboard"
          >
            {toast || `Copy reviewed (${reviewed.size})`}
          </button>
          <button
            onClick={clearReviewed}
            style={btnStyle}
            title="Forget all reviewed marks"
          >
            Reset
          </button>
        </div>
      )}

      <button
        onClick={() => setFollowLinks((v) => !v)}
        style={{
          ...btnStyle,
          width: '100%',
          marginBottom: 8,
          borderColor: followLinks ? '#a3e635' : '#21262d',
          color: followLinks ? '#a3e635' : '#b1bac4',
        }}
      >
        {followLinks ? '⏵ Follow-links ON — click anywhere to navigate' : '⏸ Follow-links OFF — links are inert'}
        <span style={{ color: '#6e7681', marginLeft: 8 }}>
          (<kbd style={kbdStyle}>L</kbd>)
        </span>
      </button>

      {edits.length > 0 && (
        <div style={{ borderTop: '1px solid #21262d', paddingTop: 8, marginBottom: 8 }}>
          {edits.map((e, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ color: '#6e7681' }}>{e.page}</div>
              <div style={{ color: '#a78bfa' }}>{e.where}</div>
              <div style={{ color: '#8b949e', textDecoration: 'line-through', whiteSpace: 'pre-wrap' }}>
                {e.before.length > 80 ? e.before.slice(0, 80) + '…' : e.before}
              </div>
              <div style={{ color: '#a3e635', whiteSpace: 'pre-wrap' }}>
                {e.after.length > 80 ? e.after.slice(0, 80) + '…' : e.after}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={copyAll}
          disabled={edits.length === 0}
          style={{ ...btnStyle, borderColor: edits.length ? '#58a6ff' : '#21262d', color: edits.length ? '#58a6ff' : '#6e7681' }}
        >
          {toast || `Copy ${edits.length || ''}`}
        </button>
        <button
          onClick={clearAll}
          disabled={edits.length === 0}
          style={btnStyle}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

const btnStyle = {
  background: 'transparent',
  border: '1px solid #21262d',
  color: '#b1bac4',
  borderRadius: 4,
  padding: '6px 10px',
  fontFamily: 'inherit',
  fontSize: 11,
  cursor: 'pointer',
};

const kbdStyle = {
  fontFamily: 'inherit',
  fontSize: 10,
  background: '#161b22',
  border: '1px solid #21262d',
  borderRadius: 3,
  padding: '1px 5px',
  margin: '0 2px',
};
