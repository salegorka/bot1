const Init  = require("./Init");
const init = new Init(); 
const db = init.createDbConnection();

class LearnController {
    static startLearning(state, intent, data, bot) {
        // Пользователь ввел команду про старт изучение, надо дать ему слово и поменять state
        LearnController.getNextWord(data.userId, (nextWord) => {
            if (nextWord === null) {
                const message = "У вас нет слов вам сначала надо их добавить";
                bot.sendMessage(data.chatId, message);
            } else {
                // Обновляем интент 
                
            }
        })
    }

    static getNextWordFromArray(NotTakenWords) {
        NotTakenWords[Math.floor(Math.random * NotTakenWords.length)]
    }

    static getNextWord(userId, callback) {
        // получение следующего слова
        db.query("SELECT * from words where user_id = ?", [userId], function(err, results, fields) {
            if (err) {
                console.log(err);
                const resp = "Ошибка при доступе к бд! Бот не работает";
                bot.sendMessage(data.chatId, resp);
                return;
            }
            if (result.length != 0) {
                let notTakenWords = [];
                result.forEach((el) => {
                    if (el.learn_taken == 0) {
                        notTakenWords.push(el);
                    }
                })
                if (notTakenWords.length == 0) {
                    // все слова пользователь уже использовал
                    db.query("UPDATE words SET learn_taken = 0 where userId = ?", [userId], function (err, results, fields) {
                        if (err) {
                            console.log(err);
                            const resp = "Ошибка при доступе к бд! Бот не работает";
                            bot.sendMessage(data.chatId, resp);
                            return;
                        }
                        // Обновили успешно
                        const NextWord = getNextWordFromArray[notTakenWords];
                        db.query("UPDATE words set learn_taken = 1 where word = ?", [NextWord.word], function(err, results, fields) {
                            if (err) {
                                console.log(err);
                                const resp = "Ошибка при доступе к бд! Бот не работает";
                                bot.sendMessage(data.chatId, resp);
                                return;
                            }
                            callback(NextWord);
                        })
                    })
                }
                else {
                    const NextWord = getNextWordFromArray[notTakenWords];
                    db.query("UPDATE words set learn_taken = 1 where word = ?", [NextWord.word], function(err, results, fields) {
                        if (err) {
                            console.log(err);
                            const resp = "Ошибка при доступе к бд! Бот не работает";
                            bot.sendMessage(data.chatId, resp);
                            return;
                        }
                        callback(NextWord);
                    })
                }
            } else {
                // у пользователя нет слов
                callback(null);
            }
        })
    }
}

module.exports = LearnController;

