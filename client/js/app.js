import "./init";
import {processSystemInfo} from "./server-info";
import {processServerTime} from "./server-time";
import {processCPUData} from "./cpu";
import {processMemInfo} from "./mem";
import {processNetConnections, processNetInfo} from "./net";
import {processBlockchainInfo, processBlockSpeed} from "./blockchain";
import {processNodeStatus} from "./node";
import {processConsensus} from "./consensus"
import {processUptime} from "./uptime"

fetch("./config.json").then( (r) => r.ok ? r.json() : null ).then(config => {
    const body = $("body")

    globalThis.config = config

    if (config.theme === "auto") {
        if ($.dark) {
            body.removeClass("light-mode")
        } else {
            body.addClass("light-mode")
        }
    } else {
        globalThis.darkMode = config.theme !== "light"

        if (config.theme === "light") {
            body.addClass("light-mode")
        }
    }

    globalThis.chartLineColor = globalThis.darkMode ? '#3c424b' : "#e5e5e5"
    globalThis.chartLabelColor = globalThis.darkMode ? "#fff" : "#000"

    setTimeout(() => processSystemInfo(), 0)
    setTimeout(() => processServerTime(), 0)
    setTimeout(() => processMemInfo(), 0)
    setTimeout(() => processCPUData(), 0)
    setTimeout(() => processNetInfo(), 0)
    setTimeout(() => processNetConnections(), 0)
    setTimeout(() => processBlockchainInfo(), 0 )
    setTimeout(() => processBlockSpeed(), 0 )
    setTimeout(() => processNodeStatus(), 0)
    setTimeout(() => processConsensus(), 0)
    setTimeout(() => processUptime(), 0)
}).catch( reason => {
    //
})
