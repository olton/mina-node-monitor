# Mina Node Monitor

<p align="center">
    <img src="https://metroui.org.ua/res/node-monitor.jpg">
</p>

#### Clone repository
```shell
git clone https://github.com/olton/mina-node-monitor.git
```

#### Install required packages
```shell
npm i
```

### Build web client
#### Create config file
You must create config file with name `nodes.js` in `html/js/helpers` folder
```javascript
export default {
    node1: "http://127.0.0.1:3085", // use your server settings 
}
```
#### Build client
To build client use command
```shell
npm run build
```

### Build server app
#### Dependencies
To build server app, you must install two dependencies:
+ `node-fetch`
+ `systeminformation`

#### Create config file
First-of you must create config file in folder `src` with name `config.mjs`. This file contains values to server run: host, port, protocol
```javascript
export default {
    https: false,
    port: 3085,
    host: "127.0.0.1" // external interface
}
```
To run server execute command:
```shell
node src/monitor.mjs
```

#### Run as service
To run server app as service you must copy `minamon.service` to `/usr/lib/systemd/user`
```shell
sudo cp node-monitor/minamon.service /usr/lib/systemd/user
```
Now you can `start`, `stop`, and `restart` server app with commands
```shell
systemctl --user start minamon
systemctl --user stop minamon
systemctl --user restart minamon
systemctl --user status minamon
```