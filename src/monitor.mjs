import http from "http"
import {sysInfo} from "./system.mjs"
import {nodeInfo} from "./node.mjs"
import {getExplorerSummary} from "./explorer.mjs"
import config from "./config.mjs"
import "./alerter.mjs"
import "./balance-sender.mjs"

const DEV_MODE = false
const SERVER_HOST = DEV_MODE ? 'localhost' : config.host
const SERVER_PORT = DEV_MODE ? 8000 : config.port

const requestListener = async (req, res) => {
    let response

    res.setHeader("Content-Type", "application/json")
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.writeHead(200)

    switch (req.url) {
        case '/os':
            response = await sysInfo('os')
            break;
        case '/cpu':
            response = await sysInfo('cpu')
            break;
        case '/cpu-load':
            response = await sysInfo('cpu-load')
            break;
        case '/mem':
            response = await sysInfo('mem')
            break;
        case '/load':
            response = await sysInfo('load')
            break;
        case '/time':
            response = await sysInfo('time')
            break;
        case '/static':
            response = await sysInfo('static')
            break;
        case '/dyn':
            response = await sysInfo('dyn')
            break;
        case '/net-stat':
            response = await sysInfo('net-stat')
            break;
        case '/net-conn':
            response = await sysInfo('net-conn')
            break;
        case '/node-status':
            response = await nodeInfo('node-status')
            break;
        case '/balance':
            response = await nodeInfo('balance')
            break;
        case '/explorer':
            response = await getExplorerSummary()
            break;
        default:
            response = "OK"
    }

    res.end(JSON.stringify(response))
}

const server = http.createServer(requestListener)

server.listen(SERVER_PORT, SERVER_HOST, () => {
    console.log(`Mina Node Server Monitor is running on http://${SERVER_HOST}:${SERVER_PORT}`)
})