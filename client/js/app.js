import 'regenerator-runtime/runtime' // this required for Parcel
import {processSystemInfo} from "./server-info"
import {processCPUData, processCPUTemp} from "./cpu"
import {processRamInfo} from "./ram"
import {processNetConnections, processNetInfo} from "./net"
import {processBlockchainInfo, processBlockSpeed} from "./blockchain"
import {processNodeStatus} from "./node"
import {processConsensus} from "./consensus"
import {processUptime} from "./uptime"
import {processDelegations} from "./delegations"
import {processBlocks} from "./explorer";
import {processPrice} from "./price";

const version = `1.1.4`

$("#version").text(version)

fetch("./config.json")
    .then(r => {
        if (!r.ok) {
            throw new Error(`Config is wrong or not loaded!`)
        }
        return r.json()
    })
    .then( config => {
        globalThis.config = config

        console.info(`Mina Monitor Client config load successfully!`)

        const html = $("html")
        const body = $("body")

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
        globalThis.priceChange = 0
        globalThis.blockSpeed = 0
        globalThis.blockHeight = 0
        globalThis.epoch = 0
        globalThis.noSlots = false
        globalThis.cpuCores = 0

        if (config.blocks) {
            const container = $("#main-section-container")

            container.children().hide()

            config.blocks.forEach(b => {
                container.append($(`#${b}-group`).show())
            })
        }

        setTimeout(processPrice, 0)
        setTimeout(processSystemInfo, 0)
        setTimeout(processRamInfo, 0)
        setTimeout(processCPUData, 0)
        setTimeout(processCPUTemp, 0)
        setTimeout(processNetInfo, 0)
        setTimeout(processNetConnections, 0)
        setTimeout(processBlockchainInfo, 0 )
        setTimeout(processBlockSpeed, 0 )
        setTimeout(processNodeStatus, 0)
        setTimeout(processConsensus, 0)
        setTimeout(processUptime, 0)
        setTimeout(processDelegations, 0)
        setTimeout(processBlocks, 0)
    })
    .catch(r => {
        console.info(`Config is wrong or not loaded!`)
        console.info(r)
    })
