<template>
  <svg
    :height="height"
    :width="width"
    :fill="fill"
    viewBox="0 0 24 24"
  >
    <path d="M12 4.5C6.5 4.5 2 12 2 12s4.5 7.5 10 7.5 10-7.5 10-7.5-4.5-7.5-10-7.5zm0 12c-2.8 0-5.5-2.2-5.5-5.5S9.2 5.5 12 5.5 17.5 7.7 17.5 10 14.8 16.5 12 16.5zm0-9c-1.4 0-2.5 1.1-2.5 2.5S10.6 12 12 12s2.5-1.1 2.5-2.5S13.4 7.5 12 7.5z"></path>
  </svg>
</template>

<script>
export default {
  name: "IconeOlhoAberto",
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
