import {getInfo} from "./helpers/get-info"
import {imgOk, imgStop} from "./helpers/const";

export const processUptime = async () => {
    const elLog = $("#log-uptime")
    elLog.html(imgStop)

    let time = await getInfo("uptime")

    if (time && Array.isArray(time) && time.length) {
        let [position, publicKey, score, rate] = time
        let color = "neutral", icon = "infinite"

        if (Metro.utils.between(position, 0, 75)) {
            color = 'success'
            icon = 'checkmark'
        } else if (Metro.utils.between(position, 75, 100, true)) {
            color = 'warning'
            icon = 'warning'
        } else if (Metro.utils.between(position, 101, 120, true)) {
            color = 'alert'
            icon = 'bin'
        }

        $("#sidecar-position").text(position).removeClassBy("label-").addClass(`label-${color}`)
        $("#position-icon").removeClassBy("label-").removeClassBy("mif-").addClass(`label-${color}`).addClass(`mif-${icon}`)
        $("#sidecar-uptime").text((parseFloat(rate)) + "%")
        $("#sidecar-score").text(score)

        elLog.html(imgOk)
    }

    setTimeout(processUptime, globalThis.config.intervals.uptime)
}

