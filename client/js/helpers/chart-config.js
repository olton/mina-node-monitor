export const defaultChartConfig = {
    border: false,
    legend: {
        margin: {
            top: 25
        },
        font: {
            color: $.dark ? "#fff" : "#000"
        },
    },
    margin: 0,
    padding: {
        left: 40,
        right: 10,
        top: 10,
        bottom: 50
    },
    colors: ['#00AFF0', '#7dc37b',  '#aa00ff'],
    showDots: false,
    boundaries: {
        minY: 0,
    },
    graphSize: 40,
    axis: {
        x: {
            line: {
                count: 10,
                color: $.dark ? '#444c56' : "#f0f6fc"
            },
            label: {
                count: 3,
                color: $.dark ? "#fff" : "#000",
                font: {
                    size: 10
                },
                fixed: 0,
                first: true,
            },
            arrow: {
                color: '#22272e'
            }
        },
        y: {
            line: {
                count: 10,
                color: $.dark ? '#444c56' : "#f0f6fc"
            },
            label: {
                fixed: 0,
                color: $.dark ? "#fff" : "#000",
                font: {
                    size: 10
                }
            },
            arrow: {
                color: '#22272e'
            }
        }
    },
    tooltip: false,
}

export const defaultGaugeConfig = {
    border: false,
    backStyle: $.dark ? '#1e2228' : '#f0f6fc',
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