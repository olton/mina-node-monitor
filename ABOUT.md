# About Mina Monitor

### English

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

### Українська

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

### Русский

**Monitor Client:**
- [x] Отображение основных показателей сети Мина (Block height, uptime, epoch and slot info)
- [x] Отображение состояния демона узла (SYNCED, CATCHUP, BOOTSTRAP, ...)
- [x] Отображение здоровья узла (ОК, Fork, Hanging)
- [x] Отображение потребляемых узлом ресурсов сервера (CPU, RAM, NETWORK)
- [x] Отображение баланса указанного адрес и стоимости этого баланса в различных валютах
- [x] Отображение информации о делегациях на указанный адрес валидатора
- [x] Отображение информации о выигранных блоках и полученном вознаграждении в текущей эпохе
- [x] Отображение общей информации о сервере узла
- [x] Удобные живые графики для отображения потребляемых ресурсов
- [x] Отзывчивый (responsive) интерфейс (Комфортно смотреть и на ПК и на телефоне и на планшете)

**Monitor Cluster:**
- [x] Все, что отображает простой клиент, плюс
- [x] Отображение состояния нескольких (до 3-х) узлов на одной странице
- [x] Циклический обход узлов, опрос общей информации для адреса осуществляется последовательно с синхронизированных узлов
- [x] Отображение скорости ответа GraphQL узла на основной запрос

> Вы можете найти `Monitor Cluster` в [этом репозитории](https://github.com/olton/mina-monitor-cluster)

**Monitor Server Side:**
- [x] Контроль здоровья узла
- [x] Определение критических состояний (форк, опережающий форк, зависание узла, отставание/опережение Mina Explorer)
- [x] Определение состояния синхронизированности узла
- [x] Автоматическая перезагрузка узла в случае обнаружения критического состояния
- [x] Отправка сообщений о критическом состоянии узла в Телеграм и/или Дискорд
- [x] Отправка текущего баланса указанного адрес в Телеграм и/или Дискорд
- [x] Отправка стоимости Мины в Телеграм и/или Дискорд
- [x] Отключение snark-worker перед производством блока и последующее возобновление его работы
- [x] Контроль потребления памяти и перезагрузка узла при критическом использовании памяти
