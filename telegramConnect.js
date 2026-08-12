console.log("🔥 TELEGRAM FILE LOADED");
console.log(__filename);

const { TelegramBot } = require('node-telegram-bot-api');
console.log("TelegramBot type:", typeof TelegramBot);

//const {TelegramBot} = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.tgbottoken;

const bot = new TelegramBot(token, { polling: true });

bot.on('polling_error', (error) => {
    console.log("POLLING ERROR:");
    console.log(error);
});

console.log("🤖 Telegram bot is running...");

function starttgListener(handleMessage) {

    bot.on('message', (msg) => {

        console.log("Message received!");
        console.log("Telegram User ID:", msg.chat.id);
        console.log("Name:", msg.from.first_name);
        console.log("Message:", msg.text);

        if (msg.text && msg.text.startsWith('/start')) {

            const messageParts = msg.text.split(' ');
            const code = messageParts[1];

            handleMessage({
                code: code,
                chatId: msg.chat.id,
                username: msg.from.username,
                firstname: msg.from.first_name
            });
        }
    });
}

module.exports = {
    bot,
    starttgListener
};