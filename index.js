const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({ disableEveryone: true });
const db = require("quick.db");
const dotenv = require('dotenv');
dotenv.config();

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();


fs.readdir("./commands/", (err, files) => {

    if (err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
        console.log("Couldn't find commands.");
        return;
    }


    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);
        props.help.aliases.forEach(alias => {
            bot.aliases.set(alias, props.help.name);

        });
    });
})
bot.on("ready", async() => {
    console.log(`${bot.user.username} is online on ${bot.guilds.cache.size} servers!`);

    const statusList = [
        { msg: "Minecraft: Bedrock Edition", type: "PLAYING" },
        { msg: "Type vc! help for help", type: "WATCHING" }
    ];

    setInterval(async() => {
        const index = Math.floor(Math.random() * statusList.length + 1) - 1;
        await bot.user.setActivity(statusList[index].msg, {
            type: statusList[index].type
        });
    }, 60000);

    bot.user.setStatus('online');

    bot.on("message", async message => {
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;
        let prefix = process.env.PREFIX;
        let messageArray = message.content.split(" ");
        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let cmd = args.shift().toLowerCase();
        let commandfile;

        if (bot.commands.has(cmd)) {
            commandfile = bot.commands.get(cmd);
        } else if (bot.aliases.has(cmd)) {
            commandfile = bot.commands.get(bot.aliases.get(cmd));
        }

        if (!message.content.toLowerCase().startsWith(prefix)) return;


        try {
            commandfile.run(bot, message, args);

        } catch (e) {}
    })
})

bot.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.member.user.bot) return;
    inChannel(oldState, newState);

    let join = db.get(`joined_${oldState.guild.id}_${oldState.member.user.id}`);
    let left = db.get(`left_${newState.guild.id}_${newState.member.user.id}`);

    if (left - join > 0) {
        if (db.get(`totalSec_${newState.guild.id}_${newState.member.user.id}`) == null) {
            db.set(`totalSec_${newState.guild.id}_${newState.member.user.id}`, Math.floor((left - join)));
        } else {
            db.add(`totalSec_${newState.guild.id}_${newState.member.user.id}`, Math.floor((left - join)));
        }
        //console.log(db.get(`totalSec_${newState.guild.id}_${newState.member.user.id}`));
    }

});

function inChannel(oldState, newState) {
    if (newState.channelID === null) {
        //console.log('user left channel', oldState.channelID);
        db.set(`left_${newState.guild.id}_${newState.member.user.id}`, new Date().getTime() / 1000);
        //console.timeEnd('channel')
    } else if (oldState.channelID === null) {
        //console.log('user joined channel', newState.channelID);
        db.set(`joined_${oldState.guild.id}_${oldState.member.user.id}`, new Date().getTime() / 1000);
        //console.time('channel')
    } else {
        console.log('user moved channels', oldState.channelID, newState.channelID);
    }
}

bot.login(process.env.DISCORD_TOKEN);