const TABLE = SpreadsheetApp.getActiveSpreadsheet()

const sheets = {
    main: TABLE.getSheetByName("Main"),
    history: TABLE.getSheetByName("History"),
    rotation: TABLE.getSheetByName("Rotation")
}

const LENGTH = 531 // Total amount of skins