<template>
  <div
    class="text-node"
    :contenteditable="editingId === item.id"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event, item)"
    @input="$emit('input', $event, item)"
    v-html="item.content"
  ></div>
</template>

<script setup>
defineProps({
  item: Object,
  editingId: Number,
});
</script>
