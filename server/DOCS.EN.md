# Mina Monitor Server
Welcome to Mina Monitor Server!

## DOCUMENTATION
The Mina Monitor Server (then just Server) is a JavaScript application, written in NodeJS, and intended for monitors Mina nodes.
The Server collects information about the node, monitors node health, and restarts the node if needed, and send collected information to clients.

> Before you start using Mina Monitor Server, you must install `NodeJS` ver **14+**.

### Installation
To install Server, copy files from folder `server` in this repository to the convenient place on your Mina server. 
To best experience, use a separate folder on the target server. For example, we will use folder `minamon`.

#### Install
```shell
ver='websocket'
mkdir -p minmon
curl -L https://github.com/olton/mina-node-monitor/tarball/${ver} >> server.tar.gz
url=$(tar -tf server.tar.gz | head -n 1) | tar --strip-components=2 -xf server.tar.gz ${url}server
rm server.tar.gz
```

#### Install with SVN
To install with `svn`, use command 
```shell
svn export https://github.com/olton/mina-node-monitor/tree/master/server
```