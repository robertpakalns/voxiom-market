const init = () => {
    const { main, rotation } = sheets

    setPricesHistory()

    // Set rotation 
    const values = rotation.getRange(2, rotation.getLastColumn(), rotation.getLastRow() - 1, 1).getValues()
    main.getRange(2, 5, values.length, 1).setValues(values)
}