import { baseElement, ElementTypes } from "../elements.types";

export function makeDefaultText(id) {
  return {
    ...baseElement,
    id,
    type: ElementTypes.TEXT,
    content: "Double click to edit",
    color: "#111827",
    fontFamily: "Inter, system-ui, Arial",
    fontSize: 24,
    bold: false,
    italic: false,
    underline: false,
  };
}

