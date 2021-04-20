import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {imgOk, imgStop} from "./helpers/const";

const getServerTime = async () => {
    return await getInfo('time')
}

const processServerTime = async () => {
    let time = await getInfo('time')
    const elLog = $("#log-time")

    elLog.html(imgStop)

    if (time) {
        let uptime = Metro.utils.secondsToTime(time.uptime)
        $("#server-time").text(datetime(time.current).format("DD-MM-YYYY HH:mm"))
        $("#server-uptime").text(`${uptime.d} day(s) ${uptime.h} hours ${uptime.m} min`)
        elLog.html(imgOk)
        // console.log("Server time (re)loaded!")
    }

    setTimeout(()=> processServerTime(), 60000)
}

setTimeout(() => processServerTime(), 0)
