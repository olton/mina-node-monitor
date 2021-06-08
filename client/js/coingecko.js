import {getAPIData} from "./helpers/get-info";
import {imgOk, imgStop} from "./helpers/const";

const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=mina-protocol`

export const processCoingecko = async () => {
    const elLog = $("#log-coingecko")
    elLog.html(imgStop)
    const data = await getAPIData(url)
    const {price: interval = 60000} = globalThis.config.intervals

    if (data) {
        const mina = data[0]
        const sign = mina.price_change_percentage_24h
        const symbol = `<span class="mif-${sign === 0 ? '' : sign <= 0 ? 'arrow-down fg-red' : 'arrow-up fg-green'}"></span>`

        $("#current-price").html(mina.current_price)
        $("#price-change").html(symbol + ' ' + +(mina.price_change_percentage_24h).toFixed(2))
        $("#price-high").html(mina.high_24h)
        $("#price-low").html(mina.low_24h)

        elLog.html(imgOk)
    }

    setTimeout(() => processCoingecko(), interval)
}