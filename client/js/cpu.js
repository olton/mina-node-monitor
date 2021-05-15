import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {getFakeData} from "./helpers/get-fake-data";
import {merge} from "./helpers/merge";
import {defaultChartConfig, defaultGaugeConfig} from "./helpers/chart-config";
import {imgOk, imgStop} from "./helpers/const";

const chartConfig = merge({}, defaultChartConfig, {
    colors: ['#00AFF0', '#aa00ff'],
    boundaries: {
        maxY: 100
    },
    onDrawLabelX: (v) => {
        return `${datetime(+v).format("HH:mm:ss")}`
    },
    onDrawLabelY: (v) => {
        return `${+v}%`
    }
})

const cpuChart = chart.lineChart("#cpu-load", [
    {
        name: "User",
        data: getFakeData(40)
    },
    {
        name: "System",
        data: getFakeData(40)
    }
], chartConfig);

let cpuGauge

const loadCPUData = async () => {
    return await getInfo('cpu-load')
}

export const processCPUData = async () => {
    let cpu = await loadCPUData()
    const elLog = $("#log-cpu")

    elLog.html(imgStop)
    if (cpu) {

        let {currentLoad = 0, currentLoadUser = 0, currentLoadSystem = 0} = cpu

        cpuChart.addPoint(0, [datetime().time(), currentLoadUser])
        cpuChart.addPoint(1, [datetime().time(), currentLoadSystem])

        if (!cpuGauge) {
            cpuGauge = chart.gauge('#cpu-use', [currentLoad], {
                ...defaultGaugeConfig,
                onDrawValue: (v, p) => {
                    return +p.toFixed(0) + "%"
                }
            })
        } else {
            cpuGauge.setData([currentLoad])
        }

        // console.log("CPU (re)loaded!")
        elLog.html(imgOk)
    }

    setTimeout( () => processCPUData(), globalThis.config.intervals.cpu )
}
