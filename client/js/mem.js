import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {getFakeData} from "./helpers/get-fake-data";
import {defaultChartConfig, defaultGaugeConfig} from "./helpers/chart-config";
import {imgOk, imgStop} from "./helpers/const";

let memoryGauge, memoryFreeChart, memoryUsageChart

export const processMemInfo = async () => {
    const elLog = $("#log-mem")
    elLog.html(imgStop)
    const chartOptions = {
        ...defaultChartConfig,
        height: 90,
        colors: ['#aa00ff', '#7dc37b'],
        legend: {
            position: 'top-left',
            vertical: true,
            background: globalThis.darkMode ? "#22272e" : "#fff",
            margin: {
                left: 4,
                top: 4
            },
            border: {
                color: globalThis.darkMode ? "#22272e" : "#fafbfc"
            },
            padding: 2,
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
                    fixed: 0,
                    color: globalThis.chartLabelColor,
                    font: {
                        size: 10
                    }
                },
                skip: 2,
                arrow: false
            },
            y: {
                arrow: false,
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
                    skip: 2,
                    showLabel: false
                }
            }
        },
        padding: {
            left: 5,
            top: 5,
            right: 1,
            bottom: 5
        },
        boundaries: {
            maxY: 0,
            minY: 0
        },
        onDrawLabelX: (v) => {
            return ``
        }
    }

    const _data = getFakeData(40)

    if (!memoryUsageChart) {

        memoryUsageChart = chart.lineChart("#memory-usage", [
            {
                name: "Used",
                data: _data
            },
        ], {
            ...chartOptions,
            colors: ['#aa00ff']
        });
    }
    if (!memoryFreeChart) {
        memoryFreeChart = chart.lineChart("#memory-free", [
            {
                name: "Free",
                data: _data
            }
        ], {
            ...chartOptions,
            colors: ['#7dc37b']
        });
    }

    let mem = await getInfo('mem')

    if (mem) {
        const memUsage = mem.used / (1024 ** 3)
        const memFree = mem.free / (1024 ** 3)
        const memTotal = mem.total / (1024 ** 3)

        memoryFreeChart.setBoundaries({maxY: memTotal})
        memoryUsageChart.setBoundaries({maxY: memTotal})
        memoryUsageChart.addPoint(0, [datetime().time(), memUsage])
        memoryFreeChart.addPoint(0, [datetime().time(), memFree])

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
