import { PaperEditor } from './editor';
import { SectionExplorer } from './explorer';
import { GreenLab } from './green';
import { PostInkLab } from './post-ink';

// Loaded on demand by window.devTools.show() (lib/paper/runtime.js).
export function mountDevTools(runtime) {
  const editor = new PaperEditor({ runtime });
  const green = new GreenLab({ runtime });
  const postInk = new PostInkLab({ runtime });
  const explorer = new SectionExplorer({
    editor,
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
  };
}
