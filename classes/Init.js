const fs = require('fs');
const mysql = require('mysql2');
class Init {
    loadConfig() {
        return JSON.parse(fs.readFileSync('config.json'));
    } 

    createDbConnection() {
        return mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "12345",
            database: "bot_english_words"
        })
    }
} 

module.exports = Init;