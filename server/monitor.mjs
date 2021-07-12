#!/usr/bin/env node

import fs from "fs"
import path, {dirname} from "path"
import { fileURLToPath } from 'url'
import http from "http"
import https from "https"
import {sysInfo} from "./system.mjs"
import {processCollectNodeInfo} from "./node.mjs"
import {getBlocks, processExplorer, processWinningBlocks} from "./explorer.mjs"
import {processAlerter} from "./alerter.mjs"
import {processBalanceSend} from "./balance-sender.mjs"
import {processHello} from "./hello.mjs"
import {processNodeUptime} from "./uptime.mjs"
import {processGetDelegations} from "./ledger.mjs";
import {getPriceInfo, processPriceInfo} from "./coingecko.mjs";
import {processPriceSend} from "./price-sender.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url))
const configPath = path.resolve(__dirname, 'config.json')

if (!fs.existsSync(configPath)) {
    throw new Error("Config file not exist!")
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
const [SERVER_HOST, SERVER_PORT] = config.host.split(":")

globalThis.config = config
globalThis.hangTimer = 0
globalThis.restartTimer = 0
globalThis.restartTimerPrev = 0
globalThis.restartTimerNotSynced = 0
globalThis.sendAlertTimerPeers = 0
globalThis.sendAlertTimerMax = 0
globalThis.sendAlertTimerUnv = 0
globalThis.sendAlertTimerNotSynced = 0
globalThis.currentBalance = 0
globalThis.currentHeight = 0
globalThis.currentControlHeight = 0
globalThis.controlCounter = 0
globalThis.nodeInfo = {
    nodeStatus: null,
    balance: null,
    blockchain: null,
    consensus: null,
    blockSpeed: null,
    delegations: null,
    uptime: null,
    winningBlocks: null,
    health: []
}
globalThis.explorerInfo = {
    summary: null
}
globalThis.priceInfo = null

let server, useHttps = config.https && (config.https.cert && config.https.key)

const requestListener = async (req, res) => {
    let response, _url = new URL(`${config.useHttps ? 'https' : 'http'}://${SERVER_HOST}:${SERVER_PORT}${req.url}`)

    res.setHeader("Content-Type", "application/json")
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.writeHead(200)

    switch (_url.pathname) {
        case '/platform': response = await sysInfo('platform'); break;
        case '/mem': response = await sysInfo('mem'); break;
        case '/cpu': response = await sysInfo('cpu'); break;
        case '/cpu-load': response = await sysInfo('cpu-load'); break;
        case '/cpu-temp': response = await sysInfo('cpu-temp'); break;
        case '/time': response = await sysInfo('time'); break;
        case '/net-stat': response = await sysInfo('net-stat'); break;
        case '/net-conn': response = await sysInfo('net-conn'); break;

        case '/consensus': response = globalThis.nodeInfo.consensus; break;
        case '/blockchain': response = globalThis.nodeInfo.blockchain; break;
        case '/node-status': response = globalThis.nodeInfo.nodeStatus; break;
        case '/balance': response = globalThis.nodeInfo.balance; break;
        case '/block-speed': response = globalThis.nodeInfo.blockSpeed; break;
        case '/health': response = globalThis.nodeInfo.health; break;
        case '/uptime': response = globalThis.nodeInfo.uptime; break;
        case '/delegations': response = globalThis.nodeInfo.delegations; break;
        case '/explorer': response = globalThis.explorerInfo.summary; break;
        case '/price': response = globalThis.priceInfo; break;

        case '/price-for': response = await getPriceInfo(_url.searchParams.get('currency') ?? 'usd'); break;
        case '/winning-blocks': response = globalThis.nodeInfo.winningBlocks; break;
        case '/blocks': response = await getBlocks({
            creator: config.publicKeyDelegators,
            epoch: _url.searchParams.get('epoch') ?? 0,
            blockHeightMin: _url.searchParams.get('blockHeightMin') ?? 0,
            blockHeightMax: _url.searchParams.get('blockHeightMax') ?? 0
        }); break;

        default:
            response = "OK"
    }

    res.end(JSON.stringify(response))
}

if (useHttps) {
    const ssl_options = {
        key: fs.readFileSync(__dirname + '/' + config.https.key),
        cert: fs.readFileSync(__dirname + '/' + config.https.cert)
    };
    server = https.createServer(ssl_options, requestListener)
} else {
    server = http.createServer(requestListener)
}

server.listen(+SERVER_PORT, SERVER_HOST, () => {
    console.log(`Mina Monitor Server is running on ${useHttps ? 'https' : 'http'}://${SERVER_HOST}:${SERVER_PORT}`)
})

setTimeout( processHello, 0)
setTimeout( processAlerter, 0)
setTimeout( processBalanceSend, 0)
setTimeout( processPriceSend, 0)
setTimeout( processCollectNodeInfo, 0)
setTimeout( processNodeUptime, 0)
setTimeout( processGetDelegations, 0)
setTimeout( processExplorer, 0)
setTimeout( processPriceInfo, 0)
setTimeout( processWinningBlocks, 0)
