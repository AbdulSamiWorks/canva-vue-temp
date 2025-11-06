<template>
  <section
    class="canvas"
    ref="canvasRoot"
    tabindex="0"
    @keydown="onKeyDown"
    @mousedown.self="clearSelection"
  >
    <div
      v-for="item in elements"
      :key="item.id"
      v-show="!item.hidden"
      class="cvs-item"
      :class="{
        selected: selectedIds.includes(item.id),
        locked: item.locked,
        editing: editingId === item.id,
      }"
      :data-id="item.id"
      :style="styleFor(item)"
      @dblclick.stop="enableEdit($event, item)"
    >
      <component
        :is="getComponent(item.type)"
        :item="item"
        :editing-id="editingId"
        :triangle-points="trianglePoints"
        @input="onInput($event, item)"
        @focus="moveCaretToEnd($event)"
        @blur="disableEdit($event, item)"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from "vue";
import { useMoveable } from "../../composables/useMoveable";
import { useSelecto } from "../../composables/useSelecto";
import { setSelection } from "../../modules/elements/elements.store";
import TextNode from "./nodes/TextNode.vue";
import ShapeNode from "./nodes/ShapeNode.vue";
import ImageNode from "./nodes/ImageNode.vue";

const props = defineProps({
  elements: { type: Array, required: true },
  selectedIds: { type: Array, required: true },
});

const emit = defineEmits([
  "update:selectedIds",
  "delete",
  "update:content",
  "update:geometry",
]);

const canvasRoot = ref(null);
const editingId = ref(null);
let mv = null;

const componentMap = {
  text: TextNode,
  shape: ShapeNode,
  image: ImageNode,
};

function getComponent(type) {
  return componentMap[type] || null;
}

function onKeyDown(e) {
  if (editingId.value !== null) return;
  if (e.key === "Delete" || e.key === "Backspace") {
    e.preventDefault();
    emit("delete");
  }
}

function styleFor(item) {
  const base = {
    position: "absolute",
    left: item.x + "px",
    top: item.y + "px",
    width: item.width + "px",
    height: item.height + "px",
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
      fontSize: item.fontSize + "px",
      fontWeight: item.bold ? "700" : "400",
      fontStyle: item.italic ? "italic" : "normal",
      textDecoration: item.underline ? "underline" : "none",
    });
  }

  if (item.type === "shape") {
    Object.assign(base, {
      overflow: "hidden",
      borderRadius:
        item.shapeType === "circle" ? "50%" : (item.borderRadius || 0) + "px",
    });
  }

  return base;
}

onMounted(() => {
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
});

function clearSelection() {
  setSelection([]);
  emit("update:selectedIds", []);
}

function enableEdit(evt, item) {
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
}

function disableEdit(evt, item) {
  editingId.value = null;
  if (mv) {
    mv.instance.draggable = true;
    mv.instance.resizable = true;
    mv.instance.rotatable = true;
  }
  emit("update:content", { id: item.id, content: evt.currentTarget.innerText });
}

function moveCaretToEnd(evt) {
  const el = evt.currentTarget;
  requestAnimationFrame(() => {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });
}

function onInput(evt) {
  evt.currentTarget.dataset.temp = evt.currentTarget.innerText;
}

const trianglePoints = "50,0 100,100 0,100";
</script>

<style scoped>
.canvas {
  position: relative;
  flex: 1;
  background: var(--bg-2, #f9fafb);
  overflow: hidden;
  outline: none;
}

.cvs-item {
  position: absolute;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 4px;
  user-select: none;
  transition: box-shadow 0.15s ease;
}

.cvs-item.selected {
  border-color: var(--focus, #4f46e5);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2) inset;
}

.cvs-item.locked {
  cursor: not-allowed;
  opacity: 0.6;
  pointer-events: none;
}
</style>
