#!/usr/bin/env node

import fs from "fs"
import path, {dirname} from "path"
import { fileURLToPath } from 'url'
import http from "http"
import https from "https"
import {sysInfo} from "./system.mjs"
import {nodeInfo} from "./node.mjs"
import {getExplorerSummary} from "./explorer.mjs"
import {processAlerter} from "./alerter.mjs"
import {processBalanceSend} from "./balance-sender.mjs"
import {processHello} from "./hello.mjs"
import {getUptime} from "./uptime.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const configPath = path.resolve(__dirname, 'config.json')

if (!fs.existsSync(configPath)) {
    throw new Error("Config file not exist!")
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
const [SERVER_HOST, SERVER_PORT] = config.host.split(":")

globalThis.restartTimer = 0
globalThis.restartTimerMax = 0
globalThis.restartTimerUnv = 0
globalThis.restartTimerPrev = 0
globalThis.restartTimerNotSynced = 0
globalThis.currentBalance = 0
globalThis.currentHeight = 0
globalThis.currentControlHeight = 0
globalThis.controlCounter = 0

const requestListener = async (req, res) => {
    let response

    res.setHeader("Content-Type", "application/json")
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.writeHead(200)

    switch (req.url) {
        case '/platform': response = await sysInfo('platform'); break;
        case '/mem': response = await sysInfo('mem'); break;
        case '/cpu': response = await sysInfo('cpu'); break;
        case '/cpu-load': response = await sysInfo('cpu-load'); break;

        case '/consensus': response = await nodeInfo('consensus', config); break;
        case '/blockchain': response = await nodeInfo('blockchain', config); break;
        case '/node-status': response = await nodeInfo('node-status', config); break;
        case '/balance': response = await nodeInfo('balance', config); break;
        case '/block-speed': response = await nodeInfo('block-speed', config); break;
        case '/explorer': response = await getExplorerSummary(); break;
        case '/uptime': response = await getUptime(config.publicKey); break;
        case '/time': response = await sysInfo('time'); break;

        /* */
        case '/net-stat': response = await sysInfo('net-stat'); break;
        case '/net-conn': response = await sysInfo('net-conn'); break;
        /* */

        default:
            response = "OK"
    }

    res.end(JSON.stringify(response))
}

let server, useHttps = config.https && (config.https.cert && config.https.key)

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

setTimeout( () => processHello(config), 0)
setTimeout( () => processAlerter(config), 0)
setTimeout( () => processBalanceSend(config), 0)