import 'regenerator-runtime/runtime' // this required for Parcel

import "../vendor/metro4/css/metro-all.css"
import "../css/index.less"
import "../vendor/metro4/js/metro"
import "../vendor/chart/chart"
import {processServerCpu, processServerInfo, processServerTime} from "./modules/server-info"
import {processDelegations} from "./modules/delegations"
import {processMinaPrice} from "./modules/price"
import {processUptime} from "./modules/uptime"
import {processMem} from "./modules/mem";
import {processCpuLoad, processCpuTemp} from "./modules/cpu";
import {processNetConn, processNetStat} from "./modules/network";
import {processNodePeers} from "./modules/peers";
import {processState} from "./modules/state";
import {processHealth} from "./modules/health";
import {processBalance} from "./modules/balance";
import {processSpeed} from "./modules/speed";
import {processBlockchain} from "./modules/blockchain";
import {processNextBlock} from "./modules/next-block";
import {processDaemonInfo} from "./modules/daemon";
import {processConsensus} from "./modules/consensus";
import {copy2clipboard} from "./helpers/clipboard";
import {processVersion} from "./modules/version";
import {processRewards} from "./modules/rewards";

const version = require("../package.json").version

$("#version").text(version)
$("title").text(`Mina Node Monitor v${version}`)

fetch("./config.json")
.then(r => {
    if (!r.ok) {
        throw new Error(`Config is wrong or not loaded!`)
    }
    return r.json()
})
.then( config => {
    globalThis.config = config
    const {theme, host, https} = config

    console.info(`Mina Monitor Client config load successfully!`)

    const html = $("html")
    const body = $("body")

    if (theme === "auto") {
        globalThis.darkMode = $.dark
        if (globalThis.darkMode) {
            html.removeClass("light-mode")
            body.removeClass("light-mode")
        } else {
            html.addClass("light-mode")
            body.addClass("light-mode")
        }
    } else {
        globalThis.darkMode = theme !== "light"
        if (theme === "light") {
            html.addClass("light-mode")
            body.addClass("light-mode")
        }
    }

    globalThis.chartLineColor = globalThis.darkMode ? '#3c424b' : "#e5e5e5"
    globalThis.chartLabelColor = globalThis.darkMode ? "#fff" : "#000"
    globalThis.chartBackground = globalThis.darkMode ? "#000000" : "#ffffff"

    const connect = () => {
        const ws = new WebSocket(`${https ? 'wss' : 'ws'}://${host}`)
        ws.onmessage = event => {
            try {
                const content = JSON.parse(event.data)
                if (!content.action) return
                const {action, data} = content

                switch (action) {
                    case 'platform': processServerInfo(data); break;
                    case 'time': processServerTime(data); break;
                    case 'cpu': processServerCpu(data); break;
                    case 'price': processMinaPrice(data); break;
                    case 'uptime': processUptime(data); break;
                    case 'mem': processMem(data); break;
                    case 'cpuLoad': processCpuLoad(data); break;
                    case 'cpuTemp': processCpuTemp(data); break;
                    case 'netConn': processNetConn(data); break;
                    case 'netStat': processNetStat(data); break;
                    case 'delegations': processDelegations(data); break;
                    case 'peers': processNodePeers(data); break;
                    case 'state': processState(data); break;
                    case 'health': processHealth(data); break;
                    case 'balance': processBalance(data); break;
                    case 'speed': processSpeed(data); break;
                    case 'blockchain': processBlockchain(data); break;
                    case 'nextBlock': processNextBlock(data); break;
                    case 'daemon': processDaemonInfo(data); break;
                    case 'consensus': processConsensus(data); break;
                    case 'version': processVersion(data); break;
                    case 'rewards': processRewards(data); break;
                    case 'welcome': console.log(data); break;
                    case 'explorerSummary': console.log(data); break;
                    // default: console.log(action, data)
                }

            } catch (e) {
                console.log(e.message)
                console.log(event.data)
            }
        }

        ws.onerror = error => {
            console.error('Socket encountered error: ', error.message, 'Closing socket');
            ws.close();
        }

        ws.onclose = event => {
            console.log('Socket is closed. Reconnect will be attempted in 1 second.', event.reason);
            setTimeout( connect, 1000)
        }
    }

    connect()

    globalThis.balance = 0
    globalThis.price = 0
    globalThis.priceChange = 0
    globalThis.priceCurrency = ""
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
})
.catch(r => {
    console.info(`Config is wrong or not loaded!`)
    console.info(r)
})


$("#node-version, #block-producer, #snark-worker, .donate-mina").on("click", function(){
    let val = $(this).attr("data-full-name")
    copy2clipboard(val)
})