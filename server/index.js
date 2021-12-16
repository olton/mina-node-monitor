#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const http = require("http")
const https = require("https")
const {hostname} = require("os")
const WebSocket = require("ws")
const {processPlatform, processMem, processCpuLoad, processCpuTemp, processNetStat, processNetConn} = require("./modules/system")
const {processCollectNodeInfo} = require("./modules/node")
const {processWinningBlocks, processBlockchainSummary, processBlockchainLatestBlocks} = require("./modules/explorer")
const {processAlerter} = require("./modules/alerter")
const {processBalance} = require("./modules/balance")
const {processHello} = require("./modules/hello")
const {processUptime} = require("./modules/uptime")
const {processDelegations} = require("./modules/delegations")
const {processPriceInfo, processPriceSend} = require("./modules/price")
const {processSnarkWorkerController} = require("./modules/snark-worker")
const {processJournal} = require("./modules/journal")
const {updateConfigFromArguments, createConfig} = require("./helpers/arguments")
const {SYNC_STATE_UNKNOWN} = require("./helpers/consts")
const {processConsensus} = require("./modules/consensus")
const {processBlockchain} = require("./modules/blockchain")
const {processBlockSpeed} = require("./modules/speed")
const {logging} = require("./helpers/logs")
const {welcomeHtml} = require("./helpers/welcome")
const {processCompare} = require("./modules/comparer")
const packageJson = require("./package.json")
const {processConfigWatcher} = require("./helpers/watcher");

const version = packageJson.version
const configPathLinux = "/etc/mina-monitor/config.json"
const configPath = path.resolve(__dirname, 'config.json')
const configPathFinal = process.platform === 'linux' && fs.existsSync(configPathLinux) ? configPathLinux : configPath

createConfig(configPath)

if (!fs.existsSync(configPath)) {
    logging("Config file not exist! Use command 'node index --init' to create it!")
    process.exit(0)
}

const readConfig = (path) => updateConfigFromArguments(JSON.parse(fs.readFileSync(path, 'utf-8')))

const config = readConfig(configPathFinal)
const [SERVER_HOST, SERVER_PORT] = config.host.split(":")

/* Create log dir */
const logDir = path.resolve(__dirname, "logs")
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)
/******************/

globalThis.host = config.name || hostname().split(".")[0]
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

globalThis.isHttps = useHttps

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
    ws.send(JSON.stringify({
        action: "monitorVersion",
        data: version
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
    comparison: {},
    rewards: null,
    https: false
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
setImmediate( processBlockchainSummary )
setImmediate( processBlockchainLatestBlocks )
setImmediate( processSnarkWorkerController )
setImmediate( processBalance )
setImmediate( processConsensus )
setImmediate( processBlockchain )
setImmediate( processBlockSpeed )
setImmediate( processCompare )
setImmediate( processConfigWatcher, configPathFinal )
setImmediate( () => globalThis.cache.https = Boolean(globalThis.isHttps) )
