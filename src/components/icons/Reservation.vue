<template>
  <svg
    :height="height"
    :width="width"
    :fill="fill"
    x="0px"
    y="0px"
    viewBox="0 0 26 26"
    style="enable-background:new 0 0 26 26;"
    xml:space="preserve"
  >
    <path d="M13 2C10.79 2 9 3.79 9 6v4H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2h-2V6c0-2.21-1.79-4-4-4zm0 2c1.1 0 2 .9 2 2v4H11V6c0-1.1.9-2 2-2zm-4 8h8v10H9V12z"></path>
    <path d="M16 20c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1z"></path>
  </svg>
</template>

<script>
export default {
  name: "ReservaIcon",
  props: {
    fill: {
      type: String,
      default: "#ffffff" 
    },
    height: {
      type: String,
      default: "20px" 
    },
    width: {
      type: String,
      default: "20px" 
    }
  }
};
</script>

<style scoped>

</style>
