<script setup>
import { ref, computed } from "vue"
import { getDirectoryStructure } from "./getDirectoryStructure"
import { store } from "./store"
import Library from "./Library.vue"

const libraryDisplay = ref(false)
const libraryRight = ref(false)
const libraryWide = ref(false)

const containerDirection = computed(() => {
  if (libraryRight.value) {
    return "row-reverse"
  } else {
    return "row"
  }
})

const viewerWidth = computed(() => {
  if (libraryWide.value) {
    return "50%"
  } else {
    return "250px"
  }
})

async function onDrop(event) {
  event.preventDefault()
  event.stopPropagation()
  const structure = await getDirectoryStructure(event.dataTransfer)
  store.loadFolders(structure)
}
</script>

<template>
  <div class="container" @dragover.prevent @drop="onDrop">
    <div v-show="libraryDisplay" class="library">
      <div class="library-buttons">
        <button @click="libraryDisplay = false">非表示</button>
        <button v-show="libraryWide" @click="libraryWide = false">狭く</button>
        <button v-show="!libraryWide" @click="libraryWide = true">広く</button>
        <button v-show="libraryRight" @click="libraryRight = false">左へ</button>
        <button v-show="!libraryRight" @click="libraryRight = true">右へ</button>
      </div>
      <Library />
    </div>
    <div class="viewer">
      <button @click="libraryDisplay = true">ライブラリー表示</button>
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
}
</style>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: v-bind("containerDirection")
}

.library {
  width: v-bind("viewerWidth");
  min-width: 250px;
  padding: 10px;
}

.library-buttons>button {
  margin-right: 5px;
  margin-bottom: 5px;
  cursor: pointer;
}

.viewer {
  flex-grow: 1;
  background-color: lightgray;
}
</style>
