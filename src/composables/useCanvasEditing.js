import { nextTick } from "vue";

export function useCanvasEditing(editingId, mv, emit) {
  const enableEdit = (evt, item) => {
    if (item.type !== "text" || item.locked) return;
    editingId.value = item.id;

    if (mv) {
      mv.instance.draggable = false;
      mv.instance.resizable = false;
      mv.instance.rotatable = false;
    }

    nextTick(() => {
      const node = evt.currentTarget.querySelector(".text-node");
      if (node) {
        node.focus();
        moveCaretToEnd({ currentTarget: node });
      }
    });
  };

  const disableEdit = (evt, item) => {
    editingId.value = null;

    if (mv) {
      mv.instance.draggable = true;
      mv.instance.resizable = true;
      mv.instance.rotatable = true;
    }

    emit("update:content", { id: item.id, content: evt.currentTarget.innerText });
  };

  const moveCaretToEnd = (evt) => {
    const el = evt.currentTarget;
    requestAnimationFrame(() => {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });
  };

  const onInput = (evt) => {
    evt.currentTarget.dataset.temp = evt.currentTarget.innerText;
  };

  return { enableEdit, disableEdit, moveCaretToEnd, onInput };
}
