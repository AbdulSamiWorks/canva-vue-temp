import { nextTick, watch } from "vue";
import { useMoveable } from "./useMoveable";
import { useSelecto } from "./useSelecto";
import { setSelection } from "../modules/elements/elements.store";

export function useCanvasInteractions(canvasRoot, props, emit) {
  let mv = null;

  const initialize = () => {
    canvasRoot.value?.focus();

    useSelecto(canvasRoot.value, (ids) => {
      const selectableIds = ids.filter((id) => {
        const el = props.elements.find((e) => e.id === id);
        return el && !el.hidden && !el.locked;
      });
      setSelection(selectableIds);
      emit("update:selectedIds", selectableIds);
    });

    mv = useMoveable(canvasRoot.value, {
      onDragStart: ({ target }) => {
        const id = Number(target.dataset.id);
        const item = props.elements.find((e) => e.id === id);
        if (item?.locked) return false;
        target.style.willChange = "left, top, transform";
      },
      onDrag: ({ target, left, top }) => {
        target.style.left = `${Math.round(left)}px`;
        target.style.top = `${Math.round(top)}px`;
      },
      onDragEnd: ({ target, lastEvent }) => {
        target.style.willChange = "auto";
        if (!lastEvent) return;
        const id = Number(target.dataset.id);
        const item = props.elements.find((e) => e.id === id);
        if (item?.locked) return;
        emit("update:geometry", {
          id,
          x: Math.round(lastEvent.left),
          y: Math.round(lastEvent.top),
        });
      },
      onResizeStart: ({ target }) => {
        const id = Number(target.dataset.id);
        const item = props.elements.find((e) => e.id === id);
        if (item?.locked) return false;
        target.style.willChange = "width, height, left, top, transform";
      },
      onResize: ({ target, width, height, drag }) => {
        target.style.width = `${Math.round(width)}px`;
        target.style.height = `${Math.round(height)}px`;
        target.style.left = `${Math.round(drag.left)}px`;
        target.style.top = `${Math.round(drag.top)}px`;
      },
      onResizeEnd: ({ target, lastEvent }) => {
        target.style.willChange = "auto";
        if (!lastEvent) return;
        const id = Number(target.dataset.id);
        const item = props.elements.find((e) => e.id === id);
        if (item?.locked) return;
        emit("update:geometry", {
          id,
          width: Math.round(lastEvent.width),
          height: Math.round(lastEvent.height),
          x: Math.round(lastEvent.drag.left),
          y: Math.round(lastEvent.drag.top),
        });
      },
      onRotateStart: ({ target }) => {
        const id = Number(target.dataset.id);
        const item = props.elements.find((e) => e.id === id);
        if (item?.locked) return false;
      },
      onRotate: ({ target, beforeRotate }) => {
        const id = Number(target.dataset.id);
        const item = props.elements.find((e) => e.id === id);
        if (item?.locked) return;
        emit("update:geometry", { id, rotation: Math.round(beforeRotate) });
      },
    });

    watch(
      () => props.selectedIds.slice(),
      async (ids) => {
        await nextTick();
        const nodes = Array.from(
          canvasRoot.value.querySelectorAll(".cvs-item")
        ).filter((el) => {
          const id = Number(el.dataset.id);
          const item = props.elements.find((e) => e.id === id);
          return ids.includes(id) && !item?.hidden && !item?.locked;
        });
        mv.setTargets(nodes);
      },
      { immediate: true }
    );
  };

  return { mv, initialize };
}
