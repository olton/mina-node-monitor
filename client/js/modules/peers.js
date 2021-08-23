import {getFakeTriplets} from "../helpers/get-fake-data";
import {defaultChartConfig} from "../helpers/chart-config";

let peersChart, startNodePoints = 200

export const processNodePeers = data => {
    if (!data) return

    if (!peersChart) {
        peersChart = chart.histogramChart('#peers-load', [
            getFakeTriplets(20, 40, 60, 0)
        ], {
            ...defaultChartConfig,
            bars: [{
                name: "Peers",
                stroke: globalThis.darkMode ? '#22272e' : '#fff',
                color: Metro.colors.toRGBA('#00AFF0', .5)
            }],
            boundaries: {
                maxY: 100,
                minY: 0
            },
            graphSize: 20,
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
                    arrow: false
                },
                y: {
                    line: {
                        color: globalThis.chartLineColor
                    },
                    label: {
                        count: 10,
                        font: {
                            size: 10
                        },
                        color: globalThis.chartLabelColor,
                        skip: 2,
                        fixed: 0
                    },
                    arrow: false,
                }
            },
            padding: {
                left: 30,
                top: 5,
                right: 1,
                bottom: 10
            },
            height: 160,
            onDrawLabelX: () => {
                return ""
            },
            onDrawLabelY: (v) => {
                return `${v}`
            }
        })
    }

    startNodePoints += 10
    peersChart.add(0, [startNodePoints - 10, startNodePoints, data.length], true)
    $("#peers-count").text(data.length)
}
