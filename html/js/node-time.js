import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"

const getNodeTime = async () => {
    let time = await getInfo('time')
    let uptime = Metro.utils.secondsToTime(time.uptime)
    $("#server-time").text(datetime(time.current).format("DD-MM-YYYY HH:mm"))
    $("#server-uptime").text(`${uptime.d} day(s) ${uptime.h} hours ${uptime.m} min`)
}

setTimeout( async () => await getNodeTime(), 0)
setInterval( async () => await getNodeTime(), 60000)
