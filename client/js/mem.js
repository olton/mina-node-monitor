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
                    skip: 2,
                    showLabel: false
                }
            }
        },
        arrows: false,
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

    if (!memoryUsageChart) {

        memoryUsageChart = chart.areaChart("#memory-usage", [
            getFakeData(40),
            getFakeData(40)
        ], {
            ...chartOptions,
            height: 220,
            colors: [Metro.colors.toRGBA('#7dc37b', .5), Metro.colors.toRGBA('#aa00ff', .5)],
            areas: [
                {
                    name: "Free"
                },
                {
                    name: "Used"
                }
            ]
        });
    }

    let mem = await getInfo('mem')

    if (mem) {
        const memUsage = mem.used / (1024 ** 3)
        const memFree = mem.free / (1024 ** 3)
        const memTotal = mem.total / (1024 ** 3)

        memoryUsageChart.setBoundaries({maxY: memTotal})
        memoryUsageChart.add(0, [datetime().time() - 2000, memTotal], true)
        memoryUsageChart.add(1, [datetime().time() - 2000, memUsage], true)

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
