import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {imgOk, imgStop} from "./helpers/const";

export const processUptime = async () => {
    const elLog = $("#log-uptime")
    elLog.html(imgStop)

    let time = await getInfo("uptime")

    if (time && Array.isArray(time) && time.length) {
        const [position, publicKey, score, rate] = time
        let color = "label-success"

        if (Metro.utils.between(position, 75, 100)) {
            color = 'label-warning'
        } else if (Metro.utils.between(position, 100, 120, true)) {
            color = 'label-alert'
        }

        $("#sidecar-position").text(position).removeClassBy("label-").addClass(color)
        $("#sidecar-uptime").text((parseFloat(rate)) + "%")
        $("#sidecar-score").text(score)

        elLog.html(imgOk)
    }

    setTimeout(()=> processUptime(), globalThis.config.intervals.uptime)
}

