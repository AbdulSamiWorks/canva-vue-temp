import { onBeforeUnmount } from "vue";
import Selecto from "selecto";

export function useSelecto(container, onSelectIds) {
  const sel = new Selecto({
    container,
    selectableTargets: [".cvs-item"],
    selectByClick: true,
    selectFromInside: false,
    hitRate: 0,
  });

  sel.on("selectEnd", (e) => {
    const ids = e.selected.map((el) => Number(el.dataset.id));
    onSelectIds?.(ids);
  });

  onBeforeUnmount(() => sel.destroy());
}
