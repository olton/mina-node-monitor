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
import {processBlocks} from "./explorer";

fetch("./config.json").then( (r) => r.ok ? r.json() : null ).then(config => {
    const html = $("html")
    const body = $("body")

    globalThis.config = config

    if (config.theme === "auto") {
        globalThis.darkMode = $.dark
        if (globalThis.darkMode) {
            html.removeClass("light-mode")
            body.removeClass("light-mode")
        } else {
            html.addClass("light-mode")
            body.addClass("light-mode")
        }
    } else {
        globalThis.darkMode = config.theme !== "light"
        if (config.theme === "light") {
            html.addClass("light-mode")
            body.addClass("light-mode")
        }
    }

    globalThis.chartLineColor = globalThis.darkMode ? '#3c424b' : "#e5e5e5"
    globalThis.chartLabelColor = globalThis.darkMode ? "#fff" : "#000"
    globalThis.balance = 0
    globalThis.price = 0
    globalThis.blockSpeed = 0
    globalThis.blockHeight = 0
    globalThis.epoch = 0
    globalThis.noSlots = false

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
    setTimeout(() => processBlocks(), 0)
}).catch( reason => {
    //
})
