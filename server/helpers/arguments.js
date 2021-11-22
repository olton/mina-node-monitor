const {isset} = require("./isset");
const {isNum} = require("./numbers");
const fs = require("fs")
const {logging} = require("./logs");

const createConfig = (path) => {
    const args = process.argv.slice(2)
    if (!args.includes("--init")) {
        return
    }

    const defaultAlerts = ["FAIL", "EXEC" ,"HELLO", "STATUS", "MAX", "FORWARD-MAX", "FORK", "FORWARD-FORK", "HANG", "EXPLORER", "RESTART", "BALANCE", "PEERS", "MEM", "COMPARE"]
    const defaultRestartSyncedRules = ["MEM","MAX", "FORWARD-MAX", "FORK", "FORWARD-FORK", "HANG"]
    const defaultStateException = ["BOOTSTRAP"]
    const defaultRestartCmd = "systemctl --user restart mina"
    const defaultSnarkWorkerCmd = "mina client set-snark-worker -address <ADDRESS>"
    const defaultSnarkWorkerFeeCmd = "mina client set-snark-work-fee <FEE>"
    const defaultConfig = {
        "name": "",
        "publicKey": "",
        "publicKeyDelegators": "",
        "telegramToken": "",
        "telegramChatID": "",
        "telegramChatIDAlert": "",
        "discordWebHook": "",
        "balanceSendInterval": "1d",
        "alertInterval": "3m",
        "blockDiff": 3,
        "blockDiffToRestart": 10,
        "canRestartNode": true,
        "restartAfterNotSynced": "30m",
        "restartCmd": defaultRestartCmd,
        "host": "0.0.0.0:8000",
        "graphql": "localhost:3085",
        "https": {
            "key": "",
            "cert": ""
        },
        "restartStateException": defaultStateException,
        "restartStateSyncedRules": defaultRestartSyncedRules,
        "alertToTelegram": defaultAlerts,
        "alertToDiscord": defaultAlerts,
        "price": {
            "currency": "usd",
            "updateInterval": "1m",
            "sendInterval": "1h",
            "targets": ["TELEGRAM", "DISCORD"]
        },
        "blockSpeedDistance": 10,
        "nodeInfoCollectInterval": "30s",
        "hangInterval": "45m",
        "hangIntervalAlert": "30m",
        "memAlert": 95,
        "memRestart": 0,
        "snarkWorker": {
            "address": "",
            "fee": 0.001,
            "stopBeforeBlock": "5m",
            "startAfterBlock": "1m",
            "runWorkerCommand": defaultSnarkWorkerCmd,
            "setWorkerFeeCommand": defaultSnarkWorkerFeeCmd,
            "controlInterval": "10s"
        },
        "journal": {
            "cmd": "journalctl",
            "hooks": ["process exited", "crash"]
        },
        "restartAfterUptime": 0,
        "comparison": [

        ]
    }
    let existsConfig = {}

    if (fs.existsSync(path)) {
        existsConfig = JSON.parse(fs.readFileSync(path, 'utf-8'))
    }

    fs.writeFileSync(path, JSON.stringify(Object.assign({}, defaultConfig, existsConfig), null, 4), {flag: 'w+', encoding: 'utf-8'})

    logging("Config file created successfully!")

    process.exit(0)
}

const getArguments = () => {
    const args = process.argv.slice(2)
    const obj = {}

    for (let i = 0; i < args.length; i++) {
        if (i % 2 !== 0) continue
        let key = ""+args[i]
        let val = args[i + 1]
        if (key[0] === '-') {
            key  = key.substr(1)
        }
        obj[key] = isNaN(val) ? val : +val
    }

    return obj
}

const updateConfigFromArguments = (c) => {
    const args = getArguments()
    let _c = c

    for(let o in args) {
        let v = args[o]

        if (isNum(v)) {
            v = Number(v)
        } else if (['true', 'false'].includes(v.toLowerCase())) {
            v = v.toLowerCase() === 'true'
        } else if (v.includes("[") || v.includes(",")) {
            v = v.replace(/[\[\]"'`]/gi, "").split(",")
        }

        if (o.includes(":")) {
            const [p1, p2] = o.split(":")

            if (!isset(_c[p1]) || !isset(_c[p1][p2])) continue
            _c[p1][p2] = v
        } else {
            if (!isset(c[o])) continue
            _c[o] = v
        }
    }

    return {
        ..._c
    }
}

module.exports = {
    getArguments,
    updateConfigFromArguments,
    createConfig
}