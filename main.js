const TABLE = SpreadsheetApp.getActiveSpreadsheet()
const LENGTH = 531
const CHUNK_SIZE = 100

const sheets = {
  main: TABLE.getSheetByName("Main"),
  history: TABLE.getSheetByName("History")
}

const getData = url => JSON.parse(UrlFetchApp.fetch(url).getContentText())

const init = () => {
  const values = []

  for (let i = 1; i <= LENGTH; i++) {
    console.log("fetching... " + i)
    const data = getData(`https://api.tricko.pro/voxiom/market/skin/${i}`)
    const value = processData(data.data.price_history)
    values.push([value])

    Utilities.sleep(1000)
  }

  const { history } = sheets
  const nextCol = history.getLastColumn() + 1

  const date = new Date().toLocaleDateString("en-US")
  history.getRange(1, nextCol).setValue(date)

  history.getRange(2, nextCol, values.length, 1).setValues(values)
}