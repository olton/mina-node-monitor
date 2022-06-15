#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const http = require("http")
const https = require("https")
const {hostname} = require("os")
const WebSocket = require("ws")
const {processPlatform, processMem, processCpuLoad, processCpuTemp, processNetStat, processNetConn} = require("./modules/system")
const {processCollectNodeInfo} = require("./modules/node")
const {processBlockchainSummary, processBlockchainLatestBlocks} = require("./modules/explorer")
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
const {logging, log, error} = require("./helpers/logs")
const {welcomeHtml} = require("./helpers/welcome")
const {processCompare} = require("./modules/comparer")
const packageJson = require("./package.json")
const {processConfigWatcher} = require("./helpers/watcher");
const {processGetMinaVersion} = require("./helpers/shell");
const {parseTime} = require("./helpers/parsers");
const {processRewards} = require("./modules/rewards");
const {add} = require("nodemon/lib/rules");

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

globalThis.isHttps = Boolean(useHttps)

const requestListener = async (req, res) => {
    const {webRoot} = config

    if (req.url === '/') {
        res.setHeader("Content-Type", "text/html")
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.writeHead(200)

        res.end(
            welcomeHtml
                .replace("%VER%", version)
                .replace("%MINA%", processGetMinaVersion())
        )

    } else {
        let filePath = webRoot ? webRoot : __dirname + req.url

        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.wasm': 'application/wasm'
        };

        let contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, function(error, content) {
            if (error) {
                if(error.code === 'ENOENT') {
                    fs.readFile('./404.html', function(error, content) {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    });
                }
                else {
                    res.writeHead(500);
                    res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                }
            }
            else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
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

const {host: minataurHost = 'minataur.net:443', secure: minataurSecure = true} = config.minataur

const isOpen = (ws) => ws && ws.readyState === ws.OPEN

const request = (ws, channel, data) => {
    if (isOpen(ws)) {
        ws.send(JSON.stringify({
            channel,
            data
        }))
    }
}

const connectToMinataur = () => {
    const ws = new WebSocket(`${minataurSecure ? 'wss' : 'ws'}://${minataurHost}`)

    ws.onerror = e => {
        error('Socket from Minataur encountered error: ', e.message, 'Closing socket');
        ws.close();
    }

    ws.onclose = e => {
        log('Socket from Minataur is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(connectToMinataur, 1000)
    }

    ws.onopen = e => {
        log('Connected to Minataur!')
    }

    ws.onmessage = msg => {
        const message = JSON.parse(msg.data)
        if (!message.channel) return
        const {channel, data} = message

        let uptimeUpdateInterval = parseTime(config.uptimeUpdateInterval || '5m')

        if (uptimeUpdateInterval < parseTime("5m")) {
            uptimeUpdateInterval = parseTime("5m")
        }

        const requestUptime = (addr = config.publicKeyDelegators || config.publicKey) => {
            // request(ws, "address_uptime_full", {address:addr})
            request(ws, "address_uptime_new", {address:addr})
        }

        const requestDelegations = (addr = config.publicKeyDelegators || config.publicKey) => {
            request(ws, "address_stakes", addr)
        }

        const requestRewards = (address = config.publicKeyDelegators || config.publicKey) => {
            request(ws, "address_rewards", {address})
        }

        switch (channel){
            case 'welcome': {
                log("Welcome to Minataur!")
                requestUptime()
                requestDelegations()
                requestRewards()
                break
            }
            // case 'address_uptime_full': {
            //     try {
            //         processUptime(data)
            //     }
            //     catch (e) {
            //         error(e.message)
            //     }
            //     finally {
            //         setTimeout(requestUptime, uptimeUpdateInterval)
            //     }
            //     break;
            // }
            case 'address_uptime_new': {
                try {
                    processUptime(data)
                }
                catch (e) {
                    error(e.message)
                }
                finally {
                    setTimeout(requestUptime, uptimeUpdateInterval)
                }
                break;
            }
            case 'address_stakes': {
                try {
                    processDelegations(data)
                }
                catch (e) {
                    error(e.message)
                }
                finally {
                    setTimeout(requestDelegations, 600000)
                }
                break;
            }
            case 'address_rewards': {
                try {
                    processRewards(data)
                }
                catch (e) {
                    error(e.message)
                }
                finally {
                    setTimeout(requestRewards, parseTime("3m"))
                }
                break;
            }
        }
    }
}

connectToMinataur()

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
setImmediate( processDelegations )
setImmediate( processJournal )
setImmediate( processHello )
setImmediate( processPriceSend )
setImmediate( processCollectNodeInfo )
setImmediate( processAlerter )
// setImmediate( processWinningBlocks )
setImmediate( processBlockchainSummary )
setImmediate( processBlockchainLatestBlocks )
setImmediate( processSnarkWorkerController )
setImmediate( processBalance )
setImmediate( processConsensus )
setImmediate( processBlockchain )
setImmediate( processBlockSpeed )
setImmediate( processCompare )
setImmediate( processConfigWatcher, configPathFinal )
setImmediate( () => globalThis.cache.https = globalThis.isHttps )
