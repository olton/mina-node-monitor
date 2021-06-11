import {processSystemInfo} from "./server-info"
import {processServerTime} from "./server-time"
import {processCPUData, processCPUTemp} from "./cpu"
import {processMemInfo} from "./mem"
import {processNetConnections, processNetInfo} from "./net"
import {processBlockchainInfo, processBlockSpeed} from "./blockchain"
import {processNodeStatus} from "./node"
import {processConsensus} from "./consensus"
import {processUptime} from "./uptime"
import {processDelegations} from "./delegations"
import {processCoingecko} from "./coingecko";

fetch("./config.json").then( (r) => r.ok ? r.json() : null ).then(config => {
    const body = $("body")
    const html = $("html")

    globalThis.config = config

    if (config.theme === "auto") {
        if ($.dark) {
            body.removeClass("light-mode")
            html.removeClass("light-mode")
        } else {
            body.addClass("light-mode")
            html.addClass("light-mode")
        }
    } else {
        globalThis.darkMode = config.theme !== "light"

        if (config.theme === "light") {
            body.addClass("light-mode")
            html.addClass("light-mode")
        }
    }

    globalThis.chartLineColor = globalThis.darkMode ? '#3c424b' : "#e5e5e5"
    globalThis.chartLabelColor = globalThis.darkMode ? "#fff" : "#000"
    globalThis.balance = 0
    globalThis.price = 0

    setTimeout(() => processCoingecko(), 0)
    setTimeout(() => processSystemInfo(), 0)
    setTimeout(() => processServerTime(), 0)
    setTimeout(() => processMemInfo(), 0)
    setTimeout(() => processCPUData(), 0)
    setTimeout(() => processCPUTemp(), 0)
    setTimeout(() => processNetInfo(), 0)
    setTimeout(() => processNetConnections(), 0)
    setTimeout(() => processBlockchainInfo(), 0 )
    setTimeout(() => processBlockSpeed(), 0 )
    setTimeout(() => processNodeStatus(), 0)
    setTimeout(() => processConsensus(), 0)
    setTimeout(() => processUptime(), 0)
    setTimeout(() => processDelegations(), 0)
}).catch( reason => {
    //
})
