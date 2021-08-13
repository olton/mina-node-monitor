# Welcome to Mina Monitor Docker part
Start from 1.1.5 you can use docker container with Mina Monitor Server.

### Run container
```shell
sudo docker run --rm --network=host -d olton/mina_monitor_server:latest -journal false
```

### Set Mina Monitor Server parameters
Begin from 1.1.5, you can redefine config parameters with command line arguments:
```shell
node server/index -publicKey B62q... -price:currency usd -alertToDiscord ["FAIL"]
```
This command overwrite three config parameters:
```json
{
    "publicKey": "B62q...",
    "price": {
        "currency": "usd"
    },
    "alertToDiscord": ["FAIL"]
}
```

To run docker image of the Mina Monitor Server with specified config parameters you must add it to end of command:
```shell
sudo docker run --rm --name mina_monitor_server --network=host -d olton/mina_monitor_server:latest -journal false -publicKey B62q... 
```

> You must always set parameter `journal` to `false`! 