<template>
  <svg width="100%" height="100%">
    <rect
      v-if="item.shapeType === 'rectangle'"
      x="0"
      y="0"
      width="100%"
      height="100%"
      :fill="item.fill"
      :stroke="item.stroke"
      :stroke-width="item.strokeWidth"
      :rx="item.borderRadius || 0"
    />
    <circle
      v-else-if="item.shapeType === 'circle'"
      cx="50%"
      cy="50%"
      r="45%"
      :fill="item.fill"
      :stroke="item.stroke"
      :stroke-width="item.strokeWidth"
    />
    <polygon
      v-else-if="item.shapeType === 'triangle'"
      :points="trianglePoints"
      :fill="item.fill"
      :stroke="item.stroke"
      :stroke-width="item.strokeWidth"
    />
  </svg>
</template>

<script setup>
defineProps({
  item: Object,
  trianglePoints: String,
});
</script>
