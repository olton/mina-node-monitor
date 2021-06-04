import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {getFakeData} from "./helpers/get-fake-data";
import {defaultChartConfig} from "./helpers/chart-config";
import {imgOk, imgStop} from "./helpers/const";

let networkChartRx, networkChartTx

export const processNetInfo = async () => {
    const netChartConfig = {
        ...defaultChartConfig,
        height: 80,
        legend: {
            position: 'top-left',
            vertical: true,
            background: globalThis.darkMode ? "#22272e" : "#fff",
            margin: {
                left: 32,
                top: 0
            },
            border: {
                color: globalThis.darkMode ? "#22272e" : "#fafbfc"
            },
            padding: 5,
            font: {
                color: globalThis.chartLabelColor
            },
        },
        axis: {
            x: {
                line: {
                    color: globalThis.chartLineColor,
                    shortLineSize: 0
                },
                label: {
                    count: 6,
                    color: globalThis.chartLabelColor,
                },
            },
            y: {
                line: {
                    color: globalThis.chartLineColor
                },
                label: {
                    count: 6,
                    fixed: 0,
                    color: globalThis.chartLabelColor,
                    font: {
                        size: 10
                    },
                    skip: 2
                },
            }
        },
        arrows: false,
        padding: {
            left: 35,
            top: 5,
            right: 1,
            bottom: 10
        },
        onDrawLabelX: (v) => {
            return ``
            // return `${datetime(+v).format("HH:mm:ss")}`
        },
        onDrawLabelY: (v) => {
            return `${(+v / 1024 ** 2).toFixed(3)}`
        }
    }
    const elLog = $("#log-explorer")
    elLog.html(imgStop)

    if (!networkChartRx) {
        networkChartRx = chart.areaChart("#net-load-rx", [
            getFakeData(40)
        ], {
            ...netChartConfig,
            colors: [Metro.colors.toRGBA('#aa00ff', .5)],
            areas: [
                {
                    name: "Rx",
                },
            ],
        })
    }
    if (!networkChartTx) {
        networkChartTx = chart.areaChart("#net-load-tx", [
            getFakeData(40)
        ], {
            ...netChartConfig,
            colors: [Metro.colors.toRGBA('#00AFF0', .5)],
            areas: [
                {
                    name: "Tx",
                },
            ],
        })
    }

    let net = await getInfo('net-stat')

    if (net) {
        networkChartTx.add(0, [datetime().time(), Math.round(net[0].tx_sec)], true, {maxX: true, maxY: true})
        networkChartRx.add(0, [datetime().time(), Math.round(net[0].rx_sec)], true, {maxX: true, maxY: true})

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

