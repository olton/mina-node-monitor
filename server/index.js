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
const {processBalanceSend} = require("./modules/balance-sender")
const {processHello} = require("./modules/hello")
const {processUptime} = require("./modules/uptime")
const {processDelegations} = require("./modules/ledger")
const {processPriceInfo} = require("./modules/coingecko")
const {processPriceSend} = require("./modules/price-sender")
const {processSnarkWorkerController} = require("./modules/snark-worker")
const {processJournal} = require("./modules/journal")
const {updateConfigFromArguments} = require("./helpers/arguments");
const {SYNC_STATE_UNKNOWN} = require("./helpers/consts");

const version = `2.0.0`
const configPathLinux = "/etc/minamon/config.json"
const configPath = path.resolve(__dirname, 'config.json')

if (!fs.existsSync(configPath)) {
    throw new Error("Config file not exist!")
}

const readConfig = (path) => updateConfigFromArguments(JSON.parse(fs.readFileSync(path, 'utf-8')))

const config = readConfig(process.platform === 'linux' && fs.existsSync(configPathLinux) ? configPathLinux : configPath)
const [SERVER_HOST, SERVER_PORT] = config.host.split(":")

/* Create log dir */
const logDir = path.resolve(__dirname, "logs")
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)
/******************/

globalThis.host = hostname()
globalThis.logs = {
    fails: path.resolve(__dirname, "logs/mina-fails.log")
}

globalThis.config = config

globalThis.restartTimerNotSynced = 0
globalThis.hangTimer = 0
globalThis.currentBalance = 0
globalThis.currentControlHeight = 0
globalThis.nodeMemoryUsage = 0
globalThis.snarkWorkerStopped = false
globalThis.snarkWorkerStoppedBlockTime = null
globalThis.previousState = SYNC_STATE_UNKNOWN

let server, useHttps = config.https && (config.https.cert && config.https.key)

const requestListener = async (req, res) => {
    let response

    res.setHeader("Content-Type", "text/html")
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.writeHead(200)

    response =`
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        body {
            height: 100vh; 
            display: flex; 
            justify-content: center; 
            align-items: center;
            font-family: 'Open Sans', sans-serif;
            flex-direction: column;
            font-size: 16px;
        }
        .container {
            text-align: center;
        }
        h1 {
            font-weight: 100;                  
        }
        .subtitle {
            line-height: 1.2;            
        }
        .copyright {
            font-size: .8em;
            margin-top: 4px;
        }
        .version {
            font-size: .8em;
            margin-top: 4px;
            color: #707882;
        }
    </style>
    <body>
        <div class="container">
            <h1>Welcome to Mina Monitor!</h1>    
            <p class="subtitle">CONVENIENT MONITORING OF YOUR MINA NODES!</p>     
            <p class="copyright">Copyright 2021 by <a href="https://pimenov.com.ua">Serhii Pimenov</a></p>
            <p class="version">Mina Monitor v${version}</p>
        </div>       
    </body>
    `

    res.end(response)
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
    console.log(`Mina Monitor Server running on ${useHttps ? 'https' : 'http'}://${SERVER_HOST}:${SERVER_PORT}`)
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

globalThis.cache = new Proxy({}, {
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

setImmediate( processHello )
setImmediate( processAlerter )
setImmediate( processBalanceSend )
setImmediate( processPriceSend )
setImmediate( processCollectNodeInfo )
setImmediate( processWinningBlocks )
setImmediate( processSnarkWorkerController )
setImmediate( processJournal )

setImmediate( processPlatform )
setImmediate( processMem )
setImmediate( processCpuLoad )
setImmediate( processCpuTemp )
setImmediate( processNetStat )
setImmediate( processNetConn )
setImmediate( processPriceInfo )
setImmediate( processUptime )
setImmediate( processDelegations )
