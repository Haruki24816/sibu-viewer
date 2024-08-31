import { reactive } from "vue"

export const store = reactive({
  folders: {},
  illustFullPlaylist: [],
  novelFullPlaylist: [],
  illustPlaylist: [],
  novelPlaylist: [],
  async loadFolders(structure) {
    for (const itemName in structure) {
      const item = structure[itemName]
      if (item instanceof File) {
        continue
      }
      let jsonName = null
      for (const itemName in item) {
        if (itemName.endsWith(".records.json")) {
          jsonName = itemName
          break
        }
      }
      if (jsonName === null) {
        continue
      }
      const records = await new Promise((resolve) => {
        const fileReader = new FileReader()
        fileReader.onload = () => {
          resolve(JSON.parse(fileReader.result))
        }
        fileReader.readAsText(item[jsonName])
      })
      delete item[jsonName]
      this.folders[records.folderId] = {
        records: records,
        files: item
      }
    }
    this.initPlaylist()
  },
  initPlaylist() {
    this.illustFullPlaylist = []
    this.novelFullPlaylist = []
    for (const folderId in this.folders) {
      const records = this.folders[folderId].records
      let playlist = undefined
      if (records.recordType == "illust") {
        playlist = this.illustFullPlaylist
      }
      if (records.recordType == "novel") {
        playlist = this.novelFullPlaylist
      }
      for (const filename in records.records) {
        playlist.push([records.folderId, filename])
      }
    }
    this.resetPlaylist()
  },
  resetPlaylist() {
    this.illustPlaylist = []
    this.novelPlaylist = []
    for (const playlistContent of this.illustFullPlaylist) {
      this.illustPlaylist.push(playlistContent)
    }
    for (const playlistContent of this.novelFullPlaylist) {
      this.novelPlaylist.push(playlistContent)
    }
  },
  getRecordData(playlistContent) {
    const folderId = playlistContent[0]
    const filename = playlistContent[1]
    const recordData = this.folders[folderId].records.records[filename]
    return recordData
  },
  getFiltersFolder(playlist) {
    const filters = {}
    for (const playlistIndex in playlist) {
      const folderId = playlist[playlistIndex][0]
      const records = this.folders[folderId].records
      if (filters[folderId] === undefined) {
        filters[folderId] = {
          count: 0,
          filterName: records.folderName
        }
      }
      filters[folderId].count += 1
    }
    return filters
  },
  filterFolder(playlist, filter) {
    return playlist.filter((playlistContent) => {
      const folderId = playlistContent[0]
      return folderId == filter
    })
  },
  getFiltersSource(playlist) {
    const filters = {}
    for (const playlistIndex in playlist) {
      const folderId = playlist[playlistIndex][0]
      const filename = playlist[playlistIndex][1]
      const recordData = this.folders[folderId].records.records[filename]
      if (filters[recordData.source] === undefined) {
        filters[recordData.source] = {
          count: 0,
          filterName: recordData.source
        }
      }
      filters[recordData.source].count += 1
    }
    return filters
  },
  filterSource(playlist, filter) {
    return playlist.filter((playlistContent) => {
      const recordData = this.getRecordData(playlistContent)
      return recordData.source == filter
    })
  },
  getFiltersTags(playlist) {
    const filters = {}
    for (const playlistIndex in playlist) {
      const folderId = playlist[playlistIndex][0]
      const filename = playlist[playlistIndex][1]
      const recordData = this.folders[folderId].records.records[filename]
      for (const tag of recordData.tags) {
        if (filters[tag] === undefined) {
          filters[tag] = {
            count: 0,
            filterName: tag
          }
        }
        filters[tag].count += 1
      }
    }
    return filters
  },
  filterTags(playlist, filter) {
    return playlist.filter((playlistContent) => {
      const recordData = this.getRecordData(playlistContent)
      return recordData.tags.includes(filter)
    })
  },
  getFiltersPixivUser(playlist) {
    const filters = {}
    for (const playlistIndex in playlist) {
      const folderId = playlist[playlistIndex][0]
      const filename = playlist[playlistIndex][1]
      const recordData = this.folders[folderId].records.records[filename]
      if (filters[recordData.authorPixivId] === undefined) {
        filters[recordData.authorPixivId] = {
          count: 0,
          filterName: ""
        }
      }
      filters[recordData.authorPixivId].count += 1
      filters[recordData.authorPixivId].filterName = recordData.authorName
    }
    return filters
  },
  filterPixivUser(playlist, filter) {
    return playlist.filter((playlistContent) => {
      const recordData = this.getRecordData(playlistContent)
      return recordData.authorPixivId == filter
    })
  },
  getFiltersUserName(playlist) {
    const filters = {}
    for (const playlistIndex in playlist) {
      const folderId = playlist[playlistIndex][0]
      const filename = playlist[playlistIndex][1]
      const recordData = this.folders[folderId].records.records[filename]
      if (filters[recordData.authorName] === undefined) {
        filters[recordData.authorName] = {
          count: 0,
          filterName: recordData.authorName
        }
      }
      filters[recordData.authorName].count += 1
    }
    return filters
  },
  filterUserName(playlist, filter) {
    return playlist.filter((playlistContent) => {
      const recordData = this.getRecordData(playlistContent)
      return recordData.authorName == filter
    })
  },
  getFiltersDelete(playlist) {
    const filters = {
      "true": {
        count: 0,
        filterName: "有り"
      },
      "false": {
        count: 0,
        filterName: "無し"
      }
    }
    for (const playlistIndex in playlist) {
      const folderId = playlist[playlistIndex][0]
      const filename = playlist[playlistIndex][1]
      const recordData = this.folders[folderId].records.records[filename]
      if (recordData.delete) {
        filters["true"].count += 1
      } else {
        filters["false"].count += 1
      }
    }
    return filters
  },
  filterDelete(playlist, filter) {
    return playlist.filter((playlistContent) => {
      const recordData = this.getRecordData(playlistContent)
      return (recordData.delete && filter == "true") || (!recordData.delete && filter == "false")
    })
  },
})
