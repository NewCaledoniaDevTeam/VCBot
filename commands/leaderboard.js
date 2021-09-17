const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async(bot, message, args) => {
    if (!message.content.startsWith(process.env.PREFIX)) return;

    let timefetch = db.startsWith(`totalSec_${message.guild.id}`, { sort: '.data' });

    let content = "";

    for (let i = 0; i < timefetch.length; i++) {
        let userID = timefetch[i].ID.split('_')[2]
        let user = "<@" + userID + ">"

        content += `${i+1}. ${user} - \`${secondsToTime(timefetch[i].data)["h"]}:${secondsToTime(timefetch[i].data)["m"]}:${secondsToTime(timefetch[i].data)["s"]}\` - Total: \`${minTwoDigits(timefetch[i].data)}\`\n`

    }

    const embed = new Discord.MessageEmbed()
        .setDescription(`**${message.guild.name}'s VC Leaderboard**\n\n${content}`)
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
    name: "leaderboard",
    aliases: [""]
}