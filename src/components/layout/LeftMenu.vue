<template>
  <aside class="leftmenu">
    <div class="group">
      <div class="title">Add Elements</div>

      <button class="btn" @click="$emit('add-shape', 'rectangle')">
        Add Rectangle
      </button>
      <button class="btn" @click="$emit('add-shape', 'circle')">
        Add Circle
      </button>
      <button class="btn" @click="$emit('add-shape', 'triangle')">
        Add Triangle
      </button>

      <div class="divider"></div>

      <button class="btn" @click="$emit('add-text')">Add Text</button>

      <div class="divider"></div>

      <label class="btn upload-btn">
        Upload Image
        <input type="file" accept="image/*" hidden @change="onFileChange" />
      </label>
    </div>

    <div class="group">
      <div class="title">Layer Controls</div>
      <button class="btn" @click="$emit('move-layer', 'up')">Move Up</button>
      <button class="btn" @click="$emit('move-layer', 'down')">
        Move Down
      </button>

      <div class="divider"></div>
      <button class="btn" @click="$emit('bring-front')">Bring to Front</button>
      <button class="btn" @click="$emit('send-back')">Send to Back</button>
    </div>
  </aside>
</template>

<script setup>
const emit = defineEmits([
  "add-text",
  "add-shape",
  "add-image",
  "move-layer",
  "bring-front",
  "send-back",
]);

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) emit("add-image", file);
  e.target.value = "";
}
</script>

<style scoped>
.leftmenu {
  width: 220px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.title {
  font-weight: 700;
  font-size: 14px;
  color: #111827;
  margin-bottom: 4px;
}

.group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.btn {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 6px 8px;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s ease;
}
.btn:hover {
  background: #e5e7eb;
}
.upload-btn {
  text-align: center;
  justify-content: center;
}
.divider {
  border-top: 1px solid #d1d5db;
  margin: 8px 0;
}
</style>
