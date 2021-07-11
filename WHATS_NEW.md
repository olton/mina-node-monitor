### 1.1.1
+ [x] New algorithm to check node hanging
+ [x] New alert for `NO PEERS` state
+ [x] `health` object for node to display node health on client (`OK`, `FORK`, `UNKNOWN`, `NO PEERS`, `NOT-SYNCED`).
+ [x] Many changes for improving work of the server-side
+ [x] Alert and restart node if `Critical memory usage` state detected
+ [x] Can be used for `Mina Monitor Cluster`

### 1.0.5 -> 1.1.0
+ [x] Alert to Discord
+ [x] Define which alerts will send to telegram or discord  
+ [x] Reorder blocks with `config.blocks`
+ [x] Optimized config files. Configs changed! Read `readme` and `changeloag`
+ [x] New visual (soft changes)
+ [x] Changed rules to restart, now node will restart if value in block difference reached
+ [x] Send price info to telegram/discord
+ [x] Request to `COINGECKO` moved from client to server

### 1.0.4
+ [x] Delegations info
+ [x] Rewards in current epoch info
+ [x] Mina price info
+ [x] Calculate balance in USD
+ [x] Check for forward fork

### 1.0.3
+ [x] Five types of alert: `Long-non-sync`, `Diff-with-max`, `Diff-with-unvalidated`, `Hanging-state`, `Diff-with-Explorer`
+ [x] Four events to restart: `Long-non-sync`, `Diff-with-max`, `Diff-with-unvalidated`, `Hanging-state`
+ [x] New charts for `RAM`, `CPU`, `NETWORK`
+ [x] Calculating network speed and show in `BLOCK HEIGHT` panel
+ [x] Server and client optimization

### 1.0.2
+ [x] Added cpu threads load chart
+ [x] Re-disposition RAM and CPU panels content
+ [x] Added https server creation. Use server conf option https to set paths to cert and key
+ [x] Added dark/light modes
+ [x] Visual improvements

### 1.0.1
+ [x] Restarting Node if this operation granted and require
+ [x] Added simple proxy-server, written on PHP
+ [x] Added uptime position and score from sidecar
+ [x] Visual improves
+ [x] Re-written server code for CPU and RAM
+ [x] Added HOW-TO (RU, EN)

### 1.0.0
+ [x] First release