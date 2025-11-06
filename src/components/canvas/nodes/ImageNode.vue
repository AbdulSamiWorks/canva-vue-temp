<template>
  <img
    :src="item.src"
    alt="uploaded"
    draggable="false"
    style="width: 100%; height: 100%; object-fit: cover"
  />
</template>

<script setup>
defineProps({ item: Object });
</script>
