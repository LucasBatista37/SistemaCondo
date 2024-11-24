<template>
  <svg
    :height="height"
    :width="width"
    :fill="fill"
    x="0px"
    y="0px"
    viewBox="0 0 24 24"
    style="enable-background:new 0 0 24 24;"
    xml:space="preserve"
  >
    <!-- User icon -->
    <circle cx="12" cy="7" r="4" />
    <path d="M12,14c-5,0-9,2.686-9,6v1h18v-1C21,16.686,17,14,12,14z" />

    <!-- Add icon -->
    <rect x="19" y="10" width="2" height="6" />
    <rect x="17" y="12" width="6" height="2" />
  </svg>
</template>

<script>
export default {
  name: "add-user-icon",
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

<style>

</style>
