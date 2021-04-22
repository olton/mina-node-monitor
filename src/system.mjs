import si from "systeminformation";

export const sysInfo = async (obj) => {
    switch (obj) {
        case 'cpu': return await si.cpu()
        case 'cpu-load': return await si.currentLoad()
        case 'mem': return await si.mem()
        case 'load': return await si.currentLoad()
        case 'os': return await si.osInfo()
        case 'time': return si.time()
        case 'net-stat': return si.networkStats()
        case 'net-conn': return si.networkConnections()
        case 'static': return await si.get({
            cpu: 'manufacturer, brand, speed, speedMax, cores, physicalCores',
            mem: 'total',
            osInfo: 'platform, distro, hostname, release, kernel, build, logofile, fqdn'
        })
    }
}
