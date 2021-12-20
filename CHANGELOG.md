### 2.1.0
+ [x] Server: added interaction with a block height from Mina Explorer
+ [x] Server: added interaction with the latest block from Mina Explorer
+ [x] Server: changed config for `telegram` and `discord` definition, updated functions for sending alerts and price
+ [x] Server: removed config parameters `telegramToken`, `telegramChatID`, `telegramChatIDAlert`, `discordWebHook`
+ [x] Server: added config parameters `telegram`, `discord` 
+ [x] Server: added config options for `telegram`: `token`, `tokenInfo`, `tokenAlert`, `chatIDInfo`, `chatIDAlert` 
+ [x] Server: added config options for `discord`: `webhook`, `webhookInfo`, `webhookAlert`, `botName` 
+ [x] Server: to config parameters `alertToTelegram`, `alertToDiscrod` added value `PRICE`. Parameter `price:targets` deprecated 
+ [x] Server: to config parameters `alertToTelegram`, `alertToDiscrod` added value `REWARDS`
+ [x] Server: to config parameters `alertToTelegram`, `alertToDiscrod` added value `UPTIME`
+ [x] Server: removed config parameter `balanceSendInterval`
+ [x] Server: added config parameter `channel:info` to define which alerts will send to the info channel 
+ [x] Server: changed reconnect interval to comparable node from `1s` to `30s`
+ [x] Server: changed parameter `comparison`. Now this parameter has a new structure
+ [x] Server: added response for Monitor Version
+ [x] Server: added watcher for config file
+ [x] Server: config parameters `memAlert`, `memRestart` deprecated. You must use new parameters: `memory:alert`, `memory:restart`
+ [x] Server: config parameters `hangIntervalAlert`, `hangInterval` deprecated. You must use new parameters: `hang:alert`, `hang:restart`
+ [x] Server: added response about server start mode `https` with value `true` or `false`
+ [x] Server: added support for static files for webserver
+ [x] Server: added config parameter `webRoot`. With this parameter you can set a webRoot folder other than default (the same where the monitor is installed)

### 2.0.3
+ [x] Server: added support for time interval string values for parameter `restartAfterNotSynced`  
+ [x] Server: improved check for Fork. Now check work if all control values gt zero
+ [x] Server: default value for config parameter `blockDiffToRestart` changed to `10`
+ [x] Server: default value for config parameter `blockDiff` changed to `3`

### 2.0.2
+ [x] Server: added restart by long uptime with config parameter `restartAfterUptime`. The value must be defined in milliseconds or internal time string format . Default value is `0` (no restart)
+ [x] Server: added config parameter `name`. Now you can define a name for you node, if name is not define, Monitor will use a hostname
+ [x] Server: improvements for singing messages
+ [x] Server: command `node index --init` now updated config file if one exists
+ [x] Server: added config parameter `comparison` 
+ [x] Server: added alert with rule `COMPARE` for alerting when node height is different from comparable nodes  
+ [x] Server: changed algorithm for memory observing

### 2.0.1
+ [x] Server: fixed snark worker controller for first start, issue #7
+ [x] Server: fixed spams when snark worker controller can not start sw
+ [x] Server: fixed issue for set telegramChatID from command line

### 2.0.0
+ [x] Server: changed data exchange protocol from `http(s)` to `ws(s)`
+ [x] Server: added command line arguments support. Now you can rewrite config parameters with command line arguments
+ [x] Server: refactoring code, switch to CommonJS modules
+ [x] Server: improved `alerter` for `HANG` state detecting
+ [x] Server: added logic to disable `HANG` alert/restart when `hangInterval`, `hangIntervalAlert` is `0`
+ [x] Server: added control for mina stopped with `journalctl` and write this event to the log
+ [x] Server: added alert to `telegram` and/or `discord` about `mina daemon` stops by failure (info from `journalctl`)
+ [x] Server: added response for request `sync-state`. Return daemon sync state (`SYNCED`, `BOOTSTRAP`, ...) or `UNKNOWN`
+ [x] Server: added helper function `timeParser(t)` for parsing time, defined in short string (ex: `1d3h23m45s`, `30m`, `10s`, `2h30s`)
+ [x] Server: config parameter `restartAfterNotSynced` must be defined in milliseconds or short time string (ex: `30m`)
+ [x] Server: changed alerts events to Telegram and Discord. Value `NON_SYNCED` is deprecated, to alert change sync status use value `STATUS`
+ [x] Server: changed config property `price:interval` to `price:sendInterval`
+ [x] Server: removed collecting Mina Explorer Height, config parameter `observeExplorer` deprecated
+ [x] Server: config parameter `blockDiff` now can be `0` to disable **fork** checking  
+ [x] Server: config parameter `blockDiffToRestart` now can be `0` to disable restart node when **fork** detected  

+ [x] Client: changed data exchange protocol from `http(s)` to `ws(s)`
+ [x] Client: added support short string time format in config
+ [x] Client: config parameters `inervals:*` are deprecated
+ [x] Client: config parameters `price:*` are deprecated
+ [x] Client: config parameters `proxy`, `useProxy` are deprecated
+ [x] Client: config parameters `hosts`, `useHost` are deprecated. You must use parameter `host: "server_ip_or_name:port"`
+ [x] Client: config parameter `useHttps` are deprecated. You must use parameter `https: true|false`
+ [x] Client: fixed color for uptime position label for 120+ places 

### 1.1.4
+ [x] Server: added `snark worker` controller
+ [x] Server: added request for `node response time`
+ [x] Server: improved work of the `alerter` for detecting `forks`
+ [x] Server: use stored state for responses

+ [x] Client: updated for using new responses

### 1.1.3
+ [x] Server: fixed exception alert in uptime module when service is down 

### 1.1.2
+ [x] Fixed memory leaks for setTimeout circular links
+ [x] Server: added `process.memory` to get mem request 

### 1.1.1
+ [x] Server: improved alerts for `FORK` states
+ [x] Server: added alert for `NO PEERS` state
+ [x] Server: node info now stored into local object every time interval defined in `consfig.nodeInfoCollectInterval`
+ [x] Server: added config property `config.blockSpeedDistance` with default value `10` to calculate blockchain speed
+ [x] Server: information about mina now return from stored object
+ [x] Server: added request for node health, request return empty array if `OK` or filled array with critical states
+ [x] Server: alerter now use stored node info
+ [x] Server: improved alerts for `HANG` state
+ [x] Server: added config properties `hangInterval`, `hangIntervalAlert`, config option `restartAfterPrev` is deprecated, use `hangInterval`
+ [x] Server: added config options `memAlert`, `memRestart` as a percent value (0 - 100)

+ [x] Client: added reaction for node health request
+ [x] Client: Node health now is displaying in sync status block

### 1.0.5 -> 1.1.0
+ [x] Server: fixed uptime sender for using `publicKeyDelegators`
+ [x] Server: fixed alerter module for forward for when unvalidated length is 0
+ [x] Server: changed possible values for `config.restartStateSyncedRules` to `["MAX", "FORK", "FORWARD-FORK", "HANG"]`
+ [x] Server: config props `restartAfterMax`, `restartAfterUnv` is deprecated, use `blockDiffToRestart`
+ [x] Server: added alert to DISCORD (used **discord webhooks**)
+ [x] Server: added config props `alertToTelegram`, `alertToDiscord`. Possible values: `["NOT-SYNCED", "MAX", "FORK", "FORWARD-FORK", "HANG", "EXPLORER", "RESTART", "BALANCE"]`
+ [x] Server: moved request to `coingecko` from client to server
+ [x] Server: added `config.price` parameter

+ [x] Client: added flashing for `maxHeight`, `unvalidateHeight`, `explorerHeight` when difference present with the current height
+ [x] Client: high/low price now showing **all-time** high/low  
+ [x] Client: added price change in currency, added colored arrow for indicate price change  
+ [x] Client: next `config` props deprecated and not used: `cpu`, `net`, `mem`, `blockchain`, `node`, `info`, `time`
+ [x] Client: added new config props: `system` (server info and time), `resources` (cpu, net, ram), `daemon` (data from Mina GraphQL: node info, blockchain status)
+ [x] Client: changed CPU temperature view
+ [x] Client: changed block height view
+ [x] Client: added border radius to panels 
+ [x] Client: progress bar for epoch now showing time left  
+ [x] Client: added config check. If config contains errors, Monitor puts to the console error message
+ [x] Client: reorder blocks with `config.blocks` option
+ [x] Client: optimized build scripts. (**Important**, required `npm i`)

### 1.0.4
+ [x] Server: added request for delegators
+ [x] Server: added new config props `publicKeyDelegators`
+ [x] Server: added check for chain exist in `node.mjs:getBlockSpeed()`
+ [x] Server: added check for forward fork (block height more than unvalidated)
+ [x] Server: added request to Explorer GraphQL to get won blocks for current epoch
  
+ [x] Client: show `delegations` count and total stack for `current` and `next` epoch
+ [x] Client: added price data from `coingecko.com`  
+ [x] Client: change style for scrollbars
+ [x] Client: new config props `price: {currency, interval}`
+ [x] Client: updated uptime, the position value now more pronounced
+ [x] Client: fixed using dark theme
+ [x] Client: added won blocks for current epoch into EPOCH panel

### 1.0.3
+ [x] Server: The node will don't more restart is the block height different from Explorer.
+ [x] Server: Alert for difference height to Explorer height now enabled/disabled with config parameter `observeExplorer`
+ [x] Server: For restart in not SYNCED now uses parameter `restartAfterNotSynced` from config file.
+ [x] Server: The Node will not restart when non-synced for states defined in config parameter `restartStateException`. This is an array. Recommended set it to `["BOOTSTRAP"]`.
+ [x] Server: Changed rules for restart node in `synced`. Added rules for difference with max block length, unvalidated block length, and equal to previous block height     
+ [x] Server: Removed config parameter `redtartAfter`
+ [x] Server: Now you must use parameters `restartAfterMax`, `restartAfterUnv`, `restartAfterPrev` (`restartAfterMax`, `restartAfterUnv` parameters must have value in minutes, `restartAfterPrev` - integer, how many times the alert must go off before the mine is restarted)
+ [x] Server: You can enable restart rules for synced mode with the config parameter `restartStateSyncedRules`. This parameter must have value as an array and can contain the next values: `['MAX', 'UNV', 'PREV']`
+ [x] Server: Added alerts to telegram for: difference block height from max block and unvalidated block, and equals to previous retrieved block height

+ [x] Client: Split RAM usage chart to two separate charts: free, usage.
+ [x] Client: Block producer and snark worker now have a short name, you can click on these to copy to clipboard full name.
+ [x] Client: Added block speed, showed in BLOCK HEIGHT panel
+ [x] Client: Fixed work with server if one started on https. To config added key `useHttps` with `true` or `false` values.
+ [x] Client: Fixed network chart for align max value and split to two different charts

### 1.0.2
+ [x] Added cpu threads load chart
+ [x] Re-disposition RAM and CPU panels content
+ [x] Added https server creation. Use server conf option `https` to set paths to cert and key
+ [x] Added dark/light modes
+ [x] Visual improvements

### 1.0.1
+ [x] Added php proxy server
+ [x] Added uptime values from sidecar (parsed from http://uptime.minaprotocol.com)
+ [x] The module for obtaining information about the CPU and RAM has been rewritten 

### 1.0.0
+ [x] First release