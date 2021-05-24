import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {imgOk, imgStop} from "./helpers/const";

export const processSystemInfo = async () => {
    const elLog = $("#log-info")
    elLog.html(imgStop)

    let cpuInfo = await getInfo('cpu')
    let memInfo = await getInfo('mem')
    let platformInfo = await getInfo('platform')
    let reload = globalThis.config.intervals.info


    $("#cpu-info").text(cpuInfo.model)
    $("#ram-total").text(Math.round(memInfo.total / (1024 ** 3)))
    $("#os-distro").text(platformInfo.osVersion)
    $("#hostname").text(platformInfo.hostname.split(".")[0])
    $("#vcpu").text(cpuInfo.cores)
    $("title").text(platformInfo.hostname + " :: Mina Monitor")

    elLog.html(imgOk)

    setTimeout( () => processSystemInfo(), reload)
}

