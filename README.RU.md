<p align="center">
    <img src="https://metroui.org.ua/res/mina-monitor-banner-1.0.4-1.jpg">
</p> 

# Mina Node Monitor
**Mina Node Monitor** это расширенный графический вариант команды `mina client status` с дополнительными показателями.
Монитор представляет собой `клиент-серверное` приложение для визуального представления текущего состояния узла и сигнализации об ошибках в его работе.

## Основные возможности
1. Отслеживание состояния узла в реальном времени
2. Показ 12+ параметров: статус, время работы, баланс и т.д. ...
3. Отображение текущей загрузки сети, процессора, памяти с использованием графиков
4. Мониторинг `здоровья` узла, если узел рассинхронизирован с основной сетью и/или находится в состоянии, отличном от SYNCED, монитор отправляет об этом сообщение вам в телеграм
5. Перезапуск узла, если такое действие разрешено

#### Программный стек:
- сервер - JavaScript
- клиент - JavaScript, HTML, CSS

### Использованы компоненты
+ [x] [Mina Node Monitor](https://github.com/olton/mina-node-monitor) by [Serhii Pimenov](https://github.com/olton)
+ [x] [Metro 4](https://github.com/olton/Metro-UI-CSS) by [Serhii Pimenov](https://github.com/olton)
+ [x] [ChartJS](https://github.com/olton/chartjs) by [Serhii Pimenov](https://github.com/olton)
+ [x] [SystemInformation](https://github.com/sebhildebrandt/systeminformation) by [Sebastian Hildebrandt](https://github.com/sebhildebrandt)
 
## Что и как

### Предварительные требования
Для использования и/или сборки необходимо установить `NodeJS`, `npm`. 
Так же стоит учитывать, что для сборки клиента и/или запуска клиента в локальном окружении автор использует Parcel 1.x (c Parcel 2.x не работает).

#### Клонируйте репозиторий
```shell
git clone https://github.com/olton/mina-node-monitor.git
```

#### Установите требуемые пакеты
```shell
npm i
```

**Монитор состоит из двух частей:**

- `Клиент` - используется для визуализации состояния узла в браузере
- `Сервер` - используется для получения необходимой информации с сервера, где развернут узел, отправки ее клиенту и сигнализации о неполадках

### Создание конфигурационных файлов
Клиент и сервер используют в своей работе специальные конфигурационные файлы в формате `json`.
Вы должны создать их перед сборкой/запуском.

#### Конфигурационный файл для клиента
Создайте в папке `client` файл `config.json`. Ниже представлен полный пример конфигурационного файла с описанием каждой опции.
```json
{
    "hosts": {
        "node1": "xxx.xxx.xxx.xxx:xxxx"
    },
    "useHost": "node1",
    "showIp": true,
    "useHttps": false,
    "intervals": {
        "system": 60000,
        "daemon": 30000,
        "resources": 2000,
        "uptime": 600000
    },
    "price": {
        "currency": "usd",
        "update_interval": 60000
    },
    "blocks": [
        "hostname",
        "status",
        "blockheight",
        "uptime",
        "balance",
        "delegation",
        "rewards",
        "epoch",
        "ram-chart",
        "ram-usage",
        "cpu-usage",
        "cpu-load",
        "network",
        "peers",
        "addresses",
        "queries"
    ],
    "theme": "auto",
    "useProxy": false,
    "proxy": "https://server/proxy.php"
}
```

Секция `hosts` содержит информацию о серверах, на которых установлена серверная часть Монитора. 
Каждый адрес должен определять открытый внешний сетевой интерфейс/ip и его порт.
Параметр `useHost` определяет какой сервер из списка в секции `hosts` будет использоваться.
Параметр `showIp` определяет показывать или нет IP адрес в блоке **HOSTNAME** (иногда не стоит светить IP адрес).

Секция `intervals` содержит информацию об интервалах с которыми будут обновляться данные (in milliseconds). 
Учтите, что каждый параметр определяет отдельный запрос к серверу и/или GraphQL ноды поэтому очень внимательно подходите к выбору значений.
Каждый запрос выполняется в собственном не блокирующем потоке.

**Интервалы:**

- `system` - general information about server and server time
- `daemon` - total currency, slot info, and epoch, node status
- `resources` - net, cpu, and ram information
- `uptime` - interval for retrieve information about sidecar calculating server uptime

Parameter `theme` - default `auto` (dark\light mode dependence from os), value can be `dark`, `light`

Section for using proxy (read about proxy below)
- `useProxy` - use or not proxy server
- `proxy` - proxy server address

For `price.currency` you can use one of the next values:
```
"btc", "eth", "ltc", "bch", "bnb", "eos", "xrp", "xlm",
"link", "dot", "yfi", "usd", "aed", "ars", "aud", "bdt", "bhd",
"bmd", "brl", "cad", "chf", "clp", "cny", "czk", "dkk", "eur",
"gbp", "hkd", "huf", "idr", "ils", "inr", "jpy", "krw", "kwd",
"lkr",  "mmk",  "mxn",  "myr",  "ngn",  "nok",  "nzd",  "php",
"pkr",  "pln",  "rub",  "sar",  "sek",  "sgd",  "thb",  "try",
"twd",  "uah",  "vef",  "vnd",  "zar",  "xdr",  "xag",  "xau",
"bits",  "sats"
```

Parameter `blocks` - determines the order and display of blocks

#### Конфигурационный файл для сервера 
Создайте в папке `server` файл `config.json`. Ниже представлен полный пример конфигурационного файла с описанием каждой опции.
```json
```json
{
    "publicKey": "B62qr...",
    "publicKeyDelegators": "B62qr...",
    "telegramToken": "XXXXXXXXXX:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "telegramChatID": "XXXXXXXXX",
    "telegramChatIDAlert": "XXXXXXXXX",
    "discordWebHook": "https://ptb.discord.com/api/webhooks/...",
    "balanceSendInterval": 300000,
    "alertInterval": 300000,
    "blockDiff": 2,
    "blockDiffToRestart": 4,
    "canRestartNode": true,
    "restartAfterPrev": 4,
    "restartAfterNotSynced": 30,
    "restartCmd": "systemctl --user restart mina",
    "host": "you_ip_address:port",
    "graphql": "localhost:3085",
    "https": {
        "key": "",
        "cert": ""
    },
    "observeExplorer": true,
    "restartStateException": ["BOOTSTRAP"],
    "restartStateSyncedRules": ["MAX", "FORK", "FORWARD-FORK", "HANG"],
    "alertToTelegram": ["NOT-SYNCED", "MAX", "FORK", "FORWARD-FORK", "HANG", "EXPLORER", "RESTART", "BALANCE"],
    "alertToDiscord": ["NOT-SYNCED", "MAX", "FORK", "FORWARD-FORK", "HANG", "EXPLORER", "RESTART", "BALANCE"],
    "price": {
        "currency": "usd",
        "interval": 3600000,
        "targets": ["TELEGRAM", "DISCORD"]
    }
}
```

where

- `publicKey` - node key for getting balance
- `telegramToken` - your telegram bot token
- `telegramChatID` - chat id(s) for balance info, if there are several, must be separated by commas
- `telegramChatIDAlert` - chat id(s) for alerting, if there are several, must be separated by commas
- `balanceSendInterval` - the interval with which the server will send the current balance in telegrams
- `alertInterval` - the interval with which the server will check node state and send alerts in telegrams
- `blockDiff` - difference in blocks with MinaExplorer at which an alert will be sent
- `blockDiffToRestart` - difference in blocks when Mina will be restarted
- `host` - IP and PORT on which the server will run
- `graphql` - Mina node GraphQL address (by default `localhost:3085`)
- `canRestartNode` - if true, server can restart mina node
- `restartAfterPrev` - integer value, how many times the alert must go off before the mine is restarted, if node synced and height is equal to previous retrieved height, monitor trigger this alert. Check will process every 2 alerts period. In the time this value **~ restartAfterPrev * alertInterval * 2**.
- `restartCmd` - command for restart mina node
- `https` - contains paths to cert and key to create https server
- `observeExplorer` - observe Explorer block height and alerts if height difference
- `restartStateException` - exceptions for states to restart node in non-sync
- `restartStateSyncedRules` - enabled rules to restart in synced
- `discordWebHook` - full path to discord webhook
- `alertToTelegram` - types of alerts which will send to telegram
- `alertToDiscord` - types of alerts which will send to discord
- `price` - send price info to telegram/discord

### Сборка клиентского приложения

Для сборки клиентского приложения выполните команду, указанную ниже:

**Для Windows**
```shell
npm run build
```

**Для Linux**
```shell
npm run build_x
```

Теперь папка `dist` содержит скомпилированные файлы клиента. Скопируйте указанные файлы на ваш web server.

Если у вас нет web сервера, вы можете запустить клиента в локальном окружении. Для этого выполните команду:

**Для Windows**
```shell
npm run serve
```

**Для Linux**
```shell
npm run serve_x
```

### Установка сервера

Сервер приложения должен быть установлен на том же физическом сервере, где работает нода **Mina**.
Сервер запрашивает информацию у ноды через ее GraphQL по адресу, указанному в параметре конфига `graphql` (по умолчанию этот адрес`localhost:3085`).
Сервер отдает информацию клиенту через внешний сетевой интерфейс, поэтому вы должны позаботиться о наличии такого открытого интерфейса.
Я использую внешний интерфейс с портом **3085** и сетевыми ограничениями на подключение, определенными через iptables.

### Установка сервера приложения
Для установки сервера просто скопируйте файлы из папки `srver` в любую папку на вашем Mina сервере (для примера пусть будет папка в домашнем каталоге пользователя `~/node-monitor`).

#### Зависимости
Для работы сервера нужно установить несколько программных зависимостей:
+ `node-fetch`
+ `systeminformation`

Информацию об этих пакетах вы можете посмотреть на сайте [npmjs.com](https://www.npmjs.com/) 

Что бы установить необходимые зависимости выполните команду, указанную ниже:
```shell
cd ~/node-monitor
npm install node-fetch systeminformation --save
```

#### Запуск сервера

Для запуска сервера выполните команду:

```shell
node monitor.mjs
```

После того как вы запустили сервер, клиент может получать от него информацию.

## Запуск сервера в качестве сервиса

Вы можете запустить сервер приложения как сервис, что бы системный демон следил за его корректной работой и перезапускал его в случае необходимости, например при перезагрузке сервера.
Для обеспечения такой функции есть готовый файл сервиса `minamon.service`.
Что бы запустить сервер как сервис выполните несколько простых действий:

+ замените в файле `minamon.service` в параметре `ExecStart` значение `user-name` на реальное имя пользователя в системе
+ скопируйте `minamon.service` в системную папку `/usr/lib/systemd/user` командой, указанной ниже

```shell
sudo cp node-monitor/minamon.service /usr/lib/systemd/user
```

Активируйте сервис для автоматического запуска в случае перезагрузки сервера командой: 
```shell
systemctl --user enable minamon
```

Запустите сервер:
```shell
systemctl --user start minamon
```

Теперь вы можете выполнять команды для сервиса, такие как: `start`, `stop`, and `restart`:

```shell
systemctl --user start minamon
systemctl --user stop minamon
systemctl --user restart minamon
systemctl --user status minamon
```

## Прокси-сервер
Если вы не хотите предоставлять прямой доступ к серверу с Mina и серверной частью монитора, Вы можете дополнительно использовать прокси-сервер.
Прокси-сервер написан на **PHP**. Это очень простой скрипт, которой позволяет переадресовать запрос к серверной части монитора и вернуть его клиентской части.
Такой подход позволяет предоставить доступ к серверу Mina и серверной части монитора только с IP прокси-сервера, а мониторинг получать с любого другого IP адреса.

### Настройка прокси-сервера
Прокси-сервер **proxy.php** расположен в папке `proxy/php`.
Рядом с файлом прокси-сервера лежит **servers.php** с параметрами серверов где установлена серверная часть Монитора.
Это простой массив, в котором указаны парами ключ:значение параметры серверов, и которые должны совпадать со значениями,
указанными в параметре `hosts` конфигурационного файла клиента (клиент определяет к какому серверу он хочет обратиться за
помощью ключа `config.useHost` и указывает это значение при запросе к прокси-сервера):
```php
return $servers = [
    "node1" => "127.0.0.1:3085",  // Change to your real server address
    "node2" => "127.0.0.2:3085",  // Change to your real server address
    "node3" => "127.0.0.3:3085"   // Change to your real server address
];
```

### Установка прокси-сервера
Скопируйте файлы `proxy.php` и` servers.php` папке `proxy / php` в удобное для вас место на вашем web сервере.
В конфигурационном файле клиента определите 2 параметра `useProxy`,` proxy`:
```json
{
    ...,
    "useProxy": true,
    "proxy": "https://server/proxy.php"
}
```
