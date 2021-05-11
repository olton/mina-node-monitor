import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {getFakeData} from "./helpers/get-fake-data";
import {merge} from "./helpers/merge";
import {defaultChartConfig} from "./helpers/chart-config";
import {imgOk, imgStop} from "./helpers/const";

const chartConfig = merge({}, defaultChartConfig, {
    colors: [Metro.colors.toRGBA('#00AFF0', .5), Metro.colors.toRGBA('#7dc37b', .5)],
    onDrawLabelX: (v) => {
        return `${datetime(+v).format("HH:mm:ss")}`
    },
    onDrawLabelY: (v) => {
        return `${(+v / 1024 ** 2).toFixed(2)}`
    }
})

const networkChart = chart.areaChart("#net-load", [
    {
        name: "TX",
        data: getFakeData(40)
    },
    {
        name: "RX",
        data: getFakeData(40)
    },
], chartConfig);

const getNetInfo = async () => {
    return await getInfo('net-stat')
}

const getNetConnections = async () => {
    return await getInfo('net-conn')
}

export const processNetInfo = async () => {
    let net = await getNetInfo()

    if (net) {
        networkChart.addPoint(0, [datetime().time(), Math.round(net[0].tx_sec)])
        networkChart.addPoint(1, [datetime().time(), Math.round(net[0].rx_sec)])

        $("#net-traffic").text( ((Math.round(net[0].rx_sec) + Math.round(net[0].tx_sec)) / 1024 / 1024).toFixed(2) )
    }

    setTimeout(()=> processNetInfo(), globalThis.config.intervals.net)
}

export const processNetConnections = async () => {
    let net = await getNetConnections()
    const elLog = $("#log-net")

    elLog.html(imgStop)

    if (net) {
        $("#network-connections").text(net.filter((v) => !$.isLocalhost(v.peerAddress)).length)
        elLog.html(imgOk)
        // console.log("Net (re)loaded!")
    }

    setTimeout(() => processNetConnections(), globalThis.config.intervals.net)
}

