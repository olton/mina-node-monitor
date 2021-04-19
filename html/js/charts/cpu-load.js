import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "../helpers/get-info"
import {getFakeData} from "../helpers/get-fake-data";
import {merge} from "../helpers/merge";
import {loadChartConfig} from "./load-chart-config";

(async () => {
    const chartConfig = merge({}, loadChartConfig, {
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
    // memory

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
    ], chartConfig)

    setInterval( async () => {
        const load = await getInfo('cpu-load')
        cpuChart.addPoint(0, [datetime().time(), load.currentLoad])
        cpuChart.addPoint(1, [datetime().time(), load.currentLoadUser])
        cpuChart.addPoint(2, [datetime().time(), load.currentLoadSystem])
    }, 2000)
})()