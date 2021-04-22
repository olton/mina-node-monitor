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
Now folder `dist` contains a ready client scripts. Copy these to your web server.

### Build server app
The application server must be installed on a machine with a Mina.
Monitor use graphql connection on `localhost:3085` to get Mina info.
Also, the server requires opens network interface.
I use an external interface with a 3085 port and restrictions by iptables for connecting.

### Install server app
TO install server app, copy files from `src` folder to your server to any folder convenient for you.

#### Dependencies
To build/run server app, you must install two dependencies:
+ `node-fetch`
+ `systeminformation`

You can install these with
```shell
npm install node-fetch systeminformation --save
```

#### Create config file
First-of, you must create config file in a folder where you copied server app files with name `config.mjs`. 
This file contains values to server run: host, port, protocol
```javascript
export default {
    publicKey: "B62qr...", // public ket to get balance
    telegramToken: `XXXXXXXXXX:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`, // your telegram bot TOKEN
    telegramChatID: "XXXXXXXXX", // your chat id
    balanceSendInterval: 60000 * 60 * 24, // the interval for balance send to telegram 
    https: false, // server app protocol, currently ssl not supports
    port: 3085, // server app port
    host: "127.0.0.1" // opened external network interface
}
```
To run server execute command:
```shell
node src/monitor.mjs
```

#### Run as service
+ First-of: replace `user-name` with your real **user name** in `ExecStart` in `minamon.service` file.
+ Second: copy `minamon.service` to `/usr/lib/systemd/user`
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