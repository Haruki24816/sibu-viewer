<script setup>
import { ref } from "vue"
import NovelLibrary from "./NovelLibrary.vue"

const currentTab = ref("illust")
</script>

<template>
  <div class="library-buttons">
    <button @click="currentTab = 'illust'">イラスト</button>
    <button @click="currentTab = 'novel'">小説</button>
    <button @click="currentTab = 'setting'">設定</button>
  </div>
  <NovelLibrary v-if="currentTab == 'novel'" />
</template>

<style scoped>
.library-buttons>button {
  margin-right: 5px;
  margin-bottom: 5px;
  cursor: pointer;
}
</style>
