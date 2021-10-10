const {isset} = require("./isset");
const {isNum} = require("./numbers");
const fs = require("fs")
const {logging} = require("./logs");

const createConfig = (path) => {
    const args = process.argv.slice(2)
    if (!args.includes("--init")) {
        return
    }

    const defaultConfig = {
        "publicKey": "",
        "publicKeyDelegators": "",
        "telegramToken": "",
        "telegramChatID": "",
        "telegramChatIDAlert": "",
        "discordWebHook": "",
        "balanceSendInterval": "1d",
        "alertInterval": "3m",
        "blockDiff": 3,
        "blockDiffToRestart": 5,
        "canRestartNode": true,
        "restartAfterNotSynced": "30m",
        "restartCmd": "systemctl --user restart mina",
        "host": "0.0.0.0:8000",
        "graphql": "localhost:3085",
        "https": {
            "key": "",
            "cert": ""
        },
        "restartStateException": ["BOOTSTRAP"],
        "restartStateSyncedRules": ["MEM","MAX", "FORWARD-MAX", "FORK", "FORWARD-FORK", "HANG"],
        "alertToTelegram": ["FAIL", "EXEC" ,"HELLO", "STATUS", "MAX", "FORWARD-MAX", "FORK", "FORWARD-FORK", "HANG", "EXPLORER", "RESTART", "BALANCE", "PEERS", "MEM"],
        "alertToDiscord": ["FAIL", "EXEC" ,"HELLO", "STATUS", "MAX", "FORWARD-MAX", "FORK", "FORWARD-FORK", "HANG", "EXPLORER", "RESTART", "BALANCE", "PEERS", "MEM"],
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
            "runWorkerCommand": "mina client set-snark-worker -address <ADDRESS>",
            "setWorkerFeeCommand": "mina client set-snark-work-fee <FEE>",
            "controlInterval": "10s"
        },
        "journal": {
            "cmd": "journalctl",
            "hooks": ["process exited", "crash"]
        }
    }

    fs.writeFileSync(path, JSON.stringify(defaultConfig, null, 4), {flag: 'w+', encoding: 'utf-8'})

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