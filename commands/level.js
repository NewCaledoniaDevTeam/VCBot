const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async(bot, message, args) => {
    if (!message.content.startsWith(process.env.PREFIX)) return;

    let user = message.mentions.members.first() || message.author;

    let timefetch = db.get(`totalSec_${message.guild.id}_${user.id}`);

    if (timefetch == null) timefetch = '0';

    secondsToTime(timefetch);

    const embed = new Discord.MessageEmbed()
        .setDescription(`${user}, you been in Voice Channels in \`${message.guild.name}\` for \`${secondsToTime(timefetch)["h"]}:${secondsToTime(timefetch)["m"]}:${secondsToTime(timefetch)["s"]}\` - Total: \`${minTwoDigits(timefetch)}\``)
        .setColor("#3d728d")

    message.channel.send(embed)

}

function secondsToTime(secs) {
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    var obj = {
        "h": minTwoDigits(hours),
        "m": minTwoDigits(minutes),
        "s": minTwoDigits(seconds)
    };
    return obj;
}

function minTwoDigits(n) {
    return (n < 10 ? '0' : '') + n;
}

module.exports.help = {
    name: "level",
    aliases: [""]
}