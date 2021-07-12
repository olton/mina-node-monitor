import {getInfo} from "./helpers/get-info"
import {getFakeData} from "./helpers/get-fake-data";
import {defaultChartConfig, defaultGaugeConfig} from "./helpers/chart-config";
import {imgOk, imgStop} from "./helpers/const";

let cpuChart, cpuGauge, cpuSegment

export const processCPUData = async () => {
    const elLog = $("#log-cpu")
    elLog.html(imgStop)

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

    let cpuLoad = await getInfo('cpu-load')

    if (cpuLoad) {

        let {load = 0, user = 0, sys = 0, loadavg = [0, 0, 0], threads = []} = cpuLoad

        cpuChart.add(0, [datetime().time(), load], true)
        cpuGauge.setData([load])

        $("#threads-count").html(`${cpuLoad.threads.length} THREADS`)

        if ($("#cpu-load-all").children().length === 0) {
            cpuSegment = chart.segment("#cpu-load-all", cpuLoad.threads, {
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
            cpuLoad.threads.forEach( (v, i) => {
                cpuSegment.setData(v, i)
            })
        }

        $("#loadavg").html(`<span class="text-bold">${loadavg[0]}</span> <span>${loadavg[1]}</span> <span>${loadavg[2]}</span>`)
        $("#cpu-threads").html(`${threads.length}`)
        $("#cpu-cores").html(`${globalThis.cpuCores ? globalThis.cpuCores : threads.length / 2}`)

        elLog.html(imgOk)
    }

    setTimeout( processCPUData, globalThis.config.intervals.resources )
}


export const processCPUTemp = async () => {
    const temp = await getInfo("cpu-temp")

    if (temp && temp.main) {
        let tempColor,tempAvgColor
        let tempAvg = (temp.cores.reduce((acc, v)=>acc+ +v, 0) / temp.cores.length).toFixed(0)

        tempColor = tempAvgColor = "fg-cyan"

        if (temp.main >= 65 && temp.main < 85) {
            tempColor = "fg-orange"
        } else if (temp.main >= 85) {
            tempColor = "fg-red"
        }

        if (tempAvg >= 65 && tempAvg < 85) {
            tempAvgColor = "fg-orange"
        } else if (tempAvg >= 85) {
            tempAvgColor = "fg-red"
        }

        $("#cpu-temp-avg").html(`${tempAvg}<span>&#8451;</span>`).removeClassBy("fg-").addClass(tempAvgColor)
        $("#cpu-temp-max").html(`<small class="fg-normal reduce-4">MAX</small> ${temp.main}<span>&#8451;</span>`).removeClassBy("fg-").addClass(tempColor)
        $("#cpu-temp-main").html(`${temp.main}<span>&#8451;</span>`)
        $("#cpu-temp-cores").html(`[${temp.cores.join(", ")}]`)

        globalThis.cpuCores = temp.cores.length
    }

    setTimeout(processCPUTemp, globalThis.config.intervals.resources )
}