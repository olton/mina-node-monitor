import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "../helpers/get-info"
import {getFakeData} from "../helpers/get-fake-data";
import {merge} from "../helpers/merge";
import {loadChartConfig} from "./load-chart-config";

(async () => {
    const chartConfig = merge({}, loadChartConfig, {
        onDrawLabelX: (v) => {
            return `${datetime(+v).format("HH:mm:ss")}`
        },
        onDrawLabelY: (v) => {
            return `${(+v / 1024 ** 2).toFixed(2)}`
        }
    })
    // memory

    const networkChart = chart.lineChart("#net-load", [
        {
            name: "Transferred",
            data: getFakeData(40)
        },
        {
            name: "Received",
            data: getFakeData(40)
        },
    ], chartConfig)

    setInterval( async () => {
        const net = await getInfo('net-stat')
        networkChart.addPoint(0, [datetime().time(), Math.round(net[0].tx_sec)])
        networkChart.addPoint(1, [datetime().time(), Math.round(net[0].rx_sec)])
    }, 2000)

    setInterval( async () => {
        const net = await getInfo('net-conn')
        $("#network-connections").text(net.filter( (v) => !$.isLocalhost(v.peerAddress) ).length)
    }, 2000)
})()