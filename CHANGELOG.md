### 1.0.3
+ [x] The node will don't more restart is the block height different from Explorer.
+ [x] For restart in not SYNCED now uses parameter `restartAfterNotSynced` from config file.  
+ [x] Split RAM usage chart to two separate charts: free, usage.
+ [x] Block producer and snark worker now have a short name, you can click on these to copy to clipboard full name.
+ [x] Added block speed, showed in BLOCK HEIGHT panel
+ [x] Fixed client to work with server if one started on https. To config added key `useHttps` with `true` or `false` values.

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