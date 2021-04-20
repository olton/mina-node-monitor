import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {getFakeData} from "./helpers/get-fake-data";
import {merge} from "./helpers/merge";
import {defaultChartConfig} from "./helpers/chart-config";
import {imgOk, imgStop} from "./helpers/const";

const getMemInfo = async () => {
    return await getInfo('mem')
}

const chartConfig = merge({}, defaultChartConfig, {
    onDrawLabelX: (v) => {
        return `${datetime(+v).format("HH:mm:ss")}`
    }
})

const memoryChart = chart.lineChart("#memory-load", [
    {
        name: "Used",
        data: getFakeData(40)
    },
    {
        name: "Free",
        data: getFakeData(40)
    }
], chartConfig);

const processMemInfo = async () => {
    let mem = await getMemInfo()
    const elLog = $("#log-mem")

    elLog.html(imgStop)

    if (mem) {
        const memUsage = mem.used / (1024 ** 3)
        const memFree = mem.free / (1024 ** 3)

        memoryChart.addPoint(0, [datetime().time(), memUsage])
        memoryChart.addPoint(1, [datetime().time(), memFree])

        elLog.html(imgOk)
        // console.log("Mem (re)loaded!")
    }

    setTimeout(() => processMemInfo(), 2000)
}

setTimeout(() => processMemInfo(), 0)
