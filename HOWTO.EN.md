# Mina Monitor - HOW-TO?
In this ** HOW-TO ** we will look at the various options for customizing the Monitor.
Only the issues of setting up ports and ip addresses and where and what to run will be considered.

### Abbreviations and definitions
- `Mina` - expanded node of mine validator
- `Monitor` - an extended graphical version of the` mina client status` command with additional indicators
- `validator node` || `node` - the server on which the Mina software is installed and running
- `SS` - server side
- `Monitor SS` || `Server` - the server part of the Monitor
- `CS` - client side
- `Monitor CS` || `Client` - the client part of the Monitor
- `host` - server and / or IP: PORT of the server on which Mina is running
- `graphql` - GraphQL which is created and run by the Mina node

## Option 1 - Local clone
In the first option, we will consider the case when everything works on one server (Mina, Monitor SS, Monitor CS) and does not go beyond the local network.
The repository was also cloned to the same server. It is not planned to copy anything and anywhere else and we will also watch the monitor on this computer.

### Server Configuration (File `server/config.js`)
It is necessary to take into account that Mina occupies, after launch, the following IP (interfaces) and ports:
- `external_IP: 8302` - P2P address
- `localhost: 3085` - GraphQL address

Let's assume that the `localhost:8000` interface is free on the system (you can use any other free port above 1024).
We will use this address to start the Server. To do this, write the following parameters for the Server and GraphQL in the configuration file:

```json
{
    "host": "localhost:8000",
    "graphql": "localhost:3085"
}
```

The rest of the parameters you specify at your discretion, according to their description in the README. And that's all about configuring the Monitor Server side.

### Client Configuration
Our Client must know where his server part lives in order to ask her for the current indicators. Earlier we specified the `host` parameter for the Server.
This is the required value. Let's describe our Server in the `hosts` parameter and define its use in the` useHost` parameter:
```json
{
    "hosts": {
        "node1": "localhost:8000"
    },
    "useHost": "node1"
}
```

The rest of the parameters you specify at your discretion, according to their description in the README. And that's all about configuring the Monitor Server side.

### Launch
Let's go to the directory where we cloned the repository and run it.

**Run the command to start the server:**
```shell
node server/monitor.mjs
```
As a result, you should see the following output without any additional messages:
```shell
Mina Node Server Monitor is running on http://localhost:8000
```

**Run the command to start the client**
For windows:
```shell
npm run serve
```
For linux:
```shell
npm run serve_x
```
The browser will start, and in the console you should see the output:
```shell
> @olton/mina-monitor@1.0.1 serve
> rimraf -rf output & md output & xcopy client\config.json ou
tput\*.* /Y && parcel serve --open -d output -p 2222 client/i
ndex.html

client\config.json
File copied: 1.
Server running at http://localhost:2222 
√  Built in 1.52s.
```

If you need to run the Client on a different port (other than 2222), change the run command in the `package.json` file in the` scripts` section.

## Option 2 - Local + Web server
If you have a **web server** running on your server, you can run the client from under it. 
To do this, we perform all the previous steps of Option 1, except for starting the client.
In the second case, we need to compile the client files for the web server.
To compile (build) the Client, run the following command:

For windows
```shell
npm run build
```

For linux
```shell
npm run build_x
```

When executed, you should see output similar to this in the console:

```shell
> @olton/mina-monitor@1.0.1 build
> rimraf -rf dist & md dist & npm run build_site


> @olton/mina-monitor@1.0.1 build_site
> xcopy client\config.json dist\*.* /Y /I && parcel build -d dist --public-url . --no-m
inify client/index.html

client\config.json
Files cpoied: 1.
√  Built in 1.18s.

dist\metro.05f88ce9.js.map         ‼  2.76 MB    240ms
dist\metro-all.86a093ae.css.map    ‼  1.47 MB     56ms
dist\metro.05f88ce9.js             ‼  1.11 MB    561ms
dist\metro-all.86a093ae.css        ‼  1.06 MB    148ms
dist\metro.7b7139cf.svg             536.33 KB    242ms
dist\chart.156ec6ff.js.map          205.25 KB    269ms
dist\metro.937a548f.woff            162.91 KB     28ms
dist\metro.45a8e540.ttf             162.84 KB    241ms
dist\chart.156ec6ff.js              107.93 KB     66ms
dist\app.173203a0.js.map              83.4 KB      8ms
dist\app.173203a0.js                 80.67 KB    345ms
dist\logo.d9bb64d7.png                51.2 KB    251ms
dist\index.html                      14.69 KB     12ms
dist\css.e1531409.css.map             4.42 KB      8ms
dist\css.e1531409.css                  2.8 KB     32ms
```

Now in the `dist` folder there are files prepared for the web server and they can be copied to a folder on your web server.
And start by typing the client's address in the browser:
```shell
http://your_web_server_address/monitor_folder/
```

Please note that at the moment the client works exclusively on the `http` protocol over` https` the client may not work due to the mixed content, since the Monitor Server runs on the `http` protocol (for sure in Chrome).

## Option 3 - Server and Client on different machines, Server running on same computer with Mina

Unlike the first two options, this option requires that the Server be launched on an open external interface.
Sources can be cloned to any computer.

### Server Configuration
Suppose we have an open interface on the server outside with the IP address `123.123.123.123` and port` 8000`.
To do this, write the following parameters for the Server and GraphQL in the configuration file 
(since the Server is running on the same computer as Mina, we use localhost to access GraphQL):

```json
{
    "host": "123.123.123.123:8000",
    "graphql": "localhost:3085"
}
```

### Client Configuration
```json
{
    "hosts": {
        "node1": "123.123.123.123:8000"
    },
    "useHost": "node1"
}
```

### Server Start
Copy the files from the `server` folder to a folder convenient for you on the north of Mina, go to this folder and run the command:

```shell
node server/monitor.mjs
```

### Launch client
If you don't have a web server, run the command from the cloned repository folder:

For windows:
```shell
npm run serve
```
For linux:
```shell
npm run serve_x
```

Alternatively, if you have a web server, follow the steps described for Option 2.

## Option 4 - Server and Client on different machines, Server works separately from Mina
It should be said right away that with this option, 
the Monitor sensors **ram** and **cpu** will show the state of the computer on which the server part of the monitor is running.

### Server
Copy the files from the `server` folder of the repository to a convenient place on the computer where the server part of the Monitor will work.

Next, we have two options:
1) We open a port on the Mina server to access GraphQL for the Monitor server side
2) We forward the GraphQL port using SSH from the Mina server to the Monitor server
3) We forward the Monitor Server port using SSH from the Mina server to your local computer

**Option 1**
Open the GraphQL port (flag `-insecure-rest-server` when starting Mina).
Let the ip address of the Mina node be `1.1.1.1` and the GraphQL port `3085`, and the ip address of the Monitor Server and port - `2.2.2.2:8000`
In the Server configuration file, write:

```json
{
    "host": "2.2.2.2:8000",
    "graphql": "1.1.1.1:3085"
}
```

Start the Server folder where you copied the server files with the command:

```shell
node monitor.mjs
```

** Option 2 **
We forward GraphQL with the command:

```shell
ssh -L 3085:localhost:3085 user@mina_server_ip_address
```

Now we have a working GraphQL server locally, at the address `localhost:3085` (you can check it by clicking on the link `http://localhost:3085/graphql`)
Let the Monitor Server ip address and port be `2.2.2.2:8000`. In the Server configuration file, write:

```json
{
    "host": "2.2.2.2:8000",
    "graphql": "localhost:3085"
}
```

Start the Server folder where you copied the server files with the command:

```shell
node monitor.mjs
```

### Client
In the client's configuration file, we write:

```json
{
    "hosts": {
        "node1": "2.2.2.2:8000"
    },
    "useHost": "node1"
}
```

Compile and run with any of the options listed above.

**Option 3**
Let you start the monitor server on a computer with an ip address of `1.1.1.1` and port` 8000`.
The server config states

```json
{
"host": "1.1.1.1:8000"
}
```

We forward the Monitor Server with the command
```shell
ssh -L 8000: 1.1.1.1: 8000 your_user_name@1.1.1.1
```

After executing this command, the server side of the monitor will work locally on port 8000.
Now you can specify in the settings:

For client:

```json
{
    "hosts": {
        "node1": "localhost: 8000"
    }
}
```