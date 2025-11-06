
import { onBeforeUnmount } from "vue";
import Moveable from "moveable";

export function useMoveable(root, handlers = {}) {
  const { onDrag, onResize, onRotate, onDragStart, onResizeStart, onDragEnd, onResizeEnd } = handlers;

  const mv = new Moveable(root, {
    target: [],
    draggable: true,
    resizable: true,
    rotatable: true,
    origin: false,
    keepRatio: false,
    edge: false,
  });


  if (onDragStart) mv.on("dragStart", onDragStart);
  if (onDrag) mv.on("drag", onDrag);
  if (onDragEnd) mv.on("dragEnd", onDragEnd);

  if (onResizeStart) mv.on("resizeStart", onResizeStart);
  if (onResize) mv.on("resize", onResize);
  if (onResizeEnd) mv.on("resizeEnd", onResizeEnd);

  if (onRotate) mv.on("rotate", onRotate);


  onBeforeUnmount(() => mv.destroy());


  return {
    
    setTargets(nodes) {
      mv.target = nodes;
    },
    instance: mv,
  };
}
