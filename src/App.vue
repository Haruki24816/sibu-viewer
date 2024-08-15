<script setup>
import { ref } from "vue"
import { getFiles } from "./getFiles"

const libraryDisplay = ref("right") // full, left, right, none

async function onDrop(event) {
  event.preventDefault()
  event.stopPropagation()
  const fileList = await getFiles(event.dataTransfer)
  console.log(fileList)
}
</script>

<template>
  <div @dragover.prevent @drop="onDrop">
    <div v-show="libraryDisplay == 'full'" class="library">
      library
    </div>
    <div v-show="libraryDisplay != 'full'" class="viewer" :class="{ 'viewer-reverse': (libraryDisplay == 'right') }">
      <div v-show="libraryDisplay != 'none'" class="library-side">
        library-side
      </div>
      <div class="viewer-content">
        viewer
      </div>
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
}
</style>

<style scoped>
.library {
  max-width: 600px;
  margin: auto;
}

.viewer {
  width: 100vw;
  height: 100vh;
  display: flex;
}

.viewer-reverse {
  flex-direction: row-reverse;
}

.library-side {
  width: 250px;
}

.viewer-content {
  flex-grow: 1;
  background-color: lightgray;
}
</style>
