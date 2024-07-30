<script lang="ts" setup></script>

<template>
  <header></header>
  <div class="flex flex-col w-screen h-screen">
    <div class="flex h-16 bg-navy drop-shadow-md">
      <div class="text-xl self-center pl-5 text-white font-medium">
        MQTT Topic Designer
      </div>
    </div>

    <div>
      <RouterView />
    </div>
  </div>

  <main></main>
</template>

<style scoped></style>
