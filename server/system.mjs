import si from "systeminformation"
import os from "os"
import {execSync} from "child_process"

const getMem = () => {
    const total = os.totalmem()
    const free = os.freemem()
    return {
        total,
        free,
        used: total - free
    }
}

const getCpuAverage = () => {
    const cpus = os.cpus()
    let sys = 0, user = 0, idle = 0, total = 0, load = 0

    for(let cpu of cpus) {
        for(let type in cpu.times) {
            total += cpu.times[type]
        }
        sys += cpu.times.sys
        user += cpu.times.user
        idle += cpu.times.idle
    }

    return {
        sys,
        user,
        idle,
        total,
        cpus
    }
}

const getCpuLoad = () => {
    const startMeasure = getCpuAverage()
    const startCPU = startMeasure.cpus

    return new Promise((resolve) => {
        setTimeout( () => {
            const endMeasure = getCpuAverage()
            const endCPU = endMeasure.cpus
            const threads = []

            let idleDiff = endMeasure.idle - startMeasure.idle
            let totalDiff = endMeasure.total - startMeasure.total
            let userDiff = endMeasure.user - startMeasure.user
            let sysDiff = endMeasure.sys - startMeasure.sys

            endCPU.forEach( (cpu, i) => {
                let totalDiff = (cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.irq + cpu.times.idle) - (startCPU[i].times.user + startCPU[i].times.nice + startCPU[i].times.sys + startCPU[i].times.irq + startCPU[i].times.idle)
                let idleDiff = cpu.times.idle - startCPU[i].times.idle

                threads.push(100 - ~~(100 * idleDiff / totalDiff))
            })

            resolve({
                load: 100 - ~~(100 * idleDiff / totalDiff),
                user: 100 - (100 - ~~(100 * userDiff / totalDiff)),
                sys: 100 - (100 - ~~(100 * sysDiff / totalDiff)),
                loadavg: os.loadavg(),
                threads
            })
        }, 200)
    })
}

const getCpuInfo = () => {
    const cpus = os.cpus()
    const cores = cpus.length
    const model = cpus[0]["model"]
    const speed = cpus[0]["speed"]

    return {
        model,
        cores,
        speed,
    }
}

const getServerTime = () => {
    return {
        time: new Date(),
        uptime: os.uptime()
    }
}

const getOsVersion = () => {
    if (process.platform === 'win32') {
        return execSync('ver').toString().trim()
    } else {
        return execSync('cat /etc/os-release | grep PRETTY_NAME').toString().split("=")[1].replace(/"/g, "")
    }
}

const getPlatform = () => {
    return {
        hostname: os.hostname(),
        platform: os.platform(),
        release: os.release(),
        type: os.type(),
        version: os.version(),
        osVersion: getOsVersion()
    }
}

export const sysInfo = async (obj) => {
    switch (obj) {
        case 'cpu': return getCpuInfo()
        case 'mem': return getMem()
        case 'platform': return getPlatform()
        case 'time': return getServerTime()
        case 'cpu-load': return await getCpuLoad()

        case 'net-stat': return si.networkStats()
        case 'net-conn': return si.networkConnections()
    }
}
