import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {getFakeData} from "./helpers/get-fake-data";
import {defaultChartConfig, defaultGaugeConfig} from "./helpers/chart-config";
import {imgOk, imgStop} from "./helpers/const";

const cpuChart = chart.areaChart("#cpu-load", [
    {
        name: "CPU usage",
        data: getFakeData(40)
    }
], {
    ...defaultChartConfig,
    colors: [Metro.colors.toRGBA('#00AFF0', .5), Metro.colors.toRGBA('#aa00ff', .5)],
    legend: false,
    padding: {
        left: 35,
        top: 5,
        right: 0,
        bottom: 10
    },
    boundaries: {
        maxY: 100,
        minY: 0
    },
    onDrawLabelX: (v) => {
        return `${datetime(+v).format("HH:mm:ss")}`
    },
    onDrawLabelY: (v) => {
        return `${+v}%`
    }
});

let cpuGauge = chart.gauge('#cpu-use', [0], {
    ...defaultGaugeConfig,
    padding: 0,
    onDrawValue: (v, p) => {
        return +p.toFixed(0) + "%"
    }
})

let cpuSegment

export const processCPUData = async () => {
    const elLog = $("#log-cpu")
    elLog.html(imgStop)

    let container = $("#cpu-load-all")
    let height = 208
    let cpuLoad = await getInfo('cpu-load')

    if (cpuLoad) {

        let {load = 0, user = 0, sys = 0, loadavg = [0, 0, 0], threads = []} = cpuLoad

        cpuChart.addPoint(0, [datetime().time(), load])
        cpuGauge.setData([load])

        $("#loadavg").html(`<span class="fg-white">${loadavg[0]}</span> <span>${loadavg[1]}</span> <span>${loadavg[2]}</span>`)

        if (!container.children().length) {
            cpuSegment = chart.segment("#cpu-load-all", cpuLoad.threads, {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                },
                segment: {
                    rowDistance: 6,
                    count: 40,
                    height: height / (cpuLoad.threads.length) - 6
                },
                border: {
                    color: "transparent"
                },
                ghost: {
                    color: "rgba(125, 195, 123, .1)"
                }
            })
        } else {
            cpuLoad.threads.forEach( (v, i) => {
                cpuSegment.setData(v, i)
            })
        }

        elLog.html(imgOk)
    }

    setTimeout( () => processCPUData(), globalThis.config.intervals.cpu )
}
