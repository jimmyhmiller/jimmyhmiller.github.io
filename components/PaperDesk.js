import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';

// One WebGL paper scene for the whole site. The canvas and the page content
// share a grid cell; the scene draws materials and light beneath real DOM
// text. It survives client-side navigation: after every route change the
// page's `[data-paper]` elements are re-read instead of recompiling shaders.

export const PaperContext = createContext(null);

// Layout effects run before paint, so paper and DOM change in the same frame.
// The server has no layout; this avoids React's SSR warning there.
export const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function usePaper() {
  const paper = useContext(PaperContext);
  if (!paper) throw new Error('usePaper must be used inside <PaperDesk>');
  return paper;
}

export default function PaperDesk({ children }) {
  const canvasRef = useRef(null);
  const rootRef = useRef(null);
  const runtimeRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    import('../lib/paper/runtime')
      .then(({ PaperRuntime }) => {
        if (cancelled) return;
        runtimeRef.current = new PaperRuntime({ canvas: canvasRef.current, root: rootRef.current });
      })
      .catch((error) => {
        // Reveal the readable HTML fallback rather than leaving the page hidden.
        document.documentElement.removeAttribute('data-paper-boot');
        document.documentElement.dataset.lighting = 'unavailable';
        console.error(error);
      });
    return () => {
      cancelled = true;
      runtimeRef.current?.destroy();
      runtimeRef.current = null;
    };
  }, []);

  // Child layout effects run first, so the new page's DOM is committed here.
  useBrowserLayoutEffect(() => {
    runtimeRef.current?.refresh();
  }, [router.asPath]);

  const refresh = useCallback(() => runtimeRef.current?.refresh(), []);
  const openLighting = useCallback(() => {
    if (!runtimeRef.current) return;
    runtimeRef.current.openLighting();
  }, []);
  // Swaps content and its paper together (PaperRuntime.transition).
  const transition = useCallback((update) => {
    const runtime = runtimeRef.current;
    return runtime ? runtime.transition(update) : Promise.resolve(update());
  }, []);
  const value = useMemo(() => ({ refresh, openLighting, transition }), [refresh, openLighting, transition]);

  return (
    <PaperContext.Provider value={value}>
      <div className="paper-desk">
        <canvas ref={canvasRef} id="paper-lighting" aria-hidden="true" />
        {/* The paper grain over the unlit page, below the content (lib/paper/fallback.js). */}
        <div id="paper-grain" className="paper-grain" aria-hidden="true" />
        <div ref={rootRef} className="site-content">
          {children}
        </div>
      </div>
    </PaperContext.Provider>
  );
}
