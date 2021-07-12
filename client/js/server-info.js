import {getInfo} from "./helpers/get-info"
import {imgOk, imgStop} from "./helpers/const";

export const processSystemInfo = async () => {
    const elLog = $("#log-info")
    elLog.html(imgStop)

    let cpuInfo = await getInfo('cpu')
    let memInfo = await getInfo('mem')
    let platformInfo = await getInfo('platform')
    let time = await getInfo('time'), uptime = Metro.utils.secondsToTime(time.uptime)

    $("#cpu-info").text(cpuInfo.model)
    $("#ram-total").text(Math.round(memInfo.total / (1024 ** 3)))
    $("#os-distro").text(platformInfo.osVersion)
    $("#full-hostname").text(globalThis.config.showIp ? platformInfo.hostname : 'localhost')
    $("#hostname").text(platformInfo.hostname.split(".")[0])
    $("title").text(platformInfo.hostname + " :: Mina Monitor")
    $("#server-time").text(datetime(time.time).format("DD-MM-YYYY HH:mm"))
    $("#server-uptime").text(`${uptime.d}d, ${uptime.h}h ${uptime.m}m`)

    elLog.html(imgOk)

    setTimeout( processSystemInfo, globalThis.config.intervals.system)
}

