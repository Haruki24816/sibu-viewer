<script setup>
import { ref } from "vue"
import { getDirectoryStructure } from "./getDirectoryStructure"
import { store } from "./store"
import LibrarySide from "./LibrarySide.vue"

const libraryDisplay = ref("right") // full, left, right, none

async function onDrop(event) {
  event.preventDefault()
  event.stopPropagation()
  const structure = await getDirectoryStructure(event.dataTransfer)
  store.loadFolders(structure)
}
</script>

<template>
  <div @dragover.prevent @drop="onDrop">
    <div v-show="libraryDisplay == 'full'" class="library">
      <div>
        <button @click="libraryDisplay = 'left'">左へ</button>
        <button @click="libraryDisplay = 'right'">右へ</button>
        <button @click="libraryDisplay = 'none'">非表示</button>
      </div>
      library
    </div>
    <div v-show="libraryDisplay != 'full'" class="viewer" :class="{ 'viewer-reverse': (libraryDisplay == 'right') }">
      <div v-show="libraryDisplay != 'none'" class="library-side">
        <div>
          <button @click="libraryDisplay = 'full'">最大化</button>
          <button v-show="libraryDisplay != 'left'" @click="libraryDisplay = 'left'">左へ</button>
          <button v-show="libraryDisplay != 'right'" @click="libraryDisplay = 'right'">右へ</button>
          <button @click="libraryDisplay = 'none'">非表示</button>
        </div>
        <LibrarySide />
      </div>
      <div class="viewer-content">
        <div>
          <button v-show="libraryDisplay == 'none'" @click="libraryDisplay = 'left'">ライブラリ</button>
        </div>
        ビューアー
      </div>
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
}

button {
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
</style>

<style scoped>
.library {
  max-width: 600px;
  padding: 10px;
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
  padding: 10px;
}

.viewer-content {
  flex-grow: 1;
  background-color: lightgray;
}
</style>
