<template>
  <aside class="layers-panel">
    <h3 class="title">Layers</h3>

    <div v-if="!elements.length" class="empty">No layers yet</div>

    <div
      v-for="(el, index) in [...elements].slice().reverse()"
      :key="el.id"
      class="layer-item"
      :class="{
        selected: selectedIds.includes(el.id),
        locked: el.locked,
        hidden: el.hidden
      }"
      @click="$emit('select', el.id)"
    >
      <div class="info">
        <span class="index">#{{ elements.length - index }}</span>
        <span class="type">
          {{ el.type.charAt(0).toUpperCase() + el.type.slice(1) }}
        </span>
      </div>

      <div class="actions">
        <button
          class="icon-btn"
          title="Lock / Unlock"
          @click.stop="$emit('toggle-lock', el.id)"
        >
          {{ el.locked ? "🔒" : "🔓" }}
        </button>

        <button
          class="icon-btn"
          title="Hide / Show"
          @click.stop="$emit('toggle-visibility', el.id)"
        >
          {{ el.hidden ? "🙈" : "👁️" }}
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  elements: { type: Array, required: true },
  selectedIds: { type: Array, required: true },
});
defineEmits(["select", "toggle-lock", "toggle-visibility"]);
</script>

<style scoped>
.layers-panel {
  width: 220px;
  background: #f3f4f6;
  border-left: 1px solid #d1d5db;
  padding: 10px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.title {
  font-weight: 700;
  font-size: 14px;
  color: #111827;
  margin-bottom: 8px;
}

.empty {
  color: #6b7280;
  font-size: 13px;
  text-align: center;
  padding: 20px 0;
}

.layer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 4px 6px;
  margin-bottom: 6px;
  cursor: pointer;
  transition: background 0.15s ease;
}
.layer-item:hover {
  background: #e5e7eb;
}
.layer-item.selected {
  background: #e0e7ff;
  border-color: #6366f1;
}
.layer-item.locked {
  opacity: 0.6;
}
.layer-item.hidden {
  opacity: 0.4;
}

.info {
  display: flex;
  gap: 8px;
  font-size: 13px;
  color: #111827;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
}
.icon-btn:hover {
  opacity: 0.7;
}
</style>
