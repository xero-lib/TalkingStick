import { Message, MessageEmbed } from "discord.js";
import { datedErr } from "../exports/functionExports.js";
import { defaultPrefix as prefix, client, developer } from "../exports/configExports.js";

import "../prototypes/tempReply.js";

/**
 * @param {Message} message 
 * @param {string} args 
 * @param {string} command 
 * @returns {void}
 */

export default async function (message, args, command) {
    let msgSend = message.content.substring(`${prefix+command} ${args}`.length);
    let sentUser = client.users.cache.get(args);
    const sendMessageEmbed = new MessageEmbed()
        .setAuthor(`${message.author.tag}`, message.author.avatarURL())
        .setDescription(msgSend);
    
    if (sentUser) {
        sentUser.send(sendMessageEmbed).then(() => {
            sendMessageEmbed
                .setAuthor(`From ${message.author.tag} to ${sentUser.tag} (${sentUser.id})`, developer.avatarURL())
                .setTitle(`Sent to ${sentUser.tag} (${sentUser.id})`)
                .setThumbnail(sentUser.avatarURL());
            message.tempReply(`Successfully sent message to ${sentUser.tag} (${args})`).catch(datedErr);
            developer.send(sendMessageEmbed).catch(datedErr);
        }).catch((e) => {
            datedErr(`There was an error sending the message to ${sentUser.tag} (${args})\n` + e);
            message.reply(`There was an error sending the message to ${sentUser.tag} (${args})\n \`\`\`\n${e}\n\`\`\``).catch(datedErr);
        });
    } else {
        datedErr(`Could not send message to ${args} as they are most likely not in the cache.`);
        message.tempReply(`Unable to send message to ${args}`).catch((e) => datedErr(`Unable to alert ${message.author.tag} of sendMessage error: `, e));
    }
}
