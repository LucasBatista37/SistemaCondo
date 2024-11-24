<template>
  <svg
    :height="height"
    :width="width"
    :fill="fill"
    viewBox="0 0 24 24"
  >
    <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"></path>
  </svg>
</template>

<script>
export default {
  name: "IconeUsuario",
  props: {
    fill: {
      type: String,
      default: "#ffffff"
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
