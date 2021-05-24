import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {getFakeData} from "./helpers/get-fake-data";
import {defaultChartConfig, defaultGaugeConfig} from "./helpers/chart-config";
import {imgOk, imgStop} from "./helpers/const";

let memoryChart, memoryGauge

export const processMemInfo = async () => {
    const elLog = $("#log-mem")
    elLog.html(imgStop)

    if (!memoryChart) {
        const _data = getFakeData(40)

        memoryChart = chart.lineChart("#memory-load", [
            {
                name: "Used",
                data: _data
            },
            {
                name: "Free",
                data: _data
            }
        ], {
            ...defaultChartConfig,
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
                    color: globalThis.darkMode ? "#fff" : "#000"
                },
            },
            axis: {
                x: {
                    line: {
                        count: 10,
                        color: globalThis.darkMode ? '#444c56' : "#f0f6fc"
                    },
                    label: {
                        color: globalThis.darkMode ? "#fff" : "#000",
                    },
                    arrow: {
                        color: '#22272e'
                    }
                },
                y: {
                    line: {
                        count: 10,
                        color: globalThis.darkMode ? '#444c56' : "#f0f6fc"
                    },
                    label: {
                        fixed: 0,
                        color: globalThis.darkMode ? "#fff" : "#000",
                        font: {
                            size: 10
                        }
                    },
                    arrow: {
                        color: '#22272e'
                    }
                }
            },
            padding: {
                left: 35,
                top: 5,
                right: 0,
                bottom: 10
            },
            boundaries: {
                maxY: 0,
                minY: 0
            },
            onDrawLabelX: (v) => {
                return `${datetime(+v).format("HH:mm:ss")}`
            }
        });
    }

    let mem = await getInfo('mem')

    if (mem) {
        const memUsage = mem.used / (1024 ** 3)
        const memFree = mem.free / (1024 ** 3)
        const memTotal = mem.total / (1024 ** 3)

        memoryChart.setBoundaries({
            maxY: memTotal
        })
        memoryChart.addPoint(0, [datetime().time(), memUsage])
        memoryChart.addPoint(1, [datetime().time(), memFree])

        if (!memoryGauge) {
            memoryGauge = chart.gauge('#memory-use', [0], {
                ...defaultGaugeConfig,
                backStyle: globalThis.darkMode ? '#1e2228' : '#f0f6fc',
                padding: 0,
                boundaries: {
                    max: Math.round(memTotal),
                },
                onDrawValue: (v, p) => {
                    return +p.toFixed(0) + "%"
                }
            })
        }
        memoryGauge.setData([memUsage])

        $("#free-ram").text(memFree.toFixed(0))
        $("#used-ram").text(memUsage.toFixed(0))

        elLog.html(imgOk)
        // console.log("Mem (re)loaded!")
    }

    setTimeout(() => processMemInfo(), globalThis.config.intervals.mem)
}
