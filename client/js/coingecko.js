import {getAPIData} from "./helpers/get-info";
import {imgOk, imgStop} from "./helpers/const";

export const processCoingecko = async () => {
    const elLog = $("#log-coingecko")
    elLog.html(imgStop)

    const {currency = 'usd', interval = 60000} = globalThis.config.price
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=%CURRENCY%&ids=mina-protocol`.replace("%CURRENCY%", currency.toLowerCase())

    const data = await getAPIData(url)

    if (data) {
        const mina = data[0]
        const sign = mina.price_change_percentage_24h
        const symbol = `<span class="mif-${sign === 0 ? '' : sign <= 0 ? 'arrow-down fg-red' : 'arrow-up fg-green'}"></span>`

        globalThis.price = +mina.current_price

        $("#current-price").html(mina.current_price)
        $("#currency").html(currency.toUpperCase())
        $("#price-change").html(symbol + ' ' + +(mina.price_change_percentage_24h).toFixed(2))
        $("#price-high").html(mina.high_24h)
        $("#price-low").html(mina.low_24h)


        $("#balance-usd").text((globalThis.balance * globalThis.price).format(2, null, ",", ".") + " " + currency.toUpperCase())

        elLog.html(imgOk)
    }

    setTimeout(() => processCoingecko(), interval)
}