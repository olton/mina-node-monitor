import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {imgOk, imgStop} from "./helpers/const";

const getServerTime = async () => {
    return await getInfo('time')
}

export const processServerTime = async () => {
    let time = await getServerTime()
    const elLog = $("#log-time")

    elLog.html(imgStop)

    if (time) {
        let uptime = Metro.utils.secondsToTime(time.uptime)
        $("#server-time").text(datetime(time.current).format("DD-MM-YYYY HH:mm"))
        $("#server-uptime").text(`${uptime.d}d, ${uptime.h}h ${uptime.m}m`)
        elLog.html(imgOk)
        // console.log("Server time (re)loaded!")
    }

    setTimeout(()=> processServerTime(), globalThis.config.intervals.time)
}

// setTimeout(() => processServerTime(), 0)
