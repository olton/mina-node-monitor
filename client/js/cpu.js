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
    boundaries: {
        maxY: 100
    },
    onDrawLabelX: (v) => {
        return `${datetime(+v).format("HH:mm:ss")}`
    },
    onDrawLabelY: (v) => {
        return `${+v}%`
    }
});

let cpuGauge

export const processCPUData = async () => {
    let cpu = await getInfo('cpu-load')
    const elLog = $("#log-cpu")

    elLog.html(imgStop)
    if (cpu) {

        let {load = 0, user = 0, sys = 0, loadavg = [0, 0, 0]} = cpu

        if (!cpuGauge) {
            cpuGauge = chart.gauge('#cpu-use', [0], {
                ...defaultGaugeConfig,
                padding: 0,
                onDrawValue: (v, p) => {
                    return +p.toFixed(0) + "%"
                }
            })
        }

        cpuChart.addPoint(0, [datetime().time(), load])
        cpuGauge.setData([load])

        $("#loadavg").html(`<span class="fg-white">${loadavg[0]}</span> <span>${loadavg[1]}</span> <span>${loadavg[2]}</span>`)

        // console.log("CPU (re)loaded!")
        elLog.html(imgOk)
    }

    setTimeout( () => processCPUData(), globalThis.config.intervals.cpu )
}
