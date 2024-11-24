<template>
  <svg
    :height="height"
    :width="width"
    :fill="fill"
    viewBox="0 0 24 24"
  >
    <path d="M15.88 1.29c-.39 0-.76.15-1.04.43l-1.39 1.39-2.93 2.93-1.09-1.09c-.39-.39-1.02-.39-1.41 0l-4.57 4.57c-.39.39-.39 1.02 0 1.41l1.09 1.09-2.93 2.93-1.39 1.39c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.39-1.39 2.93-2.93 1.09 1.09c.39.39 1.02.39 1.41 0l4.57-4.57c.39-.39.39-1.02 0-1.41l-1.09-1.09 2.93-2.93 1.39-1.39c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0z"></path>
  </svg>
</template>

<script>
export default {
  name: "IconeChave",
  props: {
    fill: {
      type: String,
      default: "#ffff"
    },
    height: {
      type: String,
      default: "24px"
    },
    width: {
      type: String,
      default: "24px"
    }
  }
};
</script>

<style scoped>
</style>
