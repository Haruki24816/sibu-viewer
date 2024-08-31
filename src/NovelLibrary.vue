<script setup>
import { ref, computed } from "vue"
import { store } from "./store"

const filterCategory = ref("tags")
const searchText = ref("")
const filter = ref("select")

const filters = computed(() => {
  let data = undefined
  if (filterCategory.value == "folder") {
    data = store.getFiltersFolder(store.novelPlaylist)
  }
  if (filterCategory.value == "source") {
    data = store.getFiltersSource(store.novelPlaylist)
  }
  if (filterCategory.value == "tags") {
    data = store.getFiltersTags(store.novelPlaylist)
  }
  if (filterCategory.value == "pixivUser") {
    data = store.getFiltersPixivUser(store.novelPlaylist)
  }
  if (filterCategory.value == "userName") {
    data = store.getFiltersUserName(store.novelPlaylist)
  }
  if (filterCategory.value == "delete") {
    data = store.getFiltersDelete(store.novelPlaylist)
  }
  if (searchText.value != "") {
    for (const filterKey in data) {
      if (!filterKey.includes(searchText.value)) {
        delete data[filterKey]
      }
    }
  }
  return data
})

function filtering() {
  if (filter.value == "select") {
    return
  }
  if (filterCategory.value == "folder") {
    store.novelPlaylist = store.filterFolder(store.novelPlaylist, filter.value)
  }
  if (filterCategory.value == "source") {
    store.novelPlaylist = store.filterSource(store.novelPlaylist, filter.value)
  }
  if (filterCategory.value == "tags") {
    store.novelPlaylist = store.filterTags(store.novelPlaylist, filter.value)
  }
  if (filterCategory.value == "pixivUser") {
    store.novelPlaylist = store.filterPixivUser(store.novelPlaylist, filter.value)
  }
  if (filterCategory.value == "userName") {
    store.novelPlaylist = store.filterUserName(store.novelPlaylist, filter.value)
  }
  if (filterCategory.value == "delete") {
    store.novelPlaylist = store.filterDelete(store.novelPlaylist, filter.value)
  }
}
</script>

<template>
  <div class="library-form">
    <select v-model="filterCategory" @change="filter = 'select'">
      <option value="folder">フォルダー</option>
      <option value="source">ソース</option>
      <option value="tags">タグ</option>
      <option value="pixivUser">ピクシブユーザー</option>
      <option value="userName">ユーザーネーム</option>
      <option value="delete">削除</option>
    </select>
    <select v-model="filter">
      <option value="select">選択</option>
      <option v-for="(data, filter) in filters" :value="filter">{{ data.filterName }}（{{ data.count }}件）</option>
    </select>
    <input type="text" v-model="searchText" @input="filter = 'select'">
    <button @click="filtering(); filter = 'select'">絞り込み</button>
    <button @click="store.resetPlaylist(); filter = 'select'">解除</button>
  </div>
  <div v-for="playlistContent in store.novelPlaylist">
    <div>{{ store.getRecordData(playlistContent).title }}</div>
    <div>{{ store.getRecordData(playlistContent).authorName }}</div>
  </div>
</template>

<style scoped>
.library-form>select {
  width: 100px;
  margin-right: 5px;
  margin-bottom: 5px;
  cursor: pointer;
}

.library-form>input {
  width: 100px;
  margin-right: 5px;
  margin-bottom: 5px;
}

.library-form>button {
  margin-right: 5px;
  margin-bottom: 5px;
  cursor: pointer;
}
</style>
