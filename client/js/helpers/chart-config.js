export const defaultChartConfig = {
    border: false,
    margin: 0,
    colors: ['#00AFF0', '#7dc37b',  '#aa00ff'],
    showDots: false,
    boundaries: {
        minY: 0,
    },
    graphSize: 40,
    tooltip: false,
}

export const defaultGaugeConfig = {
    border: false,
    fillStyle: [
        [30, '#00fa9a'],
        [60, '#60a917'],
        [80, '#f0a30a'],
        [90, '#ff6347'],
        [100, '#a20025']
    ],
    value: {
        color: "#7dc37b",
        font: {
            size: 20
        }
    },
    label: {
        min: false,
        max: false,
    },
    padding: {
        top: 20,
        bottom: 0
    },
}