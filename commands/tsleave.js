import { MessageEmbed, Message } from "discord.js";
import { defaultPrefix as prefix } from "../exports/configExports.js";
import { someRole, findRole, datedErr } from "../exports/functionExports.js";

import "../prototypes/tempSend.js";
import "../prototypes/tempReply.js";

/**
 * @param {Message} message 
 * @param {string} args 
 * @returns {void}
 */

export default async function (message, args) {
    const tsLeaveEmbed = new MessageEmbed();
    if ((someRole(message.member, "Stick Controller") || message.member.hasPermission(8))) {
        if (someRole(message.guild, "Stick Holder")) {
            if (!args)
                message.tempReply(`You must supply one argument. If you are in a voice channel, use \`${prefix}tsleave voice\`. If you are in a text channel, use \`${prefix}tsleave text.\``);
            else if (!["text", "voice"].includes(args))
                message.tempReply(`${args} is not understood with ${message.content.split("//")[1].split(" ")[0]}`);
        
            if (message.member.voice.channel && args?.toLowerCase() === "voice") {
                for (const [_, member] of message.guild.members.cache) 
                    if (member.voice.channelID && member.voice.channelID === message.member.voice.channelID) {
                        member.voice.setMute(false).catch(datedErr);
                        member.roles.remove(findRole(message.guild, "Stick Holder")).catch(datedErr);
                        member.roles.remove(findRole(message.guild, "Stick Listener")).catch(datedErr);
                    }
                    
                tsLeaveEmbed.setAuthor(message.author.username, message.author.avatarURL())
                    .setColor("GREEN")
                    .setTitle("Talking Stick:")
                    .addField(`${message.member.displayName} removed the Talking Stick.\n\tYou may now talk freely.`, `Removed from ${message.member.voice.channel.name}`);

                message.member.voice.channel.updateOverwrite(findRole(message.guild, "Stick Holder"), { SPE: null }).catch(datedErr);
                message.member.voice.channel.updateOverwrite(message.guild.roles.everyone, { SPEAK: null }).catch(datedErr);
                message.channel.send(tsLeaveEmbed).catch(datedErr);
            } else if (args?.toLowerCase() === "text") {
                message.guild.roles.cache.array().forEach((r) => {
                    if(r.name?.toLowerCase() !== "muted")
                        message.channel.updateOverwrite(r, { SEND_MESSAGES: null }).catch((e) => 
                            datedErr(`Could not update permissions for ${r.name} for ${message.channel.name} in ${message.guild.name} requested by ${message.author.tag} (${message.member.id}) :`, e)
                        );
                });
                
                message.channel.updateOverwrite(findRole(message.guild, "Stick Holder"), { SEND_MESSAGES: null }).catch(datedErr);
                message.channel.updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: null }).catch(datedErr);
                for (const [_, member] of message.guild.members.cache) {
                    if(!member.voice.channelID && someRole(member, "Stick Holder")) {
                        member.roles.remove(findRole(message.guild, "Stick Holder")).catch(console.err);
                    }
                }
                
                tsLeaveEmbed
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .setColor("GREEN")
                    .setTitle("Talking Stick")
                    .addField(`${message.member.displayName} removed the Talking Stick.\nYou may now type freely.`, `Removed from ${message.channel.name}`);

                message.channel.send(tsLeaveEmbed).catch(datedErr);
            }
        } else message.tempReply(`Please run \`${prefix}tsinit\` to create all requried roles.`).catch(datedErr);
    } else message.tempReply("You do not have permission to do this.").catch(datedErr);
}