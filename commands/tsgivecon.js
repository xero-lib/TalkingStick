import { MessageEmbed, Message } from "discord.js"
import { findRole, datedErr } from "../exports/functionExports.js";
import { defaultPrefix, developer } from "../exports/configExports.js";

import "../prototypes/tempSend.js";
import "../prototypes/tempReply.js";

/**
 * @param {Message} message
 * @returns {void}
 */

export default async function tsgivecon(message) {
    if(message.member.hasPermission(8) || message.member.id == developer.id) {
        const tsgiveconEmbed = new MessageEmbed();
        
        if (findRole(message.guild, "Stick Controller")) {
            if (message.mentions.members.first()) {
                tsgiveconEmbed
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .setColor("GREEN")
                    .setTitle(`TSGiveCon executed by ${message.author.tag}`);
                message.mentions.members.first().roles.add(findRole(message.guild, "Stick Controller"))
                    .then(() => {
                        tsgiveconEmbed.addField("TSGiveCon:", `${message.mentions.members.first().user.tag} has been given Stick Controller`)
                        message.channel.send(tsgiveconEmbed).catch(datedErr);
                    })
                    .catch((e) => {
                        datedErr("Error in tsgivecon:", e);
                        message.tempReply("In order for Talking Stick to work properly, you must drag the \`Talking Stick\` role to the top of the list in server settings.").catch(datedErr);
                    });
            } else message.tempReply("**You must mention someone to give Stick Controller.**").catch(datedErr);
        } else message.tempReply(`Please run \`${defaultPrefix}tsinit\` to create all required roles.`).catch(datedErr);
    } else message.tempReply("You do not have permission to do this.").catch(datedErr);
}