# Mina Monitor Client

The Mina Monitor Client (then just Client) is a JavaScript application, written in HTML, CSS, JavaScript, 
and intended for showing data, received from Mina Monitor Server. 

> #### Client must be launched on desktop system with installed web browser.


### Pre-requirements
To use or/and build monitor you need install `NodeJS`, `npm`.

## Installation
You can install the Client in various ways:

- via Bash
- via Docker
- and manual (for developers or power-users)

### Install via Bash

To install default `master` branch into folder `~/mina-monitor-client`, you can use command:

```shell
curl -s https://raw.githubusercontent.com/olton/scripts/master/mina/monitor/client/install.sh | bash -s
```

If you need to install specified branch or tag into a specified folder, you must define ones on the end of command:

```shell
curl -s https://raw.githubusercontent.com/olton/scripts/master/mina/monitor/client/install.sh | bash -s -- branch_or_tag target_folder
```

***Important! If you need to specify the target folder, you must indicate a branch or tag.***

### Install via Docker

To install Server via Docker, please read [DOCKER.md](DOCKER.md)

### Install manual

**Important!** For assembling use the only Parcel 1.x!

You will need manual installation if you want to install from the sources of the cloned repository.
The first you need - clone repository:

```shell
git clone https://github.com/olton/mina-node-monitor.git
cd mina-node-monitor
npm install
```

## Create config file
Before build or run client, you must create a config file.
The config file is a text file with a data in a JSON format. Example below demonstrate witch data you must create.
```json
{
    "host": "1.2.3.4:8000",
    "showIp": true,
    "https": false,
    "theme": "auto"
}
```

To create config file, run command:
```shell
node client/start.js --no-start
```

This command will create a config file with a default parameters.

### Config file parameters

- `host` defines host where client retrieves data
- `showIp` show or hide server's IP address on client
- `https` - if **true** connection will be over `htts/wss`
- `theme` - default `auto` (**dark/light** mode dependence from os), value can be `dark`, `light`

In additional you can use parameter `blocks`. This parameter determines the order and display of blocks:
```json
{
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
        "consensus"
    ]
}
```

## Run a client
You can run a client locally with a command:
```shell
npm start
```
or build files for using with a web server:
```shell
npm run build
```

After executing build command, you get in folder `dist` files for your webserver.
You can copy these files to your web server to use remotely.