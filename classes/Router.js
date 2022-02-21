class Router {
    constructor() {
        this.routes = [];
    }

    addRoute(state, intent, callback) {
        this.routes.push({
            state,
            intent,
            callback
        });
    }

    route(state, intent) {
        let currentCallback = 0;
        let callBackFound = false;
        this.routes.forEach((el) => {
            if (el.state == state && el.intent == intent) {
                currentCallback = el.callback;
                callBackFound = true;
            }
        })
        if (callBackFound) {
            return currentCallback;
        }
        else {
            return Router.defaultCallback;
        }
    }

    static defaultCallback(state, intent, data, bot) {
        let resp = "Неизвестная команда!";
        bot.sendMessage(data.chatId, resp);
    }
}

module.exports = Router;