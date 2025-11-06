export function patch(el, patchObj) {
  return Object.assign(el, patchObj);
}

export function setGeometry(el, { x, y, width, height, rotation }) {
  if (x != null) el.x = x;
  if (y != null) el.y = y;
  if (width != null) el.width = Math.max(20, width);
  if (height != null) el.height = Math.max(20, height);
  if (rotation != null) el.rotation = rotation;
}

export function setContent(el, content) {
  el.content = content ?? "";
}
