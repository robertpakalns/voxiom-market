// Fetches data
const getData = url => JSON.parse(UrlFetchApp.fetch(url).getContentText())

// Calculates the p-th percentile of a sorted array using linear interpolation
const percentile = (arr, p) => {
    if (arr.length === 0) return NaN

    const index = (p / 100) * (arr.length - 1)
    const lower = Math.floor(index)
    const weight = index % 1

    return weight === 0 ? arr[lower] : arr[lower] * (1 - weight) + arr[lower + 1] * weight
}

// Advanced average price calculation; removes outliers
const processData = data => {
    const prices = data.map(el => el.price).sort((a, b) => a - b)
    const filteredPrices = prices.filter(i => i >= percentile(prices, 50) * 0.5)
    const Q1 = percentile(filteredPrices, 25)
    const Q3 = percentile(filteredPrices, 75)
    const IQR = Q3 - Q1
    const result = filteredPrices.filter(el => el >= Q1 - 1.5 * IQR && el <= Q3 + 1.5 * IQR)
    return result.length === 0 ? "" : (result.reduce((acc, el) => acc + el, 0) / result.length).toFixed(0)
}