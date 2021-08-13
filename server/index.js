#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const http = require("http")
const https = require("https")
const {sysInfo} = require("./modules/system")
const {processCollectNodeInfo} = require("./modules/node")
const {getBlocks, processExplorer, processWinningBlocks} = require("./modules/explorer")
const {processAlerter} = require("./modules/alerter")
const {processBalanceSend} = require("./modules/balance-sender")
const {processHello} = require("./modules/hello")
const {processNodeUptime} = require("./modules/uptime")
const {processGetDelegations} = require("./modules/ledger")
const {getPriceInfo, processPriceInfo} = require("./modules/coingecko")
const {processPriceSend} = require("./modules/price-sender")
const {processSnarkWorkerController} = require("./modules/snark-worker-controller")
const {processJournal} = require("./modules/journal")
const {updateConfigFromArguments} = require("./helpers/arguments");

// const __dirname = dirname(fileURLToPath(import.meta.url))
const configPath = path.resolve(__dirname, 'config.json')

if (!fs.existsSync(configPath)) {
    throw new Error("Config file not exist!")
}

const config = updateConfigFromArguments(JSON.parse(fs.readFileSync(configPath, 'utf-8')))
const [SERVER_HOST, SERVER_PORT] = config.host.split(":")

/* Create log dir */
const logDir = path.resolve(__dirname, "logs")
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)
/******************/

globalThis.logs = {
    fails: path.resolve(__dirname, "logs/mina-fails.log")
}
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
globalThis.nodeMemoryUsage = 0
globalThis.nodeInfo = {
    previousState: 'UNKNOWN',
    state: null,
    nodeStatus: null,
    balance: null,
    blockchain: null,
    consensus: null,
    blockSpeed: null,
    delegations: null,
    uptime: null,
    uptime2: null,
    winningBlocks: null,
    health: [],
    responseTime: 0,
    nextBlock: null
}
globalThis.explorerInfo = {
    summary: null
}
globalThis.priceInfo = null
globalThis.snarkWorkerStopped = null
globalThis.snarkWorkerStoppedBlockTime = null

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
        case '/sync-state': response = globalThis.nodeInfo.state; break;
        case '/next-block': response = globalThis.nodeInfo.nextBlock; break;
        case '/node-response-time': response = globalThis.nodeInfo.responseTime; break;
        case '/balance': response = globalThis.nodeInfo.balance; break;
        case '/block-speed': response = globalThis.nodeInfo.blockSpeed; break;
        case '/health': response = globalThis.nodeInfo.health; break;
        case '/uptime': response = globalThis.nodeInfo.uptime; break;
        case '/uptime2': response = globalThis.nodeInfo.uptime2; break;
        case '/delegations': response = globalThis.nodeInfo.delegations; break;
        case '/explorer': response = globalThis.explorerInfo.summary; break;
        case '/price': response = globalThis.priceInfo; break;
        case '/winning-blocks': response = globalThis.nodeInfo.winningBlocks; break;

        case '/price-for': response = await getPriceInfo(_url.searchParams.get('currency') ?? 'usd'); break;
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

setImmediate( processHello )
setImmediate( processAlerter )
setImmediate( processBalanceSend )
setImmediate( processPriceSend )
setImmediate( processCollectNodeInfo )
setImmediate( processNodeUptime, 1 )
setImmediate( processNodeUptime, 2 )
setImmediate( processGetDelegations )
setImmediate( processExplorer )
setImmediate( processPriceInfo )
setImmediate( processWinningBlocks )
setImmediate( processSnarkWorkerController )
setImmediate( processJournal )
