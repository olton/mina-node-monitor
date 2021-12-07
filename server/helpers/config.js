const getDefaultConfig = (extConfig = {}) => {
    const defaultAlerts = [
        "FAIL",
        "EXEC",
        "HELLO",
        "STATUS",
        "MAX",
        "FORWARD-MAX",
        "FORK",
        "FORWARD-FORK",
        "HANG",
        "EXPLORER",
        "RESTART",
        "BALANCE",
        "PEERS",
        "MEM",
        "COMPARE",
        "PRICE",
        "REWARDS",
        "UPTIME"
    ]
    const defaultRestartSyncedRules = [
        "MEM",
        "MAX",
        "FORWARD-MAX",
        "FORK",
        "FORWARD-FORK",
        "HANG"
    ]
    const defaultStateException = [
        "BOOTSTRAP"
    ]
    const defaultRestartCmd = `systemctl --user restart mina`
    const defaultSnarkWorkerCmd = `mina client set-snark-worker -address <ADDRESS>`
    const defaultSnarkWorkerFeeCmd = `mina client set-snark-work-fee <FEE>`
    const defaultConfig = {
        "name": "",
        "publicKey": "",
        "publicKeyDelegators": "",
        "telegram": {
            "token": "",
            "tokenInfo": "",
            "tokenAlert": "",
            "chatID": "",
            "chatIDAlert": ""
        },
        "discord": {
            "webhook": "",
            "webhookInfo": "",
            "webhookAlert": "",
            "botName": "Mina Monitor"
        },
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
        "channel": {
            "info": ["HELLO", "BALANCE", "PRICE", "REWARDS", "UPTIME"]
        },
        "price": {
            "currency": "usd",
            "updateInterval": "1m",
            "sendInterval": "1h"
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
            "hooks": ["process exited"]
        },
        "restartAfterUptime": 0,
        "comparison": [
        ],
        "explorer": {
            "getRewardsInterval": "3m",
            "getLatestBlocksInterval": "1m",
            "getBlockchainSummaryInterval": "1m"
        }
    }

    return Object.assign({}, defaultConfig, extConfig)
}

module.exports = {
    getDefaultConfig
}