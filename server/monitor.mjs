#!/usr/bin/env node

import fs from "fs"
import path, {dirname} from "path"
import { fileURLToPath } from 'url'
import http from "http"
import {sysInfo} from "./system.mjs"
import {nodeInfo} from "./node.mjs"
import {getExplorerSummary} from "./explorer.mjs"
import {processAlerter} from "./alerter.mjs"
import {processBalanceSend} from "./balance-sender.mjs"
import {processHello} from "./hello.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const configPath = path.resolve(__dirname, 'config.json')

if (!fs.existsSync(configPath)) {
    throw new Error("Config file not exist!")
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
const _SERVER = config.host.split(":")

const requestListener = async (req, res) => {
    let response

    res.setHeader("Content-Type", "application/json")
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.writeHead(200)

    switch (req.url) {
        case '/os': response = await sysInfo('os'); break;
        case '/cpu': response = await sysInfo('cpu'); break;
        case '/cpu-load': response = await sysInfo('cpu-load'); break;
        case '/mem': response = await sysInfo('mem'); break;
        case '/load': response = await sysInfo('load'); break;
        case '/time': response = await sysInfo('time'); break;
        case '/static': response = await sysInfo('static'); break;
        case '/dyn': response = await sysInfo('dyn'); break;
        case '/net-stat': response = await sysInfo('net-stat'); break;
        case '/net-conn': response = await sysInfo('net-conn'); break;
        case '/node-status': response = await nodeInfo('node-status'); break;
        case '/balance': response = await nodeInfo('balance', config); break;
        case '/blockchain': response = await nodeInfo('blockchain'); break;
        case '/explorer': response = await getExplorerSummary(); break;
        default:
            response = "OK"
    }

    res.end(JSON.stringify(response))
}

const server = http.createServer(requestListener)

server.listen(+_SERVER[1], _SERVER[0], () => {
    console.log(`Mina Node Server Monitor is running on http://${_SERVER[0]}:${_SERVER[1]}`)
})

setTimeout( () => processHello(config), 0)
setTimeout( () => processAlerter(config), 0)
setTimeout( () => processBalanceSend(config), 0)