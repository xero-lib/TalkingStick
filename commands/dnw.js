import chalk from "chalk"; //have to import like this due to chalk being done entirely in module.exports
import { MessageEmbed, Message } from "discord.js";
import { developer } from "../exports/configExports.js";
import { datedErr } from "../exports/functionExports.js";

import "../prototypes/tempReply.js";

/**
 * @param {Message} message 
 */

export default async function (message) {
    const dnwEmbed = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setDescription(message.content)
        .setFooter(message.createdTimestamp);

    developer.send(dnwEmbed).catch((e) => datedErr('\n' + message.author.tag + '\n' + chalk.bold(message.content) + '\n' + e));

    message.delete().catch(() => datedErr("Message already deleted."));
    message.tempReply("Message sent. Please also send a DM with a server invite and a screenshot/description of any problems you're having to the bot. The developer will be with you as soon as possible.").catch(datedErr);
}
