<template>
  <header class="topbar">

    <div class="tools" v-if="hasSelection && styleState">
      <template v-if="styleState.type === 'text'">
        <select
          class="input"
          v-model="local.fontFamily"
          @change="commit({ fontFamily: local.fontFamily })"
        >
          <option>Inter, system-ui, Arial</option>
          <option>Arial</option>
          <option>Georgia</option>
          <option>"Times New Roman"</option>
          <option>Courier New</option>
        </select>

        <input
          class="input"
          type="number"
          min="8"
          max="200"
          v-model.number="local.fontSize"
          @change="commit({ fontSize: clamp(local.fontSize, 8, 200) })"
        />

        <input
          type="color"
          class="input color"
          v-model="local.color"
          @input="commit({ color: local.color })"
        />

        <button
          class="btn"
          :class="{ active: local.bold }"
          @click="toggle('bold')"
        >
          <b>B</b>
        </button>
        <button
          class="btn"
          :class="{ active: local.italic }"
          @click="toggle('italic')"
        >
          <i>I</i>
        </button>
        <button
          class="btn"
          :class="{ active: local.underline }"
          @click="toggle('underline')"
        >
          <u>U</u>
        </button>
      </template>

      <template v-else-if="styleState.type === 'shape'">
        <label>Fill</label>
        <input
          type="color"
          class="input color"
          v-model="local.fill"
          @input="commit({ fill: local.fill })"
        />

        <label>Stroke</label>
        <input
          type="color"
          class="input color"
          v-model="local.stroke"
          @input="commit({ stroke: local.stroke })"
        />

        <label>Stroke Width</label>
        <input
          type="number"
          class="input"
          min="0"
          max="20"
          v-model.number="local.strokeWidth"
          @change="commit({ strokeWidth: local.strokeWidth })"
        />

        <label>Border Radius</label>
        <input
          type="range"
          class="input"
          min="0"
          max="50"
          step="1"
          v-model.number="local.borderRadius"
          @input="commit({ borderRadius: local.borderRadius })"
        />

        <label>Opacity</label>
        <input
          type="range"
          class="input"
          min="0.1"
          max="1"
          step="0.05"
          v-model.number="local.opacity"
          @input="commit({ opacity: local.opacity })"
        />
      </template>

      <template v-else-if="styleState.type === 'image'">
        <label>Opacity</label>
        <input
          type="range"
          class="input"
          min="0.1"
          max="1"
          step="0.05"
          v-model.number="local.opacity"
          @input="commit({ opacity: local.opacity })"
        />
      </template>
    </div>

    <div class="right">
      <button
        class="btn danger"
        :disabled="!hasSelection"
        @click="$emit('delete-selected')"
      >
        Delete
      </button>
    </div>
  </header>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  hasSelection: { type: Boolean, default: false },
  styleState: { type: Object, default: null },
});
const emit = defineEmits(["add-text", "apply-style", "delete-selected"]);

const local = reactive({
  fontFamily: "Inter, system-ui, Arial",
  fontSize: 24,
  color: "#111827",
  bold: false,
  italic: false,
  underline: false,
  fill: "#4f46e5",
  stroke: "#111827",
  strokeWidth: 2,
  borderRadius: 0,
  opacity: 1,
});

watch(
  () => props.styleState,
  (s) => {
    if (!s) return;
    local.fontFamily = s.fontFamily ?? local.fontFamily;
    local.fontSize = s.fontSize ?? local.fontSize;
    local.color = s.color ?? local.color;
    local.bold = !!s.bold;
    local.italic = !!s.italic;
    local.underline = !!s.underline;
    local.fill = s.fill ?? local.fill;
    local.stroke = s.stroke ?? local.stroke;
    local.strokeWidth = s.strokeWidth ?? local.strokeWidth;
    local.borderRadius = s.borderRadius ?? local.borderRadius;
    local.opacity = s.opacity ?? local.opacity;
  },
  { immediate: true }
);

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function commit(patch) {
  emit("apply-style", patch);
}

function toggle(key) {
  local[key] = !local[key];
  commit({ [key]: local[key] });
}
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: #1f2937;
  color: #e5e7eb;
}
.left,
.right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.tools {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  margin-right: auto;
}
.input {
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #4b5563;
  background: #111827;
  color: #e5e7eb;
}
.input.color {
  padding: 0;
  width: 38px;
  height: 32px;
  border: none;
  background: transparent;
}
.btn {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #4b5563;
  background: #111827;
  color: #e5e7eb;
  cursor: pointer;
}
.btn.primary {
  background: #4f46e5;
  border-color: #4f46e5;
}
.btn.danger {
  background: #b91c1c;
  border-color: #b91c1c;
}
.btn.active {
  outline: 2px solid #6366f1;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
label {
  font-size: 13px;
  opacity: 0.8;
}
</style>
