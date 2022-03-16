class HelpController {
    static regHelp(state, intent, data, bot) {
        const message = "Для работы с ботом необходимо зарегистрироваться! Используйте команду /reg login";
        bot.sendMessage(data.chatId, message);
    }
}

module.exports= HelpController;