import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {getFakeData} from "./helpers/get-fake-data";
import {defaultChartConfig} from "./helpers/chart-config";
import {imgOk, imgStop} from "./helpers/const";

let networkChart

export const processNetInfo = async () => {
    const elLog = $("#log-explorer")
    elLog.html(imgStop)

    if (!networkChart) {
        networkChart = chart.areaChart("#net-load", [
            getFakeData(40),
            getFakeData(40)
        ], {
            ...defaultChartConfig,
            areas: [
                {
                    name: "Transfer",
                },
                {
                    name: "Receive",
                },
            ],
            colors: [Metro.colors.toRGBA('#00AFF0', .5), Metro.colors.toRGBA('#aa00ff', .5)],
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
                        count: 10,
                        color: globalThis.chartLabelColor,
                    },
                },
                y: {
                    line: {
                        color: globalThis.chartLineColor
                    },
                    label: {
                        count: 10,
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
            height: 160,
            onDrawLabelX: (v) => {
                return ``
                // return `${datetime(+v).format("HH:mm:ss")}`
            },
            onDrawLabelY: (v) => {
                return `${(+v / 1024 ** 2).toFixed(2)}`
            }
        })
    }

    let net = await getInfo('net-stat')

    if (net) {
        networkChart.add(0, [datetime().time(), Math.round(net[0].tx_sec)], true, {maxX: true, maxY: true})
        networkChart.add(1, [datetime().time(), Math.round(net[0].rx_sec)], true, {maxX: true, maxY: true})

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

