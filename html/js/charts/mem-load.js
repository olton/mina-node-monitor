import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "../helpers/get-info"
import {getFakeData} from "../helpers/get-fake-data";
import {merge} from "../helpers/merge";
import {loadChartConfig} from "./load-chart-config";

(async () => {
    const chartConfig = merge({}, loadChartConfig, {
        onDrawLabelX: (v) => {
            return `${datetime(+v).format("HH:mm:ss")}`
        }
    })

    // memory
    const memoryChart = chart.lineChart("#memory-load", [
        {
            name: "Used",
            data: getFakeData(40)
        },
        {
            name: "Free",
            data: getFakeData(40)
        }
    ], chartConfig)

    setInterval( async () => {
        const memory = await getInfo('mem')
        const memUsage = memory.used / (1024 ** 3)
        const memFree = memory.free / (1024 ** 3)
        const memActive = memory.active / (1024 ** 3)
        memoryChart.addPoint(0, [datetime().time(), memUsage])
        memoryChart.addPoint(1, [datetime().time(), memFree])
    }, 2000)
})()