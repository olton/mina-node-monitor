#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const http = require("http")
const https = require("https")
const {hostname} = require("os")
const WebSocket = require("ws")
const {processPlatform, processMem, processCpuLoad, processCpuTemp, processNetStat, processNetConn} = require("./modules/system")
const {processCollectNodeInfo} = require("./modules/node")
const {processWinningBlocks} = require("./modules/explorer")
const {processAlerter} = require("./modules/alerter")
const {processBalanceSend, processBalance} = require("./modules/balance")
const {processHello} = require("./modules/hello")
const {processUptime} = require("./modules/uptime")
const {processDelegations} = require("./modules/ledger")
const {processPriceInfo, processPriceSend} = require("./modules/price")
const {processSnarkWorkerController} = require("./modules/snark-worker")
const {processJournal} = require("./modules/journal")
const {updateConfigFromArguments, createConfig} = require("./helpers/arguments")
const {SYNC_STATE_UNKNOWN} = require("./helpers/consts")
const {processConsensus} = require("./modules/consensus")
const {processBlockchain} = require("./modules/blockchain")
const {processBlockSpeed} = require("./modules/speed")
const {logging} = require("./helpers/logs");
const {welcomeHtml} = require("./helpers/welcome");
const {processCompare} = require("./modules/comparer");

const version = `2.0.2`
const configPathLinux = "/etc/mina-monitor/config.json"
const configPath = path.resolve(__dirname, 'config.json')

createConfig(configPath)

if (!fs.existsSync(configPath)) {
    logging("Config file not exist! Use command 'node index --init' to create it!")
    process.exit(0)
}

const readConfig = (path) => updateConfigFromArguments(JSON.parse(fs.readFileSync(path, 'utf-8')))

const config = readConfig(process.platform === 'linux' && fs.existsSync(configPathLinux) ? configPathLinux : configPath)
const [SERVER_HOST, SERVER_PORT] = config.host.split(":")

/* Create log dir */
const logDir = path.resolve(__dirname, "logs")
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)
/******************/

globalThis.host = config.name || hostname()
globalThis.logs = {
    fails: path.resolve(__dirname, "logs/mina-fails.log")
}

globalThis.config = config

globalThis.restartTimerNotSynced = 0
globalThis.hangTimer = 0
globalThis.currentBalance = 0
globalThis.currentControlHeight = 0
globalThis.nodeMemoryUsage = 0
globalThis.snarkWorkerStopped = null
globalThis.snarkWorkerStoppedBlockTime = null
globalThis.snarkWorkerRunError = false
globalThis.previousState = SYNC_STATE_UNKNOWN

let server, useHttps = config.https && (config.https.cert && config.https.key)

const requestListener = async (req, res) => {
    res.setHeader("Content-Type", "text/html")
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.writeHead(200)

    res.end(
        welcomeHtml
            .replace("%VER%", version)
            .replace("%MINA%", globalThis.cache.version ? globalThis.cache.version : "Receiving...Please reload page")
    )
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

const wss = new WebSocket.Server({ server })

server.listen(+SERVER_PORT, SERVER_HOST, () => {
    logging(`Mina Monitor Server running on ${useHttps ? 'https' : 'http'}://${SERVER_HOST}:${SERVER_PORT}`)
})

wss.on('connection', (ws) => {
    ws.send(JSON.stringify({
        action: "welcome",
        data: `Welcome, you connected to Mina Monitor Server on the host ${globalThis.host}`
    }))
    for(let k in globalThis.cache) {
        ws.send(JSON.stringify({
            action: k,
            data: globalThis.cache[k]
        }))
    }
})

const broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

globalThis.cache = new Proxy({
    comparison: {}
}, {
    set(target, p, value, receiver) {
        const data = {
            data: value,
            action: p
        }

        broadcast(data)

        target[p] = value
        return true
    }
})

setImmediate( processPlatform )
setImmediate( processMem )
setImmediate( processCpuLoad )
setImmediate( processCpuTemp )
setImmediate( processNetStat )
setImmediate( processNetConn )
setImmediate( processPriceInfo )
setImmediate( processUptime )
setImmediate( processDelegations )

setImmediate( processJournal )
setImmediate( processHello )
setImmediate( processPriceSend )
setImmediate( processCollectNodeInfo )
setImmediate( processAlerter )
setImmediate( processWinningBlocks )
setImmediate( processSnarkWorkerController )
setImmediate( processBalance )
setImmediate( processBalanceSend )
setImmediate( processConsensus )
setImmediate( processBlockchain )
setImmediate( processBlockSpeed )
setImmediate( processCompare )
