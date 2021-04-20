export const defaultChartConfig = {
    border: false,
    legend: {
        margin: {
            top: 25
        },
        font: {
            color: '#fff'
        }
    },
    margin: 0,
    padding: {
        left: 40,
        right: 10,
        top: 20,
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
                color: '#444c56'
            },
            label: {
                count: 3,
                color: '#fff',
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
                color: '#444c56'
            },
            label: {
                fixed: 0,
                color: '#fff',
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