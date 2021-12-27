export const processServerInfo = (data) => {
    // $("#cpu-info").text(cpuInfo.model)
    $("#os-distro").text(data.osVersion)
    $("#hostname").text(data.hostname.split(".")[0])
    // $("title").text(data.hostname + " :: Mina Monitor")
}

export const processServerTime = (data) => {
    let uptime = Metro.utils.secondsToTime(data.uptime)

    $("#server-time").text(datetime(data.time).format("DD-MM-YYYY HH:mm"))
    $("#server-uptime").text(`${uptime.d}d, ${uptime.h}h ${uptime.m}m`)
}

export const processServerCpu = (data) => {
    $("#cpu-info").text(data.model)
}
