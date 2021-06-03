import 'regenerator-runtime/runtime' // this required for Parcel
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
        cpuChart = chart.areaChart("#cpu-load", [
            getFakeData(40)
        ], {
            ...defaultChartConfig,
            height: 100,
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

        elLog.html(imgOk)
    }

    setTimeout( () => processCPUData(), globalThis.config.intervals.cpu )
}
