export const processMinaPrice = (data) => {
    const elCurrentPrice = $("#current-price")
    const elCurrency = $("#currency")
    const elPriceChange = $("#price-change")
    const elPriceHigh = $("#price-high")
    const elPriceLow = $("#price-low")
    const elBalance = $("#balance-usd")
    const elPriceArrow = $("#price-arrow")

    const mina = data[0]
    const currency = mina.currency
    const price = (+mina.current_price).toFixed(2)
    const priceChange = +(mina.price_change_percentage_24h).toFixed(2)
    const priceDelta = (mina.price_change_24h).toFixed(2)
    const priceDeltaSign = priceDelta > 0 ? "+" : "";
    const priceDeltaColor = priceDelta == 0.00 ? "" : priceDelta > 0 ? "fg-green" : "fg-red";
    const sign = mina.price_change_percentage_24h
    const symbol = priceDelta == 0.00 ? `` : `<span class="ani-vertical mif-${sign < 0 ? 'arrow-down fg-red' : 'arrow-up fg-green'}"></span>`

    elCurrentPrice.html(`${price}`)
    elCurrency.html(currency === "auto" ? mina.currency.toUpperCase() : currency.toUpperCase())
    elPriceChange.html(`${priceChange}%`)
    elPriceHigh.html(+(mina.ath).toFixed(2))
    elPriceLow.html(+(mina.atl).toFixed(2))

    elPriceArrow.html(`<span class="text-bold fg-accent ${priceDeltaColor}">${priceDeltaSign}${priceDelta}</span>${symbol}`)

    elBalance.text((globalThis.balance * globalThis.price).format(2, null, ",", ".") + " " + currency.toUpperCase())

    globalThis.price = price
    globalThis.priceChange = priceChange
    globalThis.priceCurrency = currency
}