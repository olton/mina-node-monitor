import {getAPIData, getInfo} from "./helpers/get-info";
import {imgOk, imgStop} from "./helpers/const";

export const processPrice = async () => {
    const elLog = $("#log-coingecko")
    elLog.html(imgStop)

    const {currency = 'usd', update_interval = 60000} = globalThis.config.price

    const elCurrentPrice = $("#current-price")
    const elCurrency = $("#currency")
    const elPriceChange = $("#price-change")
    const elPriceHigh = $("#price-high")
    const elPriceLow = $("#price-low")
    const elBalance = $("#balance-usd")
    const elPriceArrow = $("#price-arrow")

    elPriceArrow.html("")

    const data = await getInfo(`price?currency=${currency}`)

    if (data) {
        const mina = data[0]
        const sign = mina.price_change_percentage_24h
        const symbol = `<span class="ani-vertical mif-${sign === 0 ? '' : sign <= 0 ? 'arrow-down fg-red' : 'arrow-up fg-green'}"></span>`
        const price = (+mina.current_price).toFixed(2)
        const priceChange = +(mina.price_change_percentage_24h).toFixed(2)
        const priceDelta = (mina.price_change_24h).toFixed(2)
        const priceDeltaSign = priceDelta > 0 ? "+" : "";
        const priceDeltaColor = priceDelta > 0 ? "fg-green" : "fg-red";

        elCurrentPrice.html(`${price}`)
        elCurrency.html(currency.toUpperCase())
        elPriceChange.html(`${priceChange}%`)
        elPriceHigh.html(mina.ath)
        elPriceLow.html(mina.atl)

        elPriceArrow.html(`<span class="fg-normal ${priceDeltaColor}">${priceDeltaSign}${priceDelta}</span>${symbol}`)

        elBalance.text((globalThis.balance * globalThis.price).format(2, null, ",", ".") + " " + currency.toUpperCase())

        globalThis.price = price
        globalThis.priceChange = priceChange

        elLog.html(imgOk)
    }

    setTimeout(() => processPrice(), update_interval)
}