const Init  = require("./Init");
const init = new Init(); 
const db = init.createDbConnection();

class UserController {
    static registrate(state, intent, data, bot) {
        // Регистрируем пользователя 
        db.query("UPDATE users SET username = ?, state = ? where chat_id = ?", [data.text, 'start', data.chatId], (err, result, fields) => {
            if (err) {
                console.log(err);
                const resp = "Ошибка при доступе к бд! Бот не работает!";
                bot.sendMessage(data.chatId, resp);
                return;  
            }
            let resp = "Вы успешно зарегистрированы под именем " + data.text + " Можете приступать к работе с ботом. Список комманд /help";
        }) 
    }
}

module.exports = UserController;