const set = (sheet, mode) => {
  const lastColumn = sheet.getLastColumn()
  const headers = sheet.getRange(1, 2, 1, lastColumn - 1).getValues()[0]
  const data = sheet.getRange(2, 2, LENGTH, lastColumn - 1).getValues()

  return data.map(row => {
    switch (mode) {
      case "last":
        return row.reverse().find(i => i !== "") || ""

      case "array": {
        const start = headers.length - 10
        const limitedHeaders = headers.slice(start)
        const limitedRow = row.slice(start)
        return JSON.stringify(
          Object.fromEntries(
            limitedHeaders.map((h, i) => limitedRow[i] ? [h, limitedRow[i]] : null).filter(Boolean)
          )
        )
      }

      case "check":
        return row[headers.length - 1]

      case "boolarray":
        return JSON.stringify(Object.fromEntries(headers.map((h, i) => [h, row[i]])))

      default:
        return ""
    }
  })
}

const exportData = () => {
  const row5 = set(sheets.rotation, "check")
  const row6 = set(sheets.history, "last")
  const row9 = set(sheets.history, "array")
  const row11 = set(sheets.rotation, "boolarray")

  sheets.main.getRange(2, 5, row5.length, 1).setValues(row5.map(i => [i]))
  sheets.main.getRange(2, 6, row6.length, 1).setValues(row6.map(i => [i]))

  const mainData = sheets.main.getRange(2, 1, LENGTH, 9).getValues()
  const data = row5.map((item, i) => ({
    id: mainData[i][0],
    type: mainData[i][1],
    name: mainData[i][2],
    rarity: mainData[i][3],
    rotation: item,
    market: row6[i],
    _ma: row9[i],
    _ra: row11[i]
  }))

  const blob = Utilities.newBlob(JSON.stringify(data, null, 2), "application/json", "voxiomMarket.json")
  const url = DriveApp.createFile(blob).getDownloadUrl()
  console.log(url)
}