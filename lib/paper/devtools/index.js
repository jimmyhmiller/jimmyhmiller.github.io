import { PaperEditor } from './editor';
import { SectionExplorer } from './explorer';
import { GreenLab } from './green';

// Loaded on demand by window.devTools.show() (lib/paper/runtime.js).
export function mountDevTools(runtime) {
  const editor = new PaperEditor({ runtime });
  const green = new GreenLab({ runtime });
  const explorer = new SectionExplorer({
    editor,
    environment: () => ({
      lighting: structuredClone(runtime.settings),
      paletteBalance: runtime.balance,
      podcastGreen: structuredClone(runtime.green),
    }),
  });
  return {
    editor,
    explorer,
    green,
    close() {
      editor.open(false);
      explorer.open(false);
    },
  };
}
