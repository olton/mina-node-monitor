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