# Welcome to Mina Monitor Docker part
Start from 2.0.0 you can use docker container with Mina Monitor Client.

### Run container
```shell
sudo docker run --rm --name mina_monitor_client -p 2222:2222 -d olton/mina_monitor_client:latest -host mina_monitor_server_host:port
```

### Set Mina Monitor Server parameters
you can redefine config parameters with command line arguments:
- `-host` - define Mina Monitor Server host:port
- `-https` - set **true** if your Mina Monitor Server runs with security protocol
- `-shpwIp` - set **true** if yor want to see a Mina Server Monitor IP address
- `-theme` - set client theme

This command overwrite three config parameters:

```json
{
    "host": "mina_monitor_server_host:port",
    "https": true|false,
    "shpwIp": true|false,
    "theme": "auto|dark|light"
}
```
