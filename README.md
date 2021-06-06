<p align="center">
    <img src="https://metroui.org.ua/res/mina-monitor-banner2.jpg">
</p> 

# Mina Node Monitor
**Mina Monitor** is an extended graphical version of the` mina client status` command with additional indicators.
This is a `client-server` application for visual monitoring of the validator node and alerts when the node has a problem.

## Key Features
1. Track the status of a node in real time
2. Shows 12 parameters: status, uptime, balance, ...
3. Shows the load on memory, processor, network
4. Monitors the state of the node and, if the node is out of sync with the main network and / or has switched in a status other than SYNCED, sends notifications to Telegram
5. Restart node when de-sync discovered. Two types: de-sync, long time not synced with the same block height.

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
        "node1": "xxx.xxx.xxx.xxx:xxxx"
    },
    "useHost": "node1",
    "showIp": true,
    "useHttps": false,
    "intervals": {
        "info": 60000,
        "time": 60000,
        "blockchain": 30000,
        "node": 30000,
        "net": 2000,
        "mem": 2000,
        "cpu": 2000,
        "uptime": 600000
    },
    "theme": "auto",
    "useProxy": false,
    "proxy": "https://server/proxy.php",
}
```

Section `hosts` contain information about your servers addresses. 
Each address must be an opened network interface/ip and port on the mina node server.
Parameter `useHost` defines host where client retrieves data.

Section `intervals` contain information about intervals (in milliseconds), with which data will be retrieve.

- `info` - general information about server
- `time` - server time and uptime
- `blockchain` - total currency, slot info, and epoch
- `node` - interval for retrieve data from mina GraphQL server
- `net` - interval for retrieve network information: speed, connections
- `mem` - interval for retrieve information about server memory
- `cpu` - interval for retrieve information about server CPU(s)
- `uptime` - interval for retrieve information about sidecar calculating server uptime
- `theme` - default `auto` (dark\light mode dependence from os), value can be `dark`, `light` 
  
Section for using proxy (read about proxy below)
- `useProxy` - use or not proxy server
- `proxy` - proxy server address



#### Config file for server 
Create file `config.json` in a `server` folder. Example below demonstrate witch data you must create.
```json
{
    "publicKey": "B62qr...",
    "telegramToken": "XXXXXXXXXX:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "telegramChatID": "XXXXXXXXX",
    "telegramChatIDAlert": "XXXXXXXXX",
    "balanceSendInterval": 300000,
    "alertInterval": 300000,
    "blockDiff": 2,
    "canRestartNode": true,
    "restartAfterMax": 30,
    "restartAfterUnv": 30,
    "restartAfterPrev": 4,
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
    "restartStateSyncedRules": ["MAX", "UNV", "PREV"]
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
- `graphql` - Mina node GraphQL address (by default `localhost:3085`)
- `canRestartNode` - if true, server can restart mina node
- `restartAfterMax` - value in minutes, if node synced and height is difference to max block length, node will restart after this interval
- `restartAfterUnv` - value in minutes, if node synced and height is difference to unvalidated block height, node will restart after this interval
- `restartAfterPrev` - integer value, how many times the alert must go off before the mine is restarted, if node synced and height is equal to previous retrieved height, monitor trigger this alert. Check will process every 2 alerts period. In the time this value **~ restartAfterPrev * alertInterval * 2**. 
- `restartCmd` - command for restart mina node
- `https` - contains paths to cert and key to create https server
- `observeExplorer` - observe Explorer block height and alerts if height difference
- `restartStateException` - exceptions for states to restart node in non-sync 
- `restartStateSyncedRules` - enabled rules to restart in synced

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
