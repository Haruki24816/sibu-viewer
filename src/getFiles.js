export async function getFiles(dataTransfer) {
  const fileList = {}
  const items = dataTransfer.items

  for (const item of items) {
    const entry = item.webkitGetAsEntry()
    async function loop(entry, cd) {
      if (entry.isFile) {
        const file = await new Promise((resolve) => {
          entry.file((file) => {
            resolve(file)
          })
        })
        cd[file.name] = file
      } else if (entry.isDirectory) {
        const directoryReader = entry.createReader()
        const childEntries = await new Promise((resolve) => {
          directoryReader.readEntries((childEntries) => {
            resolve(childEntries)
          })
        })
        cd[entry.name] = {}
        for (const num in childEntries) {
          const childEntry = childEntries[num]
          await loop(childEntry, cd[entry.name])
        }
      }
    }
    await loop(entry, fileList)
  }

  return fileList
}
