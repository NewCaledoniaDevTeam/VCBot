const Discord = require('discord.js')
const db = require('quick.db')

module.exports.run = async(bot, message, args) => {
    if (!message.content.startsWith(process.env.PREFIX)) return;

    let embed = new Discord.MessageEmbed()
        .setTitle("Help [Prefix " + process.env.PREFIX + "]")
        .addField("VC Commands", "`level` \n `leaderboard`")
        .setColor("#3d728d")
    message.channel.send(embed)

}

module.exports.help = {
    name: "help",
    aliases: [""]
}