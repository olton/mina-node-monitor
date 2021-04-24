import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {getFakeData} from "./helpers/get-fake-data";
import {merge} from "./helpers/merge";
import {defaultChartConfig} from "./helpers/chart-config";
import {imgOk, imgStop} from "./helpers/const";

const chartConfig = merge({}, defaultChartConfig, {
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
        name: "Total",
        data: getFakeData(40)
    },
    {
        name: "User",
        data: getFakeData(40)
    },
    {
        name: "System",
        data: getFakeData(40)
    }
], chartConfig);


const loadCPUData = async () => {
    return await getInfo('cpu-load')
}

export const processCPUData = async () => {
    let cpu = await loadCPUData()
    const elLog = $("#log-cpu")

    elLog.html(imgStop)
    if (cpu) {
        cpuChart.addPoint(0, [datetime().time(), cpu.currentLoad])
        cpuChart.addPoint(1, [datetime().time(), cpu.currentLoadUser])
        cpuChart.addPoint(2, [datetime().time(), cpu.currentLoadSystem])

        // console.log("CPU (re)loaded!")
        elLog.html(imgOk)
    }

    setTimeout( () => processCPUData(), globalThis.config.intervals.cpu )
}
