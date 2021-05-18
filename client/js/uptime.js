import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {imgOk, imgStop} from "./helpers/const";

export const processUptime = async () => {
    const elLog = $("#log-uptime")
    elLog.html(imgStop)

    let time = await getInfo("uptime")

    if (time && Array.isArray(time) && time.length) {
        $("#sidecar-position").text(time[0])
        $("#sidecar-uptime").text(Math.floor(parseFloat(time[2])) + "%")

        elLog.html(imgOk)
    }

    setTimeout(()=> processUptime(), globalThis.config.intervals.uptime)
}

