import { ref } from "vue";
import { makeDefaultText } from "./text/text.defaults";
import { makeDefaultShape } from "./shapes/shapes.defaults";
import { makeDefaultImage } from "./images/images.defaults";
import { patch, setGeometry, setContent } from "./elements.ops";



let nextId = 1;


export const state = {
  items: ref([]),
  selectedIds: ref([]), 
};


export function setSelection(ids) {
  state.selectedIds.value = Array.isArray(ids) ? ids : [];
}


export function addTextElement() {
  const id = nextId++;
  state.items.value.push(makeDefaultText(id));
  setSelection([id]);
}

export function addShapeElement(shapeType = "rectangle") {
  const id = nextId++;
  state.items.value.push(makeDefaultShape(id, shapeType));
  setSelection([id]);
}
export function addImageElement(file) {
  if (!file) return;
  const reader = new FileReader();

  reader.onload = () => {
    const id = nextId++;
    const src = reader.result;
    state.items.value.push(makeDefaultImage(id, src));
    setSelection([id]);
  };

  reader.readAsDataURL(file);
}


export function deleteByIds(ids) {
  if (!ids?.length) return;
  state.items.value = state.items.value.filter((el) => !ids.includes(el.id));
  setSelection([]);
}

export function applyPatchToSelection(patchObj) {
  const ids = state.selectedIds.value;
  if (!ids.length) return;

  for (const el of state.items.value) {
    if (!ids.includes(el.id)) continue;
    patch(el, patchObj);
  }
}

export function updateGeometryById(id, geomPatch) {
  const el = state.items.value.find((e) => e.id === id);
  if (!el) return;
  setGeometry(el, geomPatch);
}


export function updateContentById(id, content) {
  const el = state.items.value.find((e) => e.id === id);
  if (!el) return;
  setContent(el, content);
}


export function moveLayer(direction = "up") {
  const ids = state.selectedIds.value;
  if (!ids.length) return;

  const el = state.items.value.find((e) => e.id === ids[0]);
  if (!el) return;

  const idx = state.items.value.indexOf(el);
  if (direction === "up" && idx < state.items.value.length - 1) {
    state.items.value.splice(idx, 1);
    state.items.value.splice(idx + 1, 0, el);
  } else if (direction === "down" && idx > 0) {
    state.items.value.splice(idx, 1);
    state.items.value.splice(idx - 1, 0, el);
  }
}

export function toggleLock(id) {
  const el = state.items.value.find((e) => e.id === id);
  if (el) el.locked = !el.locked;
}

export function toggleVisibility(id) {
  const el = state.items.value.find((e) => e.id === id);
  if (el) el.hidden = !el.hidden;
}

export function bringToFront() {
  const ids = state.selectedIds.value;
  if (!ids.length) return;

  const el = state.items.value.find((e) => e.id === ids[0]);
  if (!el) return;


  state.items.value = [...state.items.value.filter((e) => e.id !== el.id), el];
}

export function sendToBack() {
  const ids = state.selectedIds.value;
  if (!ids.length) return;

  const el = state.items.value.find((e) => e.id === ids[0]);
  if (!el) return;

  state.items.value = [el, ...state.items.value.filter((e) => e.id !== el.id)];
}
