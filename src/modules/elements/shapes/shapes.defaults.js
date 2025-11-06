import { baseElement, ElementTypes } from "../elements.types";

export function makeDefaultShape(id, shapeType = "rectangle") {
  return {
    ...baseElement,
    id,
    type: ElementTypes.SHAPE,
    shapeType, 
    fill: "#ff002fff",
    stroke: "#05fe3bff",
    strokeWidth: 2,
  };
}
