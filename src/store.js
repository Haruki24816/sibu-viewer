import { reactive } from "vue"

export const store = reactive({
  folders: {},
  async loadFolders(fileDict) {
    for (const itemName in fileDict) {
      const item = fileDict[itemName]
      if (item instanceof File) {
        continue
      }
      if (item["records.json"] === undefined) {
        continue
      }
      const records = await new Promise((resolve) => {
        const fileReader = new FileReader()
        fileReader.onload = () => {
          resolve(JSON.parse(fileReader.result))
        }
        fileReader.readAsText(item["records.json"])
      })
      delete item["records.json"]
      this.folders[itemName] = {
        records: records,
        files: item
      }
    }
    console.log(this.folders)
  }
})
