import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {imgOk, imgStop} from "./helpers/const";

export const processUptime = async () => {
    const elLog = $("#log-uptime")
    elLog.html(imgStop)

    let time = await getInfo("uptime")

    if (time && Array.isArray(time) && time.length) {
        const [position, publicKey, score, rate] = time
        let color = "fg-accent"

        if (Metro.utils.between(position, 0, 75)) {
            color = 'label-success'
        } else if (Metro.utils.between(position, 75, 100, true)) {
            color = 'label-warning'
        } else if (Metro.utils.between(position, 101, 120, true)) {
            color = 'label-alert'
        }

        $("#sidecar-position").text(position).removeClass("fg-accent").removeClassBy("label-").addClass(color)
        $("#sidecar-uptime").text((parseFloat(rate)) + "%")
        $("#sidecar-score").text(score)

        elLog.html(imgOk)
    }

    setTimeout(()=> processUptime(), globalThis.config.intervals.uptime)
}

