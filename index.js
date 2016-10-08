"use strict";

let TelegramBot = require('node-telegram-bot-api');


let key = process.env.BOT_TOKEN || require('./key.json').key;

let bot = new TelegramBot(key, {
    polling: true
});

let pokeCount = {};

bot.onText(/\/start/, function(msg) {
    console.log("on text");
    let chatId = msg.chat.id;
    let opts = {
        reply_markup: JSON.stringify({
            keyboard: [
                ['Poke']
            ],
            resize_keyboard: true
        })
    };
    console.log(JSON.stringify(opts));
    bot.sendMessage(chatId, "*Sleepy koala is asleep*", opts);
});

bot.onText(/Poke/i, function(msg) {
    let chatId = msg.chat.id;
    if (!pokeCount[chatId]) pokeCount[chatId] = 0;
    pokeCount[chatId]++;
    let response = "";
    switch (pokeCount[chatId]) {
        case 1:
            bot.sendMessage(chatId, "Koala is still asleep");
            break;
        case 2:
            bot.sendMessage(chatId, "Stop poking the koala!");
            break;
        case 3:
            bot.sendMessage(chatId, "You are just evil");
            break;
        case 4:
            let opts = {
                reply_markup: {
                    one_time_keyboard: true,
                    resize_keyboard: true,
                    keyboard: [
                        ['Feed']
                    ]
                }
            };
            bot.sendMessage(chatId, "Great, you awake the poor koala, you monster", opts);
            let photo = __dirname + '/angry_koala.jpg'
            bot.sendPhoto(chatId, photo, {
                caption: "Angry Koala is Angry!!"
            });
            break;
        default:
            bot.sendMessage(chatId, "You really should stop poking koalas");
    }
});

bot.onText(/feed/i, function(msg) {
    let chatId = msg.chat.id;
    pokeCount[chatId] = 0;
    let opts = {
        caption: "Koala happy, Koala sleepy",
        reply_markup: JSON.stringify({
            keyboard: [
                ['Poke']
            ],
            resize_keyboard: true
        })
    };

    let photo = __dirname + '/sleepy_koala.jpg'
    bot.sendPhoto(chatId, photo, opts);
});

bot.on('message', function(msg) {
    let chatId = msg.chat.id;
    console.log(chatId + ": " + JSON.stringify(msg));
});

//FILE EXAMPLE
/*if(typeof(msg.document) !== 'undefined'){
  let fileId = msg.document.file_id;
  let mimeType = msg.document.mime_type;
  if(utils.matchesTorrent(mimeType)){
    bot.downloadFile(fileId, "tmp");
    bot.sendMessage(chatId, "Just received "+msg.document.file_name+". Should I start downloading it?");
  } else {
    bot.sendMessage(chatId, "File: \""+msg.document.file_name+"\" is not a torrent file or a magnet link.");
  }
} else {
  bot.sendMessage(chatId, "Waiting for a torrent or a magnet link.");
}*/
