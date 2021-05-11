<p align="center">
    <img src="https://metroui.org.ua/res/node-monitor-11-05-2021-2.jpg">
</p> 

# Mina Node Monitor
**Mina Node Monitor** is a `client-server` application for visual monitoring of the validator node and alerts when node have a problem.

## Key Features
1. Track the status of a node in real time
2. Shows 12 parameters: status, uptime, balance, ...
3. Shows the load on memory, processor, network
4. Monitors the state of the node and, if the node is out of sync with the main network and / or has switched / is in a status other than SYNCED, sends notifications to Telegram
5. Restart node when de-sync discovered

#### Monitor built with a stack:
- server - NodeJS, JavaScript
- client - JavaScript, HTML, CSS

### Credits
+ [x] [Mina Node Monitor]() by [Serhii Pimenov](https://github.com/olton)
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
npm i
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
        "node1": "192.168.1.2:3085"
    },
    "useHost": "node1",
    "intervals": {
        "info": 60000,
        "time": 60000,
        "blockchain": 30000,
        "node": 30000,
        "net": 2000,
        "mem": 2000,
        "cpu": 2000
    }
}
```

Section `hosts` contain information about your servers addresses. 
Each address must be an opened network interface on the mina node server.
Parameter `useHost` defines host where client retrieves data.

Section `intervals` contain information about intervals (in milliseconds), with which data will be retrieve.

- `info` - general information about server
- `time` - server time and uptime
- `blockchain` - total currency, slot info, and epoch
- `node` - interval for retrieve data from mina GraphQL server
- `net` - interval for retrieve network information: speed, connections
- `mem` - interval for retrieve information about server memory
- `cpu` - interval for retrieve information about server CPU(s)

#### Config file for server 
Create file `config.json` in a `server` folder. Example below demonstrate witch data you must create.
```json
{
    "publicKey": "B62qr...",
    "telegramToken": "XXXXXXXXXX:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "telegramChatID": "XXXXXXXXX, XXXXXXXXX",
    "telegramChatIDAlert": "XXXXXXXXX, XXXXXXXXX",
    "balanceSendInterval": 86400000,
    "alertInterval": 60000,
    "blockDiff": 2,
    "canRestartNode": true,
    "restartAfter": 30,
    "restartCmd": "systemctl --user restart mina",
    "host": "192.168.1.2:3085",
    "graphql": "localhost:3085"
}
```

where

- `publicKey` - node key for getting balance
- `telegramToken` - your telegram bot token
- `telegramChatID` - chat id(s) for balance info, if there are several, must be separated by commas
- `telegramChatIDAlert` - chat id(s) for alerting, if there are several, must be separated by commas
- `balanceSendInterval` - the interval with which the server will send the current balance in telegrams
- `alertInterval` - the interval with which the server will check node state and send alerts in telegrams
- `blockDiff` - difference in blocks with MinaExplorer at which an alert will be sent
- `host` - IP and PORT on which the server will run
- `graphql` - Mina node GraphQL address
- `canRestartNode` - if true, server can restart mina node
- `restartAfter` - value in minutes, if node synced and height is lower from Mina Explorer within the specified time, node will restart after this interval
- `restartCmd` - command for restart mina node

### Build web client
To build client use command: 

**for Windows**
```shell
npm run build
```

**for Linux**
```shell
npm run build_x
```

Now folder `dist` contains a compiled client files. Copy these to your web server.

If you don't have a web server, you can run the client in your local environment. To do this, run the command:

**For Windows**
```shell
npm run serve
```

**For Linux**
```shell
npm run serve_x
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