import {getAPIData} from "./helpers/get-info";
import {imgOk, imgStop} from "./helpers/const";

export const processCoingecko = async () => {
    const elLog = $("#log-coingecko")
    elLog.html(imgStop)

    const {currency = 'usd', update_interval = 60000} = globalThis.config.coingecko
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=%CURRENCY%&ids=mina-protocol`.replace("%CURRENCY%", currency.toLowerCase())

    const elCurrentPrice = $("#current-price")
    const elCurrency = $("#currency")
    const elPriceChange = $("#price-change")
    const elPriceHigh = $("#price-high")
    const elPriceLow = $("#price-low")
    const elBalance = $("#balance-usd")
    const elPriceColor = $("#price-color")
    const elChangeColor = $("#change-color")

    elPriceColor.html("")
    elChangeColor.html("")

    const data = await getAPIData(url)

    if (data) {
        const mina = data[0]
        const sign = mina.price_change_percentage_24h
        const symbol = `<span class="ani-vertical mif-${sign === 0 ? '' : sign <= 0 ? 'arrow-down fg-red' : 'arrow-up fg-green'}"></span>`
        const price = +mina.current_price
        const priceChange = +(mina.price_change_percentage_24h).toFixed(2)
        const priceDelta = (price - mina.low_24h).toFixed(2)
        const priceDeltaSign = priceDelta > 0 ? "+" : "";
        const priceDeltaColor = priceDelta > 0 ? "fg-green" : "fg-red";

        elCurrentPrice.html(`${price}  <small class="fg-normal ${priceDeltaColor}">${priceDeltaSign}${priceDelta}</small>`)
        elCurrency.html(currency.toUpperCase())
        elPriceChange.html(`${priceChange}%`)
        elPriceHigh.html(mina.ath)
        elPriceLow.html(mina.atl)

        elPriceColor.html(symbol)
        elChangeColor.html(symbol)

        elBalance.text((globalThis.balance * globalThis.price).format(2, null, ",", ".") + " " + currency.toUpperCase())

        globalThis.price = price
        globalThis.priceChange = priceChange

        elLog.html(imgOk)
    }

    setTimeout(() => processCoingecko(), update_interval)
}