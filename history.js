const CHUNK_SIZE = 100

const setPricesHistory = () => {
  const scriptProperties = PropertiesService.getScriptProperties()
  const index = parseInt(scriptProperties.getProperty("index")) || 1
  let targetCol = parseInt(scriptProperties.getProperty("targetCol"))

  const { main, history } = sheets

  if (!targetCol) {
    targetCol = history.getLastColumn() + 1
    scriptProperties.setProperty("targetCol", targetCol)

    const date = new Date().toLocaleDateString("en-US")
    history.getRange(1, targetCol).setValue(date)
  }

  const values = []
  const end = Math.min(index + CHUNK_SIZE - 1, LENGTH)

  for (let i = index; i <= end; i++) {
    Logger.log(`Fetching skin ${i}...`)

    const data = getData(`https://api.tricko.pro/voxiom/market/skin/${i}?log=vox_market`)
    const value = processData(data.data.price_history)
    values.push([value])

    Utilities.sleep(1000)
  }

  history.getRange(index + 1, targetCol, values.length, 1).setValues(values)

  if (end < LENGTH) {
    scriptProperties.setProperty("index", end + 1)

    ScriptApp.newTrigger("setPricesHistory").timeBased().after(2000).create()
  }
  else {
    scriptProperties.deleteAllProperties()

    // Set prices
    const values = history.getRange(2, history.getLastColumn(), history.getLastRow() - 1, 1).getValues()
    main.getRange(2, 6, values.length, 1).setValues(values)
  }
}