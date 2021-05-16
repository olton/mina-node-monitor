import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {getFakeData} from "./helpers/get-fake-data";
import {defaultChartConfig, defaultGaugeConfig} from "./helpers/chart-config";
import {imgOk, imgStop} from "./helpers/const";

let memoryChart, memoryGauge

export const processMemInfo = async () => {
    let mem = await getInfo('mem')
    const elLog = $("#log-mem")

    elLog.html(imgStop)

    if (mem) {
        const memUsage = mem.used / (1024 ** 3)
        const memFree = mem.free / (1024 ** 3)
        const memTotal = mem.total / (1024 ** 3)

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
                boundaries: {
                    maxY: memTotal,
                    minY: 0
                },
                onDrawLabelX: (v) => {
                    return `${datetime(+v).format("HH:mm:ss")}`
                }
            });
        }
        memoryChart.addPoint(0, [datetime().time(), memUsage])
        memoryChart.addPoint(1, [datetime().time(), memFree])

        if (!memoryGauge) {
            memoryGauge = chart.gauge('#memory-use', [0], {
                ...defaultGaugeConfig,
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

        $("#ram-free").text(memFree.toFixed(0))

        elLog.html(imgOk)
        // console.log("Mem (re)loaded!")
    }

    setTimeout(() => processMemInfo(), globalThis.config.intervals.mem)
}
