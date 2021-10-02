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
curl -s https://raw.githubusercontent.com/olton/scripts/master/mina/monitor/server/install.sh | bash -s -- branch_or_tag target_folder
```
