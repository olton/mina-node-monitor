<p align="center">
    <img src="https://metroui.org.ua/res/mina-monitor-banner2.jpg">
</p> 

# Mina Node Monitor
** Mina Node Monitor ** це розширений графічний варіант команди `mina client status` з додатковими показниками.
Монітор являє собою `клієнт-серверний` додаток для візуального представлення поточного стану вузла і сигналізації про помилки в його роботі.

## Основні можливості
1. Відстеження стану вузла в реальному часі
2. Показ 12+ параметрів: статус, час роботи, баланс і т.д. ...
3. Відображення поточної завантаження мережі, процесора, пам'яті з використанням графіків
4. Моніторинг `здоровья` вузла, якщо вузол рассінхронізірован з основною мережею та/або знаходиться в стані, відмінному від SYNCED, монітор відправляє про це повідомлення вам в телеграм
5. Перезапуск вузла, якщо така дія дозволена

#### Програмний стек:
- сервер - JavaScript
- кліент - JavaScript, HTML, CSS

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
        "info": 60000,
        "time": 60000,
        "blockchain": 30000,
        "node": 30000,
        "net": 2000,
        "mem": 2000,
        "cpu": 2000,
        "uptime": 600000
    },
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

- `info` - основна інформація про сервер (ОС, модель процесора)
- `time` - місцевий час на сервері і його Аптайм
- `blockchain` - всього монет, інформація про поточний слоті і епосі, отримання з GraphQL вузла
- `node` - інтервал отримання основної інформації з GraphQL вузла
- `net` - інтервал оновлення інформації про завантаження мережі: speed, connections
- `mem` - інтервал оновлення інформації про завантаження оперативної пам'яті сервера
- `cpu` - інтервал оновлення інформації про завантаження CPU (s)
- `uptime` - interval for retrieve information about sidecar calculating server uptime
- `theme` - default `auto` (dark\light mode dependence from os), value can be `dark`, `light`

Section for using proxy (інформацію про проксі-сервер викладено нижче)
- `useProxy` - use or not proxy server
- `proxy` - proxy server address

#### Конфігураційний файл для сервера 

Створіть в папці `server` файл` config.json`. Нижче представлений повний приклад конфігураційного файлу з описом кожної опції.

```json
{
    "publicKey": "B62qr...",
    "telegramToken": "XXXXXXXXXX:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "telegramChatID": "XXXXXXXXX",
    "telegramChatIDAlert": "XXXXXXXXX",
    "balanceSendInterval": 300000,
    "alertInterval": 300000,
    "blockDiff": 2,
    "canRestartNode": true,
    "restartAfterMax": 30,
    "restartAfterUnv": 30,
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
    "restartStateSyncedRules": ["MAX", "UNV", "PREV"]
}
```

**Опції**

- `publicKey` - Ключ, для якого буде запитуватися баланс
- `telegramToken` - Токен вашого telegram бота (як створити і налаштувати бота шукайте в Гуглі, там все є)
- `telegramChatID` - Ідентифікатори чатів одержувачів інформації про стан балансу, можна вказати кілька через кому
- `telegramChatIDAlert` - Ідентифікатори чатів одержувачів інформації про помилки вузла (рассинхронизация, вихід зі статусу SYNCED), можна вказати кілька через кому
- `balanceSendInterval` - Інтервал з яким буде відправлятися інформація про поточний баланс в телеграм
- `alertInterval` - Інтервал з яким буде відправлятися інформація про помилки вузла в телеграм
- `blockDiff` - Різниця в висоті блоків з [MinaExplorer](https://minaexplorer.com/) (в подальшому можливо змінеться) при якому буде вважатися, що вузол рассіхронізірован
- `host` - IP і PORT на якому буде працювати сервер монітора
- `graphql` - Адреса на якому працює GraphQL вузла
- `canRestartNode` - Якщо значення цього ключа **true**, сервер може перезапустити вузол міни
- `restartAfterMax` - value in minutes, if node synced and height is difference to max block length, node will restart after this interval
- `restartAfterUnv` - value in minutes, if node synced and height is difference to unvalidated block height, node will restart after this interval
- `restartAfterPrev` - integer value, how many times the alert must go off before the mine is restarted, if node synced and height is equal to previous retrieved height, monitor trigger this alert. Check will process every 2 alerts period. In the time this value **~ restartAfterPrev * alertInterval * 2**.
- `restartCmd` - Команда для перезапуска вузла Mina
- `https` - contains paths to cert and key to create https server
- `observeExplorer` - observe Explorer block height and alerts if height difference
- `restartStateException` - exceptions for states to restart node in non-sync
- `restartStateSyncedRules` - enabled rules to restart in synced

### Збірка клієнтського додатка

Для складання клієнтської програми виконайте команду, вказану нижче:

**Для Windows**
```shell
npm run build
```

**Для Linux**
```shell
npm run build_x
```

Тепер папка `dist` містить скомпільовані файли клієнта. Скопіюйте зазначені файли на ваш web server.
Якщо у вас немає web сервера, ви можете запустити клієнта в локальному оточенні. Для цього виконайте команду:

**Для Windows**
```shell
npm run serve
```

**Для Linux**
```shell
npm run serve_x
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

