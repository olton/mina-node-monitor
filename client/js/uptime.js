import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {imgOk, imgStop} from "./helpers/const";

export const processUptime = async () => {
    const elLog = $("#log-uptime")
    elLog.html(imgStop)

    let time = await getInfo("uptime")

    if (time && Array.isArray(time) && time.length) {
        const [position, publicKey, score, rate] = time
        $("#sidecar-position").text(position)
        $("#sidecar-uptime").text((parseFloat(rate)) + "%")
        $("#sidecar-score").text(score)

        elLog.html(imgOk)
    }

    setTimeout(()=> processUptime(), globalThis.config.intervals.uptime)
}

