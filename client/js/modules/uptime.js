export const processUptime = (data) => {
    if (!data) return

    const {position, rate, score} = data.uptime
    let color = "neutral", icon = "infinite"

    if (Metro.utils.between(position, 0, 150)) {
        color = 'success'
        icon = 'checkmark'
    } else if (Metro.utils.between(position, 151, 200, true)) {
        color = 'warning'
        icon = 'warning'
    } else if (Metro.utils.between(position, 201, 240, true)) {
        color = 'alert'
        icon = 'bin'
    }

    $("#sidecar-position").text(position).removeClassBy("label-").addClass(`label-${color}`)
    $("#position-icon").removeClassBy("label-").removeClassBy("mif-").addClass(`label-${color}`).addClass(`mif-${icon}`)
    $("#sidecar-uptime").text((parseFloat(rate)) + "%")
    $("#sidecar-score").text(score)

}