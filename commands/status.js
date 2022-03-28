import { MessageEmbed, Message } from "discord.js";
import { date, datedErr } from "../exports/functionExports.js";
import { developer, botPfp, client } from "../exports/configExports.js";

import "../prototypes/tempSend.js";

/**
 * @param {Message} message 
 * @returns {void}
 */

export default async function (message) {
    if (message.author.id == developer.id) {
        let memberCount = 0;
        client.guilds.cache.forEach((guild) => memberCount += guild.memberCount);
        const statusEmbed = new MessageEmbed()
            .setAuthor("Talking Stick", botPfp)
            .setTitle("**STATUS**")
            .addField("Online Status", "Online")
            .addField("Server Count", client.guilds.cache.array().length)
            .addField("User Count", memberCount)
            .addField("Uptime", (`${client.uptime/1000/60} minutes`));

        message.tempSend(statusEmbed).catch(datedErr);
        console.log(date(),`Server Count: ${client.guilds.cache.array().length}\nUser Count: ${client.users.cache.array().length}\nUptime: ${client.uptime}`);
    }
}