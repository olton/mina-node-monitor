import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"

export const processUptime = async () => {
    let time = await getInfo("uptime")

    if (time && Array.isArray(time) && time.length) {
        console.log(time)
        $("#sidecar-position").text(time[0])
        $("#sidecar-uptime").text(Math.floor(parseFloat(time[2])) + "%")
    }

    setTimeout(()=> processUptime(), globalThis.config.intervals.uptime)
}

