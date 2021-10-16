import { MessageEmbed, Message } from "discord.js";
import { developer, defaultPrefix as prefix } from "../exports/configExports.js";
import { hasRoles, findRole, someRole, datedErr } from "../exports/functionExports.js";

import "../prototypes/tempSend.js";
import "../prototypes/tempReply.js";

/**
 * @param {Message} message 
 */

export default async function (message) {
    if (hasRoles(message.guild) && hasRoles(message.member)) {
        if (
            someRole(message.guild, "Stick Holder" ||
            message.member.hasPermission(8) ||
            someRole(message.member, "Stick Controller") ||
            message.member.id === developer.id)
        ) {
            const tsremstickEmbed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL())
                .setColor("RED");
            if (message.mentions.users.first()) {
                if (message.member.voice.channelID && message.member.voice.channelID !== message.mentions.members.first().voice.channelID)
                    tsremstickEmbed.addField("TSRemStick", `${message.mentions.members.first().name} is not in the voice channel.`);
                else if (!message.member.voice.channelID && !message.mentions.members.first().voice.channelID) {
                    if (someRole(message.mentions.members.first(), "Stick Holder"))
                        message.mentions.members.first().roles.remove(findRole(message.mentions.members.first(), "Stick Holder")).catch(datedErr);
                    else {
                        tsremstickEmbed.addField("TSRemStick", `${message.mentions.members.first().username} is not a Stick Holder`);
                        message.channel.send(tsremstickEmbed).catch(datedErr);
                    }
                }
                const mmmFirst = message.mentions.members.first();
                if (mmmFirst.voice.channelID === message.member.voice.channelID) {
                    mmmFirst.roles.remove(findRole(message.guild, "Stick Holder")).catch(datedErr);
                    mmmFirst.voice.setMute(true).catch(datedErr);
                } else if (someRole(message.mentions.members.first(), "Stick Holder")) {
                    message.mentions.members.first().roles.remove(findRole(message.mentions.members.first(), "Stick Holder")).catch(() =>
                        message.tempSend("In order for Talking Stick to work properly, you must drag the \`Talking Stick\` role to the top of the list in server settings.").catch(datedErr)
                    );
                    tsremstickEmbed.addField(`Took stick from ${message.mentions.members.first().username}`);
                    message.channel.send(tsremstickEmbed).catch(datedErr);
                }
            }
        } else message.tempReply("You do not have permission to do this.").catch(datedErr);
    } else message.tempReply(`Please run \`${prefix}tsinit\` to create all required roles.`).catch(datedErr);
}
