export const processUptime = (data) => {
    if (!data) return

    const {position, rate, score} = data
    let color = "neutral", icon = "infinite"

    // if (Metro.utils.between(position, 0, 75)) {
    //     color = 'success'
    //     icon = 'checkmark'
    // } else if (Metro.utils.between(position, 75, 100, true)) {
    //     color = 'warning'
    //     icon = 'warning'
    // } else if (Metro.utils.between(position, 101, 120, true)) {
    //     color = 'alert'
    //     icon = 'bin'
    // }

    $("#sidecar-position").text(position).removeClassBy("label-").addClass(`label-${color}`)
    $("#position-icon").removeClassBy("label-").removeClassBy("mif-").addClass(`label-${color}`).addClass(`mif-${icon}`)
    $("#sidecar-uptime").text((parseFloat(rate)) + "%")
    $("#sidecar-score").text(score)

}