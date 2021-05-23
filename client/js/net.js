import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {getFakeData} from "./helpers/get-fake-data";
import {defaultChartConfig} from "./helpers/chart-config";
import {imgOk, imgStop} from "./helpers/const";

let networkChart = chart.areaChart("#net-load", [
    {
        name: "Transfer",
        data: getFakeData(40)
    },
    {
        name: "Receive",
        data: getFakeData(40)
    },
], {
    ...defaultChartConfig,
    colors: [Metro.colors.toRGBA('#00AFF0', .5), Metro.colors.toRGBA('#7dc37b', .5)],
    legend: {
        position: 'top-left',
        vertical: true,
        background: "#22272e",
        font: {
            color: "#fff"
        },
        margin: {
            left:24,
            top: 0
        },
        border: {
            color: "#22272e"
        },
        padding: 5
    },
    padding: {
        left: 30,
        top: 5,
        right: 0,
        bottom: 10
    },
    height: 160,
    onDrawLabelX: (v) => {
        return ``
        // return `${datetime(+v).format("HH:mm:ss")}`
    },
    onDrawLabelY: (v) => {
        return `${(+v / 1024 ** 2).toFixed(2)}`
    }
});

export const processNetInfo = async () => {
    const elLog = $("#log-explorer")
    elLog.html(imgStop)

    let net = await getInfo('net-stat')

    if (net) {
        networkChart.addPoint(0, [datetime().time(), Math.round(net[0].tx_sec)])
        networkChart.addPoint(1, [datetime().time(), Math.round(net[0].rx_sec)])

        $("#net-traffic").text( ((Math.round(net[0].rx_sec) + Math.round(net[0].tx_sec)) / 1024 / 1024).toFixed(2) )
        $("#all-traffic").text( ((Math.round(net[0].rx_sec) + Math.round(net[0].tx_sec)) / 1024 / 1024).toFixed(2) )

        elLog.html(imgOk)
    }

    setTimeout(()=> processNetInfo(), globalThis.config.intervals.net)
}

export const processNetConnections = async () => {
    let net = await getInfo('net-conn')
    const elLog = $("#log-net")

    elLog.html(imgStop)

    if (net) {
        $("#network-connections").text(net.filter((v) => !$.isLocalhost(v.peerAddress)).length)
        elLog.html(imgOk)
        // console.log("Net (re)loaded!")
    }

    setTimeout(() => processNetConnections(), globalThis.config.intervals.net)
}

