// Fetches data
const getData = url => JSON.parse(UrlFetchApp.fetch(url).getContentText())

// Calculates the p-th percentile of a sorted array using linear interpolation
const percentile = (data, p) => {
    if (!data || data.length === 0) return NaN

    const index = (p / 100) * (data.length - 1)
    const lower = Math.floor(index)
    const upper = Math.ceil(index)
    const weight = index - lower

    return lower === upper ? data[lower] : data[lower] * (1 - weight) + data[upper] * weight
}

// Advanced average price calculation; removes outliers
const processData = data => {
    if (!data || data.length === 0) return ""

    const prices = data.map(el => el.price).sort((a, b) => a - b)
    const filtered = prices.filter(p => p >= percentile(prices, 50) * 0.5)
    if (filtered.length === 0) return ""

    const Q1 = percentile(filtered, 25)
    const Q3 = percentile(filtered, 75)
    const IQR = Q3 - Q1

    const low = Q1 - 1.5 * IQR
    const high = Q3 + 1.5 * IQR

    let sum = 0
    let count = 0

    for (let i = 0; i < filtered.length; i++) {
        const price = filtered[i]
        if (price >= low && price <= high) {
            sum += price
            count++
        }
    }

    return count === 0 ? "" : Math.round(sum / count)
}