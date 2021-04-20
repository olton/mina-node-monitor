import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {getFakeData} from "./helpers/get-fake-data";
import {merge} from "./helpers/merge";
import {defaultChartConfig} from "./helpers/chart-config";
import {imgOk, imgStop} from "./helpers/const";

const chartConfig = merge({}, defaultChartConfig, {
    onDrawLabelX: (v) => {
        return `${datetime(+v).format("HH:mm:ss")}`
    },
    onDrawLabelY: (v) => {
        return `${(+v / 1024 ** 2).toFixed(2)}`
    }
})

const networkChart = chart.lineChart("#net-load", [
    {
        name: "Transferred",
        data: getFakeData(40)
    },
    {
        name: "Received",
        data: getFakeData(40)
    },
], chartConfig);

const getNetInfo = async () => {
    return await getInfo('net-stat')
}

const getNetConnections = async () => {
    return await getInfo('net-conn')
}

const processNetInfo = async () => {
    let net = await getNetInfo()

    if (net) {
        networkChart.addPoint(0, [datetime().time(), Math.round(net[0].tx_sec)])
        networkChart.addPoint(1, [datetime().time(), Math.round(net[0].rx_sec)])
    }

    setTimeout(()=> processNetInfo(), 2000)
}

const processNetConnections = async () => {
    let net = await getNetConnections()
    const elLog = $("#log-net")

    elLog.html(imgStop)

    if (net) {
        $("#network-connections").text(net.filter((v) => !$.isLocalhost(v.peerAddress)).length)
        elLog.html(imgOk)
        // console.log("Net (re)loaded!")
    }

    setTimeout(() => processNetConnections(), 2000)
}

setTimeout(() => processNetInfo(), 0)
setTimeout(() => processNetConnections(), 0)

