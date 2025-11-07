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
import { ref, onMounted } from "vue";
import { setSelection } from "../../modules/elements/elements.store";
import { styleFor } from "../../utils/styleFor.js";
import { useCanvasInteractions } from "../../composables/useCanvasInteractions.js";
import { useCanvasEditing } from "../../composables/useCanvasEditing.js";
import { componentMap } from "../../config/componentMap.js";

const trianglePoints = "50,0 100,100 0,100";

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

const { mv, initialize } = useCanvasInteractions(canvasRoot, props, emit);
const { enableEdit, disableEdit, moveCaretToEnd, onInput } = useCanvasEditing(
  editingId,
  mv,
  emit
);

onMounted(() => initialize());

const getComponent = (type) => componentMap[type] || null;

const onKeyDown = (e) => {
  if (editingId.value !== null) return;
  if (["Delete", "Backspace"].includes(e.key)) {
    e.preventDefault();
    emit("delete");
  }
};

const clearSelection = () => {
  setSelection([]);
  emit("update:selectedIds", []);
};
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
