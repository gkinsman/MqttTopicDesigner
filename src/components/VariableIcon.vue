<script lang="ts" setup>
const props = defineProps<{
  color?: string
}>()
</script>
<template>
  <svg
    :fill="props.color"
    height="38px"
    stroke="1px"
    viewBox="0 0 24 24"
    width="38px"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22Z"
      opacity="0.1"
      transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, 0, 0)"
    />
    <text
      opacity="0.7"
      style="
        font-family: Arial, sans-serif;
        font-size: 12px;
        font-weight: 700;
        white-space: pre;
      "
      transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, 0, 0)"
      x="2.4"
      y="15.149"
    >
      { }
    </text>
  </svg>
</template>

<style scoped>
svg:hover {
  :first-child {
    opacity: 1;
  }

  :last-child {
    opacity: 1;
    fill: white;
  }
}
</style>
