import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {imgOk, imgStop} from "./helpers/const";

const getSystemInfo = async () => {
    return await getInfo('static')
}

export const processSystemInfo = async () => {
    let nodeInfo = await getSystemInfo()
    let reload = globalThis.config.intervals.info //|| 60000
    const elLog = $("#log-info")

    elLog.html(imgStop)

    if (nodeInfo) {
        if (Metro.utils.isObject2(nodeInfo) && nodeInfo.osInfo) {
            $("#os-distro").text(nodeInfo.osInfo.distro)
            $("#os-kernel").text(` [Build ${nodeInfo.osInfo.release}]`)
            $("#domain-name").text(`${nodeInfo.osInfo.fqdn}`)
            $("#hostname").text(nodeInfo.osInfo.hostname)
            $("title").text(nodeInfo.osInfo.hostname + " :: Mona Node Monitor")

            $("#cpu-manufacturer").text(nodeInfo.cpu.manufacturer)
            $("#cpu-brand").text(nodeInfo.cpu.brand)
            $("#cpu-cores").text(nodeInfo.cpu.physicalCores)
            $("#cpu-threads").text(nodeInfo.cpu.cores)
            $("#cpu-speed").text(nodeInfo.cpu.speed)
            $("#cpu-max-speed").text(nodeInfo.cpu.speedMax)

            const totalRam = Math.round(nodeInfo.mem.total / (1024 ** 3))
            $("#ram-total").text(totalRam)
        }

        elLog.html(imgOk)
        // console.log("System info (re)loaded!")
    } else {
        reload = 5000
    }

    setTimeout( () => processSystemInfo(), reload)
}

// setTimeout(() => processSystemInfo(), 0)

