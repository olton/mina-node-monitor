import {defaultChartConfig, defaultGaugeConfig} from "../helpers/chart-config";
import {getFakeData} from "../helpers/get-fake-data";

let cpuChart, cpuGauge, cpuSegment

export const processCpuLoad = data => {
    if (!data) return

    if (!cpuGauge) {
        cpuGauge = chart.gauge('#cpu-use', [0], {
            ...defaultGaugeConfig,
            backStyle: globalThis.darkMode ? '#1e2228' : '#f0f6fc',
            padding: 0,
            onDrawValue: (v, p) => {
                return +p.toFixed(0) + "%"
            }
        })
    }

    if (!cpuChart) {
        cpuChart = chart.areaChart( "#cpu-load", [
            getFakeData(40)
        ], {
            ...defaultChartConfig,
            height: 110,
            areas: [
                {
                    name: "CPU usage"
                }
            ],
            colors: [Metro.colors.toRGBA('#00AFF0', .5), Metro.colors.toRGBA('#aa00ff', .5)],
            legend: false,
            axis: {
                x: {
                    line: {
                        color: globalThis.chartLineColor,
                        shortLineSize: 0
                    },
                    label: {
                        count: 10,
                        color: globalThis.chartLabelColor,
                    },
                },
                y: {
                    line: {
                        color: globalThis.chartLineColor
                    },
                    label: {
                        count: 10,
                        color: globalThis.chartLabelColor,
                        font: {
                            size: 10
                        },
                        skip: 2,
                    },
                }
            },
            arrows: false,
            padding: {
                left: 1,
                top: 1,
                right: 1,
                bottom: 1
            },
            margin: 0,
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
        })
    }

    let {load = 0, user = 0, sys = 0, loadavg = [0, 0, 0], threads = []} = data

    cpuChart.add(0, [datetime().time(), load], true)
    cpuGauge.setData([load])

    $("#threads-count").html(`${threads.length} THREADS`)

    if ($("#cpu-load-all").children().length === 0) {
        cpuSegment = chart.segment("#cpu-load-all", threads, {
            height: 100,
            padding: {
                left: 2,
                right: 2,
                top: 0,
                bottom: 0
            },
            margin: 0,
            segment: {
                rowDistance: 4,
                count: 40
            },
            colors: [ [70, '#60a917'], [90, '#f0a30a'], [100, '#a20025'] ],
            border: {
                color: globalThis.chartLineColor
            },
            ghost: {
                color: globalThis.darkMode ? "rgba(125, 195, 123, .1)" : "#f0f6fc"
            }
        })
    } else {
        threads.forEach( (v, i) => {
            cpuSegment.setData(v, i)
        })
    }

    $("#loadavg").html(`<span class="text-bold">${loadavg[0]}</span> <span>${loadavg[1]}</span> <span>${loadavg[2]}</span>`)
    $("#cpu-threads").html(`${threads.length}`)
    $("#cpu-cores").html(`${globalThis.cpuCores ? globalThis.cpuCores : threads.length / 2}`)

}

export const processCpuTemp = data => {
    if (!data) return

    const elTempAvg = $("#cpu-temp-avg")
    const elTempMax = $("#cpu-temp-max")
    const elTempMain = $("#cpu-temp-main")
    const elTempCores = $("#cpu-temp-cores")

    let {main = 0, cores = []} = data
    let tempColor,tempAvgColor
    let tempAvg = (cores.reduce((acc, v)=>acc+ +v, 0) / cores.length).toFixed(0)

    tempColor = tempAvgColor = "fg-cyan"

    if (!main) main = 0
    if (isNaN(tempAvg)) tempAvg = 0

    if (main >= 65 && main < 85) {
        tempColor = "fg-orange"
    } else if (main >= 85) {
        tempColor = "fg-red"
    }

    if (tempAvg >= 65 && tempAvg < 85) {
        tempAvgColor = "fg-orange"
    } else if (tempAvg >= 85) {
        tempAvgColor = "fg-red"
    }

    elTempAvg.html(`${tempAvg}<span>&#8451;</span>`).removeClassBy("fg-").addClass(tempAvgColor)
    elTempMax.html(`<small class="fg-normal reduce-4">MAX</small> ${main}<span>&#8451;</span>`).removeClassBy("fg-").addClass(tempColor)
    elTempMain.html(`${main}<span>&#8451;</span>`)
    elTempCores.html(`[${cores.join(", ")}]`)

    globalThis.cpuCores = cores.length
}