import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"

(async () => {
    // const storage = Metro.storage
    // let nodeInfo

    // storage.setKey('NODE_MONITOR')
    // nodeInfo = storage.getItem('nodeInfo', false)

    // if (!nodeInfo) {
    //     storage.setItem('nodeInfo', nodeInfo)
    // }

    // if (typeof nodeInfo === "string") nodeInfo = JSON.parse(nodeInfo)

    let nodeInfo = await getInfo('static')

    if (nodeInfo && Metro.utils.isObject2(nodeInfo) && nodeInfo.osInfo) {
        $("#os-distro").text(nodeInfo.osInfo.distro)
        $("#os-kernel").text(` [Build ${nodeInfo.osInfo.kernel}]`)
        $("#hostname").text(nodeInfo.osInfo.hostname)

        $("#cpu-manufacturer").text(nodeInfo.cpu.manufacturer)
        $("#cpu-brand").text(nodeInfo.cpu.brand)
        $("#cpu-cores").text(nodeInfo.cpu.physicalCores)
        $("#cpu-threads").text(nodeInfo.cpu.cores)
        $("#cpu-speed").text(nodeInfo.cpu.speed)
        $("#cpu-max-speed").text(nodeInfo.cpu.speedMax)

        const totalRam = Math.round(nodeInfo.mem.total / (1024 ** 3))
        $("#ram-total").text(totalRam + ' GiB')
        $("#memory-total").text(totalRam + ' GiB')
    }
})()

