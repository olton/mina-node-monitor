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
    const elPriceATH = $("#price-ath")
    const elPriceATL = $("#price-atl")
    const elBalance = $("#balance-usd")
    const elChangeColor = $("#change-color")

    const data = await getAPIData(url)

    if (data) {
        const mina = data[0]
        const sign = mina.price_change_percentage_24h
        const symbol = `<span class="ani-vertical mif-${sign === 0 ? '' : sign <= 0 ? 'arrow-down fg-red' : 'arrow-up fg-green'}"></span>`
        const changeColor = sign === 0 ? '' : sign <= 0 ? 'alert' : 'success'

        globalThis.price = +mina.current_price

        elCurrentPrice.html(mina.current_price)
        elCurrency.html(currency.toUpperCase())
        elPriceChange.html(+(mina.price_change_percentage_24h).toFixed(2) + '% ' + symbol)
        elPriceHigh.html(mina.high_24h)
        elPriceLow.html(mina.low_24h)
        elPriceATH.html(mina.ath)
        elPriceATL.html(mina.atl)

        elChangeColor.removeClass('alert success').addClass(changeColor)

        elBalance.text((globalThis.balance * globalThis.price).format(2, null, ",", ".") + " " + currency.toUpperCase())

        elLog.html(imgOk)
    }

    setTimeout(() => processCoingecko(), update_interval)
}