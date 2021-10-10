<p align="center">
    <img src="https://metroui.org.ua/res/mina-monitor-banner-1.0.4-1.jpg">
</p> 

# Mina Node Monitor
**Mina Monitor** is an extended graphical version of the` mina client status` command with additional indicators.
This is a `client-server` application for visual monitoring of the validator node and alerts when the node has a problem.

## Thanks to
+ [x] Gareth Davies for [Mina Explorer](https://minaexplorer.com/)
+ [x] StakeTab Team for [Validator Dashboard](https://mina.staketab.com//)

## Donate a project
You can support project, donate Mina to address:
> B62qqQjC8zaU8XXaeqb9rZXFSX9x12mCgjrdCQuJbXuxU2KUPFcH7aY

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

**Cluster Client:**
- [x] Anything that a simple client displays, plus
- [x] Displaying the status of several (up to 3) nodes on one page
- [x] Cyclic bypass of nodes, polling of general information for the address is carried out sequentially from synchronized nodes
- [x] Displaying the response rate of a GraphQL node to the main request

> You can find `Monitor Cluster` in [this repo](https://github.com/olton/mina-monitor-cluster)

**Monitor Server Side:**
- [x] Monitoring node health
- [x] Identification of critical node states (fork, forward fork, node freeze, lag/lead Mina Explorer)
- [x] Determining the Synchronization State of a Node
- [x] Automatic reboot of the node in case of critical state detection
- [x] Sending messages about the critical state of the node in Telegram and/or Discord
- [x] Sending the current balance of the specified address to Telegram and/or Discord
- [x] Sending Mina's cost to Telegram and/or Discord
- [x] Disabling snark-worker before block production and then resuming its work
- [x] Monitor memory consumption and reboot node when memory is critical


#### Monitor built with a stack:
- server - NodeJS, JavaScript
- client - JavaScript, HTML, CSS

> You can watch a [video about Mina Monitor](https://youtu.be/lKmbKi17N1g) on my [YouTube channel](https://www.youtube.com/channel/UC-AwjNVWxPRJYMG7vpiJnfQ)  

### Credits
+ [x] [Mina Monitor](https://github.com/olton/mina-node-monitor) by [Serhii Pimenov](https://github.com/olton)
+ [x] [Metro 4](https://github.com/olton/Metro-UI-CSS) by [Serhii Pimenov](https://github.com/olton)
+ [x] [ChartJS](https://github.com/olton/chartjs) by [Serhii Pimenov](https://github.com/olton)
+ [x] [SystemInformation](https://github.com/sebhildebrandt/systeminformation) by [Sebastian Hildebrandt](https://github.com/sebhildebrandt)
 
## Documentation
You can read about client and server in
- [Client](client/CLIENT-DOCS.md)
- [Server](server/SERVER-DOCS.md)
