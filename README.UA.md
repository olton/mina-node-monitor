<p align="center">
    <img src="https://metroui.org.ua/res/mina-monitor-banner-1.0.4-1.jpg">
</p> 

# Mina Node Monitor
** Mina Node Monitor ** це розширений графічний варіант команди `mina client status` з додатковими показниками.
Монітор являє собою `клієнт-серверний` додаток для візуального представлення поточного стану вузла і сигналізації про помилки в його роботі.

## Основні можливості

**Monitor Client:**
- [x] Відображення основних показників мережі Mina (Block height, uptime, epoch and slot info)
- [x] Відображення стану демона вузла (SYNCED, CATCHUP, BOOTSTRAP, ...)
- [x] Відображення здоров'я вузла (ОК, Fork, Hanging)
- [x] Відображення споживаних вузлом ресурсів сервера (CPU, RAM, NETWORK)
- [x] Відображення балансу зазначеного адресу і вартості цього балансу в різних валютах
- [x] Відображення інформації про делегаціях на вказану адресу валідатора
- [x] Відображення інформації про виграних блоках і отриманому винагороду в поточній епосі
- [x] Відображення загальної інформації про сервер вузла
- [x] Зручні живі графіки для відображення споживаних ресурсів
- [x] Чуйний (responsive) інтерфейс (Комфортно дивитися і на ПК і на телефоні і на планшеті)

**Monitor Cluster:**
- [x] Все, що відображає простий клієнт, плюс
- [x] Відображення стану декількох (до 3-х) вузлів на одній сторінці
- [x] Циклічний обхід вузлів, опитування загальної інформації для адреси здійснюється послідовно з синхронізованих вузлів
- [x] Відображення швидкості відповіді GraphQL вузла на основний запит

> Ви можете знайти `Monitor Cluster` в [цьому репозиторії](https://github.com/olton/mina-monitor-cluster)

**Monitor Server Side:**
- [x] Контроль здоров'я вузла
- [x] Визначення критичних станів (форк, випереджаюче форк, зависання вузла, відставання / випередження Mina Explorer)
- [x] Визначення стану синхронізації вузла
- [x] Автоматичне перезавантаження вузла в разі виявлення критичного стану
- [x] Відправлення повідомлень про критичний стан вузла в Telegram та/або Discord
- [x] Відправка поточного балансу зазначеного адреса в Telegram та/або Discord
- [x] Відправка вартості Міни в Telegram та/або Discord
- [x] Відключення snark-worker перед виробництвом блоку і подальше відновлення його роботи
- [x] Контроль споживання пам'яті та перезавантаження вузла при критичному використанні пам'яті

#### Програмний стек:
- сервер - JavaScript (Node JS >= v14)
- клієнт - JavaScript, HTML, CSS

### Використано компоненти
+ [x] [Mina Node Monitor](https://github.com/olton/mina-node-monitor) by [Serhii Pimenov](https://github.com/olton)
+ [x] [Metro 4](https://github.com/olton/Metro-UI-CSS) by [Serhii Pimenov](https://github.com/olton)
+ [x] [ChartJS](https://github.com/olton/chartjs) by [Serhii Pimenov](https://github.com/olton)
+ [x] [SystemInformation](https://github.com/sebhildebrandt/systeminformation) by [Sebastian Hildebrandt](https://github.com/sebhildebrandt)
 
## Що і як

### Попередні вимоги
Для використання та/або будовання необхідно встановити `NodeJS`,` npm`.
Так само варто враховувати, що для будування клієнта та/або запуску клієнта в локальному оточенні автор використовує Parcel 1.x (c Parcel 2.x не працює).

#### Клонуйте репозіторій
```shell
git clone https://github.com/olton/mina-node-monitor.git
```

#### Встановить необхідні пакети
```shell
npm i
```

**Монітор складається з двох частин:**

- `Кліент` - використовується для візуалізації стану вузла в браузері
- `Сервер` - використовується для отримання необхідної інформації з сервера, де розгорнуто вузол, відправки її клієнту і сигналізації про неполадки

### Створення конфігураційних файлів
Клієнт і сервер використовують у своїй роботі спеціальні конфігураційні файли в форматі `json`.
Ви повинні створити їх перед будуванням/запуском.

#### Конфигурационный файл для клиента
Створіть в папці `client` файл` config.json`. Нижче представлений повний приклад конфігураційного файлу з описом кожної опції.

```json
{
    "hosts": {
        "node1": "xxx.xxx.xxx.xxx:xxxxx"
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

Секція `hosts` містить інформацію про сервери, на яких встановлена серверна частина Монітору.
Кожна адреса повинна визначати мережевий інтерфейс/ip та його порт.
Параметр `useHost` визначає який сервер зі списку в секції` hosts` буде використовуватись.
Параметр `showIp` визначає показувати чи ні IP адресу в блоці ** Addresses ** (іноді не варто світити IP адресу).

Секція `intervals` містить інформацію про інтервали з якими будуть оновлюватися дані (in milliseconds).
Врахуйте, що кожен параметр визначає окремий запит до сервера та/або GraphQL вузла тому дуже уважно підходьте до вибору значень.
Кожен запит виконується у власному не блокуючому потоці.

**Інтервали:**

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

#### Конфігураційний файл для сервера 

Створіть в папці `server` файл` config.json`. Нижче представлений повний приклад конфігураційного файлу з описом кожної опції.

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
    "restartStateSyncedRules": ["MAX", "FORWARD-MAX", "FORK", "FORWARD-FORK", "HANG"],
    "alertToTelegram": ["EXEC","HELLO", "NOT-SYNCED", "MAX", "FORWARD-MAX", "FORK", "FORWARD-FORK", "HANG", "EXPLORER", "RESTART", "BALANCE", "PEERS", "MEM"],
    "alertToDiscord": ["EXEC","HELLO", "NOT-SYNCED", "MAX", "FORWARD-MAX", "FORK", "FORWARD-FORK", "HANG", "EXPLORER", "RESTART", "BALANCE", "PEERS", "MEM"],
    "price": {
        "currency": "usd",
        "updateInterval": 60000,
        "interval": 3600000,
        "targets": ["TELEGRAM", "DISCORD"]
    },
    "blockSpeedDistance": 10,
    "nodeInfoCollectInterval": 30000,
    "hangInterval": 1800000,
    "hangIntervalAlert": 900000,
    "memAlert": 90,
    "memRestart": 95,
    "snarkWorker": {
        "address": "B62qr...",
        "fee": 0.001,
        "stopBeforeBlock": 300000,
        "startAfterBlock": 60000,
        "runWorkerCommand": "mina client set-snark-worker -address <ADDRESS>",
        "setWorkerFeeCommand": "mina client set-snark-work-fee <FEE>",
        "controlInterval": 10000
    }
}
```

where

- `publicKey` - node key for getting balance
- `publicKeyDelegators` - node key for getting delegations
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
- `blockSpeedDistance` - distance for block speed calculation
- `nodeInfoCollectInterval` - interval to collect node info into internal object. Recommended value `30000` (30 sec)
- `hangIntervalAlert` - time to alert when node hanging
- `hangInterval` - time to restart when node hanging
- `memAlert` - value to alert when critical memory usage (0 - 100), 0 - no alert
- `memRestart` - value to restart when critical memory usage (0 - 100), 0 - no restart
- `snarkWorker` - options to control snark worker

**Snark worker controller**
- `address` - address to start snark worker after **stop**
- `fee` - snark worker **fee** value
- `stopBeforeBlock` - milliseconds to stop before block producing
- `startAfterBlock` - milliseconds to start after block producing
- `runWorkerCommand` - command to set or unset address for snark worker
- `setWorkerFeeCommand` - command to set snark worker fee
- `controlInterval` - interval to work SW controller

**Values for alerts: `alertToTelegram`, `alertToDiscord`**
- `HELLO` - node says Hello
- `NOT-SYNCED` - node not `SYNCED`
- `MAX` - block height less than max block length
- `FORWARD-MAX` - block height more than max block length
- `FORK` - block height less than max unvalidated block length
- `FORWARD-FORK` - block height more than max unvalidated block length
- `HANG` - node in hanging state
- `EXPLORER` block height more or less of Mina Explorer height
- `RESTART` - alert when restart exec
- `BALANCE` - send balance
- `PEERS` - send alert if node don't has a peers
- `MEM` - send alert if critical memory usage detected

**Values for restart: `restartStateSyncedRules`**
- `MAX` - restart when height less than max block length
- `FORWARD-MAX` - restart when height more than max block length
- `FORK` - restart when height less than max unvalidated block length
- `FORWARD-FORK` - restart when height more than max unvalidated block length
- `HANG` - restart hanging detected

**Alert and Restart when critical memory usage**
These rules are controlled by parameters `memAlert` and `memRestart`.

### Збірка клієнтського додатка

Для складання клієнтської програми виконайте команду, вказану нижче:

```shell
npm run build
```

Тепер папка `dist` містить скомпільовані файли клієнта. Скопіюйте зазначені файли на ваш web server.

### Running client and server locally

#### Client

```shell
npm run serve
```
or
```shell
npm start
```
or
```shell
npm run client
```

#### Server
```shell
npm run server
```

### Установка сервера

Сервер монітора повинен бути встановлений на тому ж фізичному сервері, де працює нода **Mina**.
Сервер запитує інформацію у Ноди через її GraphQL за адресою, вказаною в параметрі конфіга `graphql` (за замовчуванням цей адрес`localhost: 3085`).
Сервер віддає інформацію клієнту через зовнішній мережевий інтерфейс, тому ви повинні подбати про наявність такого відкритого інтерфейсу.
Я використовую зовнішній інтерфейс з портом **3085** і мережевими обмеженнями на підключення, визначеними через **iptables**.

### Встановлення сервера додатку
Для установки сервера просто скопіюйте файли з папки `server` в будь-яку папку на вашому **Mina** сервері (для прикладу нехай буде папка в домашньому каталозі користувача` ~ / node-monitor`).

#### Залежності
Для роботи сервера потрібно встановити кілька програмних модулей, а саме:

+ `node-fetch`
+ `systeminformation`

Інформацію про ці пакети ви можете подивитися на сайті [npmjs.com](https://www.npmjs.com/) 

Що б встановити необхідні залежності виконайте команду, вказану нижче:
```shell
cd ~/node-monitor
npm install node-fetch systeminformation --save
```

#### Запуск сервера

Для запуска сервера виконайте команду:

```shell
node monitor.mjs
```

Після того як ви запустили сервер, клієнт може отримувати від нього інформацію.

## Запуск сервера в якості сервісу

Ви можете запустити сервер додатку як сервіс, що б системний демон стежив за його коректної роботою і перезапускати його в разі потреби, наприклад при перезавантаженні сервера.
Для забезпечення такої функції є готовий файл сервісу `minamon.service`.
Що б запустити сервер як сервіс виконайте кілька простих дій:

+ Замініть в файлі `minamon.service` в параметрі` ExecStart` значення `user-name` на реальне ім'я користувача в системі
+ Скопіюйте `minamon.service` в системну папку `/usr/lib/systemd/user` командою, зазначеної нижче

```shell
sudo cp node-monitor/minamon.service /usr/lib/systemd/user
```

Активуйте сервіс для автоматичного запуску в разі перезавантаження серверу командой: 
```shell
systemctl --user enable minamon
```

Запустіть сервер:
```shell
systemctl --user start minamon
```

Тепер ви можете виконувати команди для сервісу, такі як: `start`, `stop`, and `restart`:

```shell
systemctl --user start minamon
systemctl --user stop minamon
systemctl --user restart minamon
systemctl --user status minamon
```

## Проксі-сервер
Якщо ви не хочете надавати прямий доступ до сервера с Mina та серверною частиною Монітора, Ви можете додатково використовувати проксі-сервер.
Проксі-сервер написано на *PHP*. Це дуже простий скріпт, якій дозволяє переадресувати запит до серверної частини монітора та повернути його клієнтській частині.
Такій підхід дозволяє надати доступ до сервера Mina та серверній частині Монітора лише з IP проксі-сервера, а моніторинг отримувати з будь-якої іншої IP адреси.

### Налаштування проксі-сервера
Проксі-сервер **proxy.php** розташовано в папці `proxy/php`. 
Поряд з файлом проксі-сервера розташовано файл **servers.php* з параметрами серверів де встановлено серверну частину монітора. 
Це простий масив в якому зазначено парами ключ:значення параметри серверів і які повинні збігатися зі значеннями, 
зазначеними в параметрі `hosts` конфігураційного файла клієнта (клієнт визначає до якого серверу він хоче звернутися за 
допомогою ключа `config.useHost` і вказує це значення при запиті до проксі-сервера):
```php
return $servers = [
    "node1" => "127.0.0.1:3085",  // Change to your real server address
    "node2" => "127.0.0.2:3085",  // Change to your real server address
    "node3" => "127.0.0.3:3085"   // Change to your real server address
];
```

### Встановлення проксі-сервера
Скопіюйте файли `proxy.php` та `servers.php` із папки `proxy/php` в зручне для вас місце на вашому web сервері.
В конфігураційному файлі кліента визначте 2 параметри `useProxy`, `proxy`:
```json
{
    ...,
    "useProxy": true,
    "proxy": "https://server/proxy.php"
}
```

