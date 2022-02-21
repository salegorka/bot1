const Init  = require("./Init");
const init = new Init();
const db = init.createDbConnection();

class WordController {
    static addWord(state, intent, data, bot) {
        // Команда добавления слова
        console.log(data.text.split(" "));
        let [eng, ru] = data.text.split(" ");
        // Ищем английское слово в таблице
        if (eng === null || ru === null) {
            let resp = "Неккоректная команда. Список комманд /help";
            bot.sendMessage(data.chatId, resp);
            return;
        }
        db.query("SELECT * FROM words WHERE eng_word = ? && user_id = ?", [eng, data.user.id], function (err, result, fields) {
            if (err) {
                console.log(err);
                const resp = "Ошибка при доступе к бд! Бот не работает";
                bot.sendMessage(data.chatId, resp);
                return;
            }
            if (result.length != 0) {
                // Нашли такое слово, предложим пользователю удалить его
                let resp = "Такое слово уже найдено в вашем словаре. Удалить его можно командой /del . Если вы хотите поменять перевод, удалите слово и добавьте его заново";
                bot.sendMessage(data.chatOd, resp);
            } else {
                // Слово новое
                db.query("INSERT INTO words (eng_word, translate, user_id) values ?", [[[eng, ru, data.user.id]]], function(err, result, fields) {
                    if (err) {
                        console.log(err);
                        const resp = "Ошибка при доступе к бд! Бот не работает";
                        bot.sendMessage(data.chatId, resp);
                        return;
                    }
                    let resp = "Слово успешно добавлено в ваш словарь!";
                    bot.sendMessage(data.chatId, resp);
                })
            }
        })
    }

}

module.exports = WordController;