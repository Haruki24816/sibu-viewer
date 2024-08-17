import { reactive } from "vue"

export const store = reactive({
  folders: {},
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
      this.folders[itemName] = {
        records: records,
        files: item
      }
    }
    console.log(this.folders)
  }
})
