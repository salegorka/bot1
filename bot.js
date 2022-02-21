const TelegramBot = require('node-telegram-bot-api');
const Init  = require("./classes/Init");
const Router = require("./classes/Router");
const UserController = require("./classes/UserController");
const WordController = require("./classes/WordController");

const init = new Init(); 
const config = init.loadConfig();
const db = init.createDbConnection();
const router = new Router();

// создаем маршруты

router.addRoute('registration', 'reg', UserController.registrate);
router.addRoute('start', 'add', WordController.addWord);

// создаем бота
const bot = new TelegramBot(config.token, {polling: true});
console.log("Bot Started");

bot.on('message', (msg) => {
    console.log("msg");
    let chatId = msg.chat.id;

    // получаем intent из сообщения

    let userMsg = msg.text;
    console.log(userMsg);
    let result = userMsg.match(/\/([a-zA-Z]+) (.+)/);
    let intent = "";
    let text = "";

    if (result) {
        intent = result[1];
        text = result[2]; 
    } else {
        let resp = "Непонятная команда. Список комманд /help";
        bot.sendMessage(chatId, resp);
        return;
    }
    

    // делаем запрос к базе за состоянием пользователя

    db.query("SELECT * FROM users WHERE chat_id = ?", [chatId], (err, result, fields) => {
        if (err) {
            console.log(err);
            const resp = "Ошибка при доступе к бд!";
            bot.sendMessage(chatId, resp);
            return;
        }
        if (result.length != 0) {
            // пользователь зарегистрирован, получаем state
            console.log(result);
            let state = result[0].state;
            let callback = router.route(state, intent);
            let data = {
                text,
                chatId,
                user: result[0]
            };
            console.log(callback);
            callback(state, intent, data, bot);
        } else {
            // пользователь незаригистрирован
            db.query("INSERT INTO users (chat_id, username, state) values ?", [[[chatId, '', 'registration']]], (err, result, fields) => {
                if (err) {
                    console.log(err);
                    const resp = "Ошибка при доступе к бд!";
                    bot.sendMessage(chatId, resp);
                    return;  
                }
                let resp = "Для использования бота, необходимо зарегистрироваться. Используйте комманду /reg username";
                bot.sendMessage(chatId, resp);    
            })
        }
    });
})

bot.on("polling_error", console.log);

/*

bot.onText(/\/эхо (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];

    bot.sendMessage(chatId, resp);
})

bot.onText(/\/привет (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const username = match[1];

    db.execute("SELECT * FROM users WHERE chat_id = ? OE username = ?)", [chatId, username] , (err, result, fields) => {
        if (err) {
            console.log(err);
            const resp = "Ошибка при регитстрации!";
            bot.sendMessage(chatId, resp);
        }
        if (result) {
            const resp = "Вы уже регистрировались или такое имя пользователя занято";
        } else {
            db.execute("INSERT INTO users (chatId, username) VALUES (?, ?)", [chatId, username], (err, result, fields) => {
                const resp = `Вы успешно зарегистрировались под именем пользователя ${username}`;
                bot.sendMessage(chatId, resp);
            });
        }
    }) 
})

*/