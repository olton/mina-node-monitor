import {networkStats, networkConnections} from "systeminformation"
import os from "os"
import {execSync, exec} from "child_process"
import {stat, readFile} from "fs"

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

const getCpuTemperature = () => {
    return new Promise((resolve) => {
        process.nextTick(()=>{
            let result = {
                main: null,
                cores: [],
                max: null
            }
            if (process.platform === 'linux') {
                const cmd = 'for mon in /sys/class/hwmon/hwmon*; do for label in "$mon"/temp*_label; do if [ -f $label ]; then value=$(echo $label | rev | cut -c 7- | rev)_input; if [ -f "$value" ]; then echo $(cat "$label")___$(cat "$value");  fi; fi; done; done;'
                try {
                    exec(cmd, function (error, stdout) {
                        let lines = stdout.toString().split('\n')
                        lines.forEach(line => {
                            const parts = line.split('___')
                            const label = parts[0]
                            const value = parts.length > 1 && parts[1] ? parts[1] : '0'
                            if (value && (label === undefined || (label && label.toLowerCase().startsWith('core')))) {
                                result.cores.push(Math.round(parseInt(value, 10) / 100) / 10)
                            } else if (value && label && result.main === null) {
                                result.main = Math.round(parseInt(value, 10) / 100) / 10
                            }
                        })

                        if (result.cores.length > 0) {
                            if (result.main === null) {
                                result.main = Math.round(result.cores.reduce((a, b) => a + b, 0) / result.cores.length)
                            }
                            let maxtmp = Math.max.apply(Math, result.cores)
                            result.max = (maxtmp > result.main) ? maxtmp : result.main
                        }
                        if (result.main !== null) {
                            if (result.max === null) {
                                result.max = result.main
                            }
                            resolve(result)
                            return
                        }
                        exec('sensors', function (error, stdout) {
                            if (!error) {
                                let lines = stdout.toString().split('\n')
                                let tdieTemp = null
                                let newSectionStarts = true
                                let section = ''
                                lines.forEach(function (line) {
                                    // determine section
                                    if (line.trim() === '') {
                                        newSectionStarts = true
                                    } else if (newSectionStarts) {
                                        if (line.trim().toLowerCase().startsWith('core')) { section = 'core'  }
                                        newSectionStarts = false
                                    }
                                    let regex = /[+-]([^°]*)/g
                                    let temps = line.match(regex)
                                    let firstPart = line.split(':')[0].toUpperCase()

                                    // cpu temp
                                    if (firstPart.indexOf('PHYSICAL') !== -1 || firstPart.indexOf('PACKAGE') !== -1) {
                                        result.main = parseFloat(temps)
                                    }
                                    if (firstPart.indexOf('CORE ') !== -1) {
                                        result.cores.push(parseFloat(temps))
                                    }
                                    if (firstPart.indexOf('TDIE') !== -1 && tdieTemp === null) {
                                        tdieTemp = parseFloat(temps)
                                    }
                                })
                                if (result.cores.length > 0) {
                                    if (result.main === null) {
                                        result.main = Math.round(result.cores.reduce((a, b) => a + b, 0) / result.cores.length)
                                    }
                                    let maxtmp = Math.max.apply(Math, result.cores)
                                    result.max = (maxtmp > result.main) ? maxtmp : result.main
                                } else {
                                    if (result.main === null && tdieTemp !== null) {
                                        result.main = tdieTemp
                                        result.max = tdieTemp
                                    }
                                }
                                if (result.main !== null || result.max !== null) {
                                    resolve(result)
                                    return
                                }
                            }
                            stat('/sys/class/thermal/thermal_zone0/temp', function (err) {
                                if (err === null) {
                                    readFile('/sys/class/thermal/thermal_zone0/temp', function (error, stdout) {
                                        if (!error) {
                                            let lines = stdout.toString().split('\n')
                                            if (lines.length > 0) {
                                                result.main = parseFloat(lines[0]) / 1000.0
                                                result.max = result.main
                                            }
                                        }
                                        resolve(result)
                                    })
                                } else {
                                    exec('/opt/vc/bin/vcgencmd measure_temp', function (error, stdout) {
                                        if (!error) {
                                            let lines = stdout.toString().split('\n')
                                            if (lines.length > 0 && lines[0].indexOf('=')) {
                                                result.main = parseFloat(lines[0].split('=')[1])
                                                result.max = result.main
                                            }
                                        }
                                        resolve(result)
                                    })
                                }
                            })
                        })
                    })
                } catch (er) {
                    resolve(result)
                }
            } else {
                resolve(result)
            }
        })
    })
}

export const sysInfo = async (obj) => {
    switch (obj) {
        case 'cpu': return getCpuInfo()
        case 'mem': return getMem()
        case 'platform': return getPlatform()
        case 'time': return getServerTime()
        case 'cpu-load': return await getCpuLoad()
        case 'cpu-temp': return await getCpuTemperature()

        case 'net-stat': return await networkStats()
        case 'net-conn': return await networkConnections()
    }
}
