const { main, history, rotation } = sheets

const setPricesMain = () => {
    const values = history.getRange(2, history.getLastColumn(), history.getLastRow() - 1, 1).getValues()
    main.getRange(2, 6, values.length, 1).setValues(values)
}

const setRotationMain = () => {
    const values = rotation.getRange(2, rotation.getLastColumn(), rotation.getLastRow() - 1, 1).getValues()
    main.getRange(2, 5, values.length, 1).setValues(values)
}