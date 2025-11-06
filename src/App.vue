<template>
  <section class="app">
    <TopBar
      :has-selection="selectedIds.length > 0"
      :styleState="currentStyle"
      @apply-style="applyPatchToSelection"
      @delete-selected="deleteFromTopBar"
    />

    <div class="body">
      <LeftMenu
        @add-text="addTextElement"
        @add-shape="addShapeElement"
        @add-image="addImageElement"
        @move-layer="moveLayer"
        @bring-front="bringToFront"
        @send-back="sendToBack"
      />

      <CanvasArea
        :elements="elements"
        :selectedIds="selectedIds"
        @update:selectedIds="(ids) => (selectedIds = ids)"
        @update:content="updateContent"
        @update:geometry="updateGeometry"
        @delete="deleteSelected"
      />

      <LayersPanel
        :elements="elements"
        :selectedIds="selectedIds"
        @select="(id) => (selectedIds = [id])"
        @toggle-lock="toggleLock"
        @toggle-visibility="toggleVisibility"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import TopBar from "./components/layout/TopBar.vue";
import LeftMenu from "./components/layout/LeftMenu.vue";
import CanvasArea from "./components/canvas/CanvasArea.vue";
import LayersPanel from "./components/layers/LayersPanel.vue";

import {
  state as elementsState,
  addTextElement,
  addShapeElement,
  addImageElement,
  applyPatchToSelection,
  deleteByIds,
  updateContentById,
  updateGeometryById,
  moveLayer,
  bringToFront,
  sendToBack,
  toggleLock,
  toggleVisibility,
} from "./modules/elements/elements.store";

const elements = elementsState.items;
const selectedIds = elementsState.selectedIds;

function deleteSelected() {
  if (!selectedIds.value.length) return;
  deleteByIds(selectedIds.value);
}

function deleteFromTopBar() {
  if (!selectedIds.value.length) return;
  deleteByIds(selectedIds.value);
}

function updateContent(payload) {
  updateContentById(payload.id, payload.content);
}

function updateGeometry(payload) {
  updateGeometryById(payload.id, payload);
}

const currentStyle = computed(() => {
  if (!selectedIds.value.length) return null;

  const el = elements.value.find((e) => e.id === selectedIds.value[0]);
  if (!el) return null;

  if (el.locked) return null;

  return {
    type: el.type,
    shapeType: el.shapeType,
    fontFamily: el.fontFamily,
    fontSize: el.fontSize,
    color: el.color,
    bold: el.bold,
    italic: el.italic,
    underline: el.underline,
    fill: el.fill,
    stroke: el.stroke,
    strokeWidth: el.strokeWidth,
    borderRadius: el.borderRadius,
    opacity: el.opacity,
  };
});

</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f9fafb;
}

.body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
