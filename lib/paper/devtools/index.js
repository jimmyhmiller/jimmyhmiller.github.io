import { PaperEditor } from './editor';
import { SectionExplorer } from './explorer';
import { GreenLab } from './green';
import { PostInkLab } from './post-ink';

// Loaded on demand by window.devTools.show() (lib/paper/runtime.js). Every
// document and runtime listener the tools add ends with `signal`, so
// destroy() leaves nothing bound to a runtime that is being replaced.
export function mountDevTools(runtime) {
  const controller = new AbortController();
  const { signal } = controller;
  const editor = new PaperEditor({ runtime, signal });
  const green = new GreenLab({ runtime, signal });
  const postInk = new PostInkLab({ runtime, signal });
  const explorer = new SectionExplorer({
    editor,
    signal,
    environment: () => ({
      lighting: structuredClone(runtime.settings),
      paletteBalance: runtime.balance,
      podcastGreen: structuredClone(runtime.green),
      postInk: runtime.postInk,
    }),
  });
  return {
    editor,
    explorer,
    green,
    postInk,
    close() {
      editor.open(false);
      explorer.open(false);
    },
    destroy() {
      controller.abort();
      for (const tool of [explorer, postInk, green, editor]) tool.destroy();
    },
  };
}
