import { PaperEditor } from './editor';
import { SectionExplorer } from './explorer';
import { GreenLab } from './green';
import { PostInkLab } from './post-ink';
import { TypeEditor } from './type';

// Loaded on demand by window.devTools.show() (lib/paper/runtime.js). Every
// document and runtime listener the tools add ends with `signal`, so
// destroy() leaves nothing bound to a runtime that is being replaced.
export function mountDevTools(runtime) {
  const controller = new AbortController();
  const { signal } = controller;
  const editor = new PaperEditor({ runtime, signal });
  const green = new GreenLab({ runtime, signal });
  const postInk = new PostInkLab({ runtime, signal });
  const type = new TypeEditor({ runtime, signal });
  const explorer = new SectionExplorer({
    editor,
    signal,
    environment: () => ({
      lighting: structuredClone(runtime.settings),
      podcastGreen: structuredClone(runtime.green),
      postInk: runtime.postInk,
      typography: structuredClone(runtime.typography),
    }),
  });
  return {
    editor,
    explorer,
    green,
    postInk,
    type,
    close() {
      editor.open(false);
      explorer.open(false);
      type.open(false);
    },
    destroy() {
      controller.abort();
      for (const tool of [type, explorer, postInk, green, editor]) tool.destroy();
    },
  };
}
