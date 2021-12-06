# Mina Monitor Server

The Mina Monitor Server (then just Server) is a JavaScript application, written in NodeJS, and intended for monitors Mina nodes.
The Server collects information about the node, monitors node health, and restarts the node if needed, and send collected information to clients.

> Before you start using Mina Monitor Server, you must install `NodeJS` ver **14+**.

## Installation
For production use, must install the Server on the same physical server where your Mina node was installed.
You can install the Monitor in various ways:

 - via Bash
 - via Docker
 - and manual hemorrhoids

### Install via Bash

To install default `master` branch into folder `~/mina-monitor-server`, you can use command:

```shell
curl -s https://raw.githubusercontent.com/olton/scripts/master/mina/monitor/server/install.sh | bash -s
```

If you need to install specified branch or tag into a specified folder, you must define ones on the end of command:

```shell
curl -s https://raw.githubusercontent.com/olton/scripts/master/mina/monitor/server/install.sh | bash -s -- branch_or_tag target_folder
```

***Important! If you need to specify the target folder, you must indicate a branch or tag.***

### Install via Docker

To install Server via Docker, please read [DOCKER.md](DOCKER.md)

### Install manual

You will need manual installation if you want to install from the sources of the cloned repository.
The first you need - clone repository:

```shell
git clone https://github.com/olton/mina-node-monitor.git
cd mina-node-monitor
npm install
```

#### Copying Mina Monitor Server files to the Mina server

To install server app, copy files from `server` folder to your server to any folder convenient 
for you (for example copy to `~/mina-monitor` in a home directory).

```shell
cd mina-monitor
npm install
```

## Create config file
In its work, the server used a special config file with different parameters, which allowed controlling various aspects 
of the Monitor work. This file is named config.json represents a simple text file in JSON format.

To create config file, from repo root folder run command:

```shell
node server/index.js --init
```

This command will create a `config.json` file in folder `server` with default parameters.
Change ones with your purposes.

> I go into detail about the config file and parameters in the video on my [YouTube channel](https://www.youtube.com/channel/UC-AwjNVWxPRJYMG7vpiJnfQ).
> Also, you can read about it in the [text transcription](https://docs.google.com/document/d/1pccoot4fTQLh9ySpf-nuLuApw1bDFSsP9nlQID0SYvY/edit?usp=sharing) of this video.

### Config file parameters

The config file contain a lot of different parameters.

```json
{
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
    "alertToTelegram": [
        "FAIL", "EXEC" ,"HELLO", "STATUS", "MAX", "FORWARD-MAX", 
        "FORK", "FORWARD-FORK", "HANG", "EXPLORER", "RESTART", 
        "BALANCE", "PEERS", "MEM", "COMPARE",
        "PRICE", "REWARDS", "UPTIME"
    ],
    "alertToDiscord": [
        "FAIL", "EXEC" ,"HELLO", "STATUS", "MAX", "FORWARD-MAX",
        "FORK", "FORWARD-FORK", "HANG", "EXPLORER", "RESTART",
        "BALANCE", "PEERS", "MEM", "COMPARE",
        "PRICE", "REWARDS", "UPTIME"
    ],
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
        "runWorkerCommand": "mina client set-snark-worker -address <ADDRESS>",
        "setWorkerFeeCommand": "mina client set-snark-work-fee <FEE>",
        "controlInterval": "10s"
    },
    "journal": {
        "cmd": "journalctl",
        "hooks": ["process exited", "crash"]
    },
    "comparison": [],
    "explorer": {
        "getRewardsInterval": "3m",
        "getLatestBlocksInterval": "1m",
        "getBlockchainSummaryInterval": "1m"
    }
}
```

where

- `name` - you can set name for your Monitor Server, this name will be displayed in alert messages
- `publicKey` - node key for getting balance
- `publicKeyDelegators` - node key for getting delegations
- `telegram` - your telegram bot(s) settings
- `discord` - your discord chat(s) settings
- `alertInterval` - the interval with which the server will check node state and send alerts in telegrams
- `blockDiff` - difference in blocks with MinaExplorer at which an alert will be sent
- `blockDiffToRestart` - difference in blocks when Mina will be restarted
- `host` - IP and PORT on which the server will run
- `graphql` - Mina node GraphQL address (by default `localhost:3085`)
- `canRestartNode` - if true, server can restart mina node
- `restartCmd` - command for restart mina node
- `https` - contains paths to ssl certificate and key for ssl certificate to create https server
- `restartStateException` - exceptions for states to restart node in non-sync
- `restartStateSyncedRules` - enabled rules to restart in synced
- `alertToTelegram` - types of alerts which will send to telegram
- `alertToDiscord` - types of alerts which will send to discord
- `price` - send price info to telegram/discord
- `blockSpeedDistance` - distance for block speed calculation
- `nodeInfoCollectInterval` - interval to collect node info into internal object. Recommended value `30000` (30 sec)
- `hangIntervalAlert` - time to alert when node hanging
- `hangInterval` - time to restart when node hanging
- `memAlert` - value to alert when critical memory usage (0 - 100), 0 - no alert
- `memRestart` - value to restart when critical memory usage (0 - 100), 0 - no restart
- `snarkWorker` - options to control snark worker
- `journal` - enable control for mina service with `jouranlctl`
- `comparison` - you can enable comparison height with an others nodes with this parameter
- `explorer` - interaction with Mina Explorer

**Comparison with others nodes**
Begin from version 2.0.2, you can enable comparison node height with an others nodes. For this feature, I added a parameter `comparison`.
This parameter has an array type, and must contain objects with nodes descriptions:

```json
{
    "comparison": [
        {
            "name": "server1",
            "address": "1.1.1.1:8000",
            "https": false
        },
        {
            "name": "server2",
            "address": "2.2.2.2:8000",
            "https": true
        }
    ]
}
```

**Values for alerts: `alertToTelegram`, `alertToDiscord`**
- `HELLO` - node says Hello
- `NOT-SYNCED` - node not `SYNCED`
- `MAX` - block height less than max block length
- `FORWARD-MAX` - block height more than max block length
- `FORK` - block height less than max unvalidated block length
- `FORWARD-FORK` - block height more than max unvalidated block length
- `HANG` - node in hanging state
- `EXPLORER` block height more or less of Mina Explorer height
- `RESTART` - alert when restart exec
- `BALANCE` - send balance
- `PEERS` - send alert if node don't has a peers
- `MEM` - send alert if critical memory usage detected
- `EXEC` - send information about command executed
- `FAIL` - send alert when mina service stopped
- `COMAPRE` - send alert when height different with nodes defined in parameter `comparison`
- `PRICE` - send Mina price
- `REWARDS` - send info about last winning block and block coinbase 
- `UPTIME` - send info about address position in uptime leaderboard

**Values for restart: `restartStateSyncedRules`**
- `MAX` - restart when height less than max block length
- `FORWARD-MAX` - restart when height more than max block length
- `FORK` - restart when height less than max unvalidated block length
- `FORWARD-FORK` - restart when height more than max unvalidated block length
- `HANG` - restart hanging detected

### Disabling features
To disable **Snark Worker Controller** set the parameter `snarkWorker` to `false`.

To disable **Journal Controller** set the parameter `journal` to `false`.
 
To disable **restart** set `canRestartNode` to `false` or:
- by memory limit - set the `memRestart` to `0`
- by fork - set `blockDiffToRestart` to `0`

### Defining a time slots and intervals

For the Monitor I created two variants for time slots defining:

1) With a defining interval in milliseconds. To define the interval in milliseconds, you must correctly calculate this value. For example, if you need to create an interval in 5 minutes, you must multiply 1000 ms in 60 sec and multiply in 5 minutes, and the result, 300 000  ms, is defined as a parameter value.
2) To use a string value in the special format, which I added in version - 2.0. This way implies that the interval can contain up to 4 parts, namely the `number of days`, `hours`, `minutes`, and `seconds`. Each part represents a structure that contains a numeric value and part label, for days - letter `d`, for hours - `h`, for minutes - `m`, and for the seconds - `s`. For example, to define the interval in **5 minutes**, just write `5m`. For example, to define value for **1 day 23 minutes 13 seconds**, just write `1d 23m 13s` instead of  `87793000`, if you had to specify it in milliseconds.

### Defining a currency

For `price:currency` you can use one of the next values:
```
"btc", "eth", "ltc", "bch", "bnb", "eos", "xrp", "xlm",
"link", "dot", "yfi", "usd", "aed", "ars", "aud", "bdt", "bhd",
"bmd", "brl", "cad", "chf", "clp", "cny", "czk", "dkk", "eur",
"gbp", "hkd", "huf", "idr", "ils", "inr", "jpy", "krw", "kwd",
"lkr",  "mmk",  "mxn",  "myr",  "ngn",  "nok",  "nzd",  "php",
"pkr",  "pln",  "rub",  "sar",  "sek",  "sgd",  "thb",  "try",
"twd",  "uah",  "vef",  "vnd",  "zar",  "xdr",  "xag",  "xau",
"bits",  "sats"
```

## Run Mina Monitor Sever

To run Sever, use command:
```shell
node index.js
```
or from cloned repository
```shell
node server/index.js
```

### Overriding parameters at start server

You can override parameters at Server starts without a real changing a config file.
These changes will work only for started session.
To override values, you must adhere to the following rules: 

- overriding parameters must be defined at the end of the server run command
- each parameter is defined as a key-value pair
- the key must start with `-`
- the composite key must divide with a `:`
- if value contain a space, value must be defined in a `" "`
- if value has an array type, value must be defined in a `" "` with a `,` divider

For example:
```shell
# Change a simple parameter
node index -memAlert 80
```
```shell
# Change a composite parameter
node index -price:currency eur
```
```shell
# Change an array type parameter
node index -alertToDiscord "HELLO, BALANCE"
```
```shell
# Change a several parameters
node index -alertToDiscord "HELLO, BALANCE" -memAlert 80 -price:currency eur 
```

## Run Mina Monitor Sever as Service

Also, you can run server as service. To run as service
+ replace `user-name` with your real server **username** in `ExecStart` in `minamon.service` file.
+ copy `minamon.service` to `/usr/lib/systemd/user` or `/etc/systemd/system`
```shell
sudo cp node-monitor/minamon.service /usr/lib/systemd/user
```
or
```shell
sudo cp node-monitor/minamon.service /etc/systemd/system
```

Enable service for autorun when restart server
```shell
systemctl --user enable minamon
```

Start server
```shell
systemctl --user start minamon
```

Now you can `start`, `stop`, and `restart` server app with commands
```shell
systemctl --user start minamon
systemctl --user stop minamon
systemctl --user restart minamon
systemctl --user status minamon
```

## Other features

### CPU Temperature
If your Monitor server-side part installed on Linux, you can get `CPU temperature` (of course, if you have CPU temperature sensors on the server).
If you are sure that there are sensors, but the client does not show the CPU temperature, try installing the `lm-sensors` package:
```shell
sudo apt install lm-sensors
```
