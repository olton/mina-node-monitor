<p align="center">
    <img src="https://metroui.org.ua/res/mina-monitor-banner-1.0.4-1.jpg">
</p> 

# Mina Node Monitor
**Mina Monitor** is an extended graphical version of the` mina client status` command with additional indicators.
This is a `client-server` application for visual monitoring of the validator node and alerts when the node has a problem.

## Key Features

**Monitor Client:**
- [x] Display of the main indicators of the Mina network (Block height, uptime, epoch and slot info)
- [x] Displaying the status of the node daemon (SYNCED, CATCHUP, BOOTSTRAP, ...)
- [x] Displaying the health of node (OK, Fork, Hanging)
- [x] Displaying the server resources consumed by the node (CPU, RAM, NETWORK)
- [x] Displaying the balance of the specified address and the value of this balance in different currencies
- [x] Displaying information about delegations to the specified validator address
- [x] Displaying information about blocks won and rewards received in the current era
- [x] Displays general information about the site server
- [x] Convenient live graphs for displaying consumed resources
- [x] Responsive interface (It is comfortable to look at both PC and phone and tablet)

**Monitor Server Side:**
- [x] Monitoring node health
- [x] Identification of critical node states (fork, forward fork, node freeze, lag/lead Mina Explorer)
- [x] Determining the Synchronization State of a Node
- [x] Automatic reboot of the node in case of critical state detection
- [x] Sending messages about the critical state of the node in Telegram and/or Discord
- [x] Sending the current balance of the specified address to Telegram and/or Discord
- [x] Sending Mina's cost to Telegram and/or Discord

#### Monitor built with a stack:
- server - NodeJS, JavaScript
- client - JavaScript, HTML, CSS

### Credits
+ [x] [Mina Monitor](https://github.com/olton/mina-node-monitor) by [Serhii Pimenov](https://github.com/olton)
+ [x] [Metro 4](https://github.com/olton/Metro-UI-CSS) by [Serhii Pimenov](https://github.com/olton)
+ [x] [ChartJS](https://github.com/olton/chartjs) by [Serhii Pimenov](https://github.com/olton)
+ [x] [SystemInformation](https://github.com/sebhildebrandt/systeminformation) by [Sebastian Hildebrandt](https://github.com/sebhildebrandt)
 
## How to use

### Pre-requirements
To use or/and build monitor you need install `NodeJS`, `npm`. 

**Important!** For assembling use the only Parcel 1.x! 

#### Clone repository
```shell
git clone https://github.com/olton/mina-node-monitor.git
```

#### Install required packages
```shell
npm install
```

The Monitor consists of two parts: 
- Client - uses for visualisation mina node state in a browser
- Server - uses for retrieves required data from mina node

### Create config files
Before build client or/and server, you must create a config files for client and server.

#### Config file for client
Create file `config.json` in a `client` folder. Example below demonstrate witch data you must create.
```json
{
    "hosts": {
        "node1": "xxx.xxx.xxx.xxx:xxxx"
    },
    "useHost": "node1",
    "showIp": true,
    "useHttps": false,
    "intervals": {
        "system": 60000,
        "daemon": 30000,
        "resources": 2000,
        "uptime": 600000
    },
    "price": {
        "currency": "usd",
        "update_interval": 60000
    },
    "blocks": [
        "hostname",
        "status",
        "blockheight",
        "uptime",
        "balance",
        "delegation",
        "rewards",
        "epoch",
        "ram-chart",
        "ram-usage",
        "cpu-usage",
        "cpu-load",
        "network",
        "peers",
        "addresses",
        "queries"
    ],
    "theme": "auto",
    "useProxy": false,
    "proxy": "https://server/proxy.php"
}
```

Section `hosts` contain information about your servers addresses. 
Each address must be an opened network interface/ip and port on the mina node server.
Parameter `useHost` defines host where client retrieves data.

Section `intervals` contain information about intervals (in milliseconds), with which data will be retrieve.

- `system` - general information about server and server time
- `daemon` - total currency, slot info, and epoch, node status
- `resources` - net, cpu, and ram information 
- `uptime` - interval for retrieve information about sidecar calculating server uptime
  
Parameter `theme` - default `auto` (dark\light mode dependence from os), value can be `dark`, `light` 
  
Section for using proxy (read about proxy below)
- `useProxy` - use or not proxy server
- `proxy` - proxy server address

For `price.currency` you can use one of the next values:
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

Parameter `blocks` - determines the order and display of blocks


#### Config file for server 
Create file `config.json` in a `server` folder. Example below demonstrate witch data you must create.
```json
{
    "publicKey": "B62qr...",
    "publicKeyDelegators": "B62qr...",
    "telegramToken": "XXXXXXXXXX:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "telegramChatID": "XXXXXXXXX",
    "telegramChatIDAlert": "XXXXXXXXX",
    "discordWebHook": "https://ptb.discord.com/api/webhooks/...",
    "balanceSendInterval": 300000,
    "alertInterval": 180000,
    "blockDiff": 2,
    "blockDiffToRestart": 4,
    "canRestartNode": true,
    "restartAfterNotSynced": 30,
    "restartCmd": "systemctl --user restart mina",
    "host": "you_ip_address:port",
    "graphql": "localhost:3085",
    "https": {
        "key": "",
        "cert": ""
    },
    "observeExplorer": true,
    "restartStateException": ["BOOTSTRAP"],
    "restartStateSyncedRules": ["MAX", "FORWARD-MAX", "FORK", "FORWARD-FORK", "HANG"],
    "alertToTelegram": ["EXEC","HELLO", "NOT-SYNCED", "MAX", "FORWARD-MAX", "FORK", "FORWARD-FORK", "HANG", "EXPLORER", "RESTART", "BALANCE", "PEERS", "MEM"],
    "alertToDiscord": ["EXEC","HELLO", "NOT-SYNCED", "MAX", "FORWARD-MAX", "FORK", "FORWARD-FORK", "HANG", "EXPLORER", "RESTART", "BALANCE", "PEERS", "MEM"],
    "price": {
        "currency": "usd",
        "updateInterval": 60000,
        "interval": 3600000,
        "targets": ["TELEGRAM", "DISCORD"]
    },
    "blockSpeedDistance": 10,
    "nodeInfoCollectInterval": 30000,
    "hangInterval": 1800000,
    "hangIntervalAlert": 900000,
    "memAlert": 90,
    "memRestart": 95,
    "snarkWorker": {
        "address": "B62qr...",
        "fee": 0.001,
        "stopBeforeBlock": 300000,
        "startAfterBlock": 60000,
        "runWorkerCommand": "mina client set-snark-worker -address <ADDRESS>",
        "setWorkerFeeCommand": "mina client set-snark-work-fee <FEE>",
        "controlInterval": 10000
    }
}
```

where

- `publicKey` - node key for getting balance
- `publicKeyDelegators` - node key for getting delegations
- `telegramToken` - your telegram bot token
- `telegramChatID` - chat id(s) for balance info, if there are several, must be separated by commas
- `telegramChatIDAlert` - chat id(s) for alerting, if there are several, must be separated by commas
- `balanceSendInterval` - the interval with which the server will send the current balance in telegrams
- `alertInterval` - the interval with which the server will check node state and send alerts in telegrams
- `blockDiff` - difference in blocks with MinaExplorer at which an alert will be sent
- `blockDiffToRestart` - difference in blocks when Mina will be restarted
- `host` - IP and PORT on which the server will run
- `graphql` - Mina node GraphQL address (by default `localhost:3085`)
- `canRestartNode` - if true, server can restart mina node
- `restartCmd` - command for restart mina node
- `https` - contains paths to cert and key to create https server
- `observeExplorer` - observe Explorer block height and alerts if height difference
- `restartStateException` - exceptions for states to restart node in non-sync 
- `restartStateSyncedRules` - enabled rules to restart in synced
- `discordWebHook` - full path to discord webhook
- `alertToTelegram` - types of alerts which will send to telegram 
- `alertToDiscord` - types of alerts which will send to discord 
- `price` - send price info to telegram/discord
- `blockSpeedDistance` - distance for block speed calculation
- `nodeInfoCollectInterval` - interval to collect node info into internal object. Recommended value `30000` (30 sec) 
- `hangIntervalAlert` - time to alert when node hanging
- `hangInterval` - time to restart when node hanging
- `memAlert` - value to alert when critical memory usage (0 - 100), 0 - no alert 
- `memRestart` - value to restart when critical memory usage (0 - 100), 0 - no restart

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

**Values for restart: `restartStateSyncedRules`**
- `MAX` - restart when height less than max block length 
- `FORWARD-MAX` - restart when height more than max block length 
- `FORK` - restart when height less than max unvalidated block length
- `FORWARD-FORK` - restart when height more than max unvalidated block length
- `HANG` - restart hanging detected

**Alert and Restart when critical memory usage**
These rules are controlled by parameters `memAlert` and `memRestart`.

### Build web client
To build client use command: 

```shell
npm run build
```

Now folder `dist` contains a compiled client files. Copy these to your web server.

### Running client and server locally

#### Client

```shell
npm run serve
```
or
```shell
npm start
```
or
```shell
npm run client
```

#### Server
```shell
npm run server
```

### Install server app
The application server must be installed on a machine with a Mina.
Monitor use graphql connection defined in config with prop `graphql` (default is `localhost:3085`) to get Mina info.
Also, the server requires opens external network interface if client run on a different server.
I use an external interface with a 3085 port and restrictions by iptables for connecting.

### Install server app
To install server app, copy files from `server` folder to your server to any folder convenient for you (for example copy to `~/node-monitor` in a home directory).

#### Dependencies
To run server app, you must install two dependencies:
+ `node-fetch`
+ `systeminformation`

You can install these with
```shell
cd ~/node-monitor
npm install node-fetch systeminformation --save
```

#### Run server
To run server execute command:
```shell
node monitor.mjs
```

## Sever side as Service

Also, you can run server as service. To run as service
+ replace `user-name` with your real server **user name** in `ExecStart` in `minamon.service` file.
+ copy `minamon.service` to `/usr/lib/systemd/user`
```shell
sudo cp node-monitor/minamon.service /usr/lib/systemd/user
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

## Proxy server
If you do not want to provide direct access to the server with Mina and the server side of the monitor, you can additionally use a proxy server.
The proxy server is written in **PHP**. This is a very simple script that allows you to redirect the request to the server side of the monitor and return it to the client side.
This approach allows you to provide access to the Mina server and the server side of the monitor only from the IP proxy server, and receive monitoring from any other IP address.

### Setting up a proxy server
The proxy server **proxy.php** is located in the `proxy/php` folder.
Next to the proxy server file there is **servers.php** with the parameters of the servers where the Monitor server part is installed.
This is a simple array in which the server parameters are specified in key:value pairs, and which must match the values,
specified in the `hosts` parameter of the client's configuration file (the client determines which server he wants to contact for
using the key `config.useHost` and specifies this value when requesting a proxy server):
```php
return $servers = [
    "node1" => "127.0.0.1:3085",  // Change to your real server address
    "node2" => "127.0.0.2:3085",  // Change to your real server address
    "node3" => "127.0.0.3:3085"   // Change to your real server address
];
```

### Setting up a proxy server
Copy the files `proxy.php` and `servers.php` in the folder `proxy/php` to a convenient location on your web server.
In the client config file, define 2 parameters `useProxy`,` proxy`:
```json
{
    ...,
    "useProxy": true,
    "proxy": "https://server/proxy.php"
}
```

### CPU Temperature
If your Monitor server-side part installed on Linux, you can get `CPU temperature` (of course, if you have CPU temperature sensors on the server).
If you are sure that there are sensors, but the client does not show the CPU temperature, try installing the `lm-sensors` package:
```shell
sudo apt install lm-sensors
```