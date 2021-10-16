import { Message } from "discord.js";
import { developer, } from "../exports/configExports.js";
import { someRole, findRole, hasRoles, date, datedErr } from "../exports/functionExports.js";

import "../prototypes/tempReply.js";

/**
 * @param {Message} message
 * @returns {void}
 */

export default async function (message) {
    if(hasRoles(message.member)) {
        if (
            message.member.hasPermission(8) ||
            someRole(message.member, "Stick Controller") ||
            message.member.id == developer.id
        ) {
            if (message.mentions.members.first()) {
                if (message.member.voice.channelID && !message.mentions.members.first().voice.channelID) /*if the executor is in a voice channel but the mentioned member is not */ message.tempReply(`${message.mentions.members.first().name} is not in your voice channel.`).catch(datedErr);
                else if (message.member.voice.channel && message.mentions.members.first().voice.channelID == message.member.voice.channelID) {
                    message.mentions.members.first().roles.add(findRole(message.guild, "Stick Holder")).catch((err) =>
                        datedErr(`Could not add the Stick Holder role to ${message.mentions.members.first().user.tag} (${message.mentions.members.first().id}) by ${message.member.user.tag} (${message.member.id}) in ${message.guild.name}:`, err));
                    message.mentions.members.first().voice.setMute(false).catch((err) =>
                        datedErr(`Could not unmute ${message.mentions.members.first().user.tag} (${message.mentions.members.first().id}) by ${message.member.user.tag} (${message.member.id}) in ${message.guild.name}:`, err));
                } /*todo*/ // else if (!message.member.voice.channelID && !message.mentions.members.first().voice.channelID) 
            } else /*implement SCE */ message.tempReply("You must mention a user to add a stick to.").catch(datedErr);
        } else message.tempReply("You do not have permission to do this.").catch(datedErr);
    } else message.tempReply(`Please run \`${prefix}tsinit\` to create all required roles.`).catch(datedErr);
}