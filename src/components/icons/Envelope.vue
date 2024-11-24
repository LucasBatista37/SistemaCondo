<template>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      :height="height"
      :width="width"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M3 7l9 6 9-6M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z"
      />
    </svg>
  </template>
  
  <script>
  export default {
    name: "Envelope",
    props: {
      height: {
        type: String,
        default: "28px"
      },
      width: {
        type: String,
        default: "28px"
      },
      fill: {
        type: String,
        default: "#000" 
      }
    }
  };
  </script>
  