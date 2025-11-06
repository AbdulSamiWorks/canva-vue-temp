import { baseElement, ElementTypes } from "../elements.types";

export function makeDefaultImage(id, src) {
  return {
    ...baseElement,
    id,
    type: ElementTypes.IMAGE,
    src,
    width: 240,
    height: 180,
    opacity: 1,
  };
}
