import { onBeforeUnmount } from "vue";
import Moveable from "moveable";


export function useMoveable(root, { onDrag, onResize, onRotate } = {}) {
  const mv = new Moveable(root, {
    target: [],
    draggable: true,
    resizable: true,
    rotatable: true,
    origin: false,
  });

  if (onDrag) mv.on("drag", onDrag);
  if (onResize) mv.on("resize", onResize);
  if (onRotate) mv.on("rotate", onRotate);

  onBeforeUnmount(() => mv.destroy());

  return {
    setTargets(nodes) {
      mv.target = nodes;
    },
  };
}
