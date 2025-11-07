export function styleFor(item) {
  const base = {
    position: "absolute",
    left: `${item.x}px`,
    top: `${item.y}px`,
    width: `${item.width}px`,
    height: `${item.height}px`,
    transform: `rotate(${item.rotation}deg)`,
    opacity: item.opacity ?? 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: item.locked ? "not-allowed" : "move",
    pointerEvents: item.locked ? "none" : "auto",
  };

  if (item.type === "text") {
    Object.assign(base, {
      lineHeight: "1.2",
      whiteSpace: "pre-wrap",
      textAlign: "center",
      color: item.color,
      fontFamily: item.fontFamily,
      fontSize: `${item.fontSize}px`,
      fontWeight: item.bold ? "700" : "400",
      fontStyle: item.italic ? "italic" : "normal",
      textDecoration: item.underline ? "underline" : "none",
    });
  }

  if (item.type === "shape") {
    const shapeStyles = {};

    if (item.shapeType === "circle") {
      shapeStyles.borderRadius = "50%";
      shapeStyles.overflow = "hidden";
    } else if (item.shapeType === "triangle") {
      shapeStyles.borderRadius = "0";
      shapeStyles.overflow = "visible";
    } else {
      shapeStyles.borderRadius = `${item.borderRadius || 0}px`;
      shapeStyles.overflow = "hidden";
    }

    Object.assign(base, shapeStyles);
  }

  return base;
}
