import { MessageEmbed, Message } from "discord.js";
import { someRole, findRole, datedErr } from "../exports/functionExports.js";
import { defaultPrefix as prefix, developer } from "../exports/configExports.js";

import "../prototypes/tempSend.js";
import "../prototypes/tempReply.js";

/**
 * 
 * @param {Message} message 
 * @param {string} args 
 * @param {string} command 
 * @returns {void}
 */

export default async function (message, args, command) {
    const tsEmbed = new MessageEmbed();
    if (//if the guild has the Stick Controller, Stick Holder, and Stick Listener roles
        someRole(message.guild, "Stick Controller") &&
        someRole(message.guild, "Stick Holder") &&
        someRole(message.guild, "Stick Listener")
    ) {
        if (//if message author is in Stick Controller group, an admin, or the developer for prod debugging reasons
            someRole(message.member, "Stick Controller") ||
            message.member.permissions.has(8) ||
            message.member.id == developer.id
        ) {
            if (message.member.voice.channel && args == "voice") {//if  the user is in a voice channel and also passed the "voice" argument
                message.member.roles.add(findRole(message.guild, "Stick Holder")).catch(() =>
                    datedErr("Could not add Stick holder to", `${message.author.tag} (${message.author.id}) in ${message.guild.name}`)
                ); //Add message author to Stick Holder

                message.member.voice.channel.updateOverwrite(findRole(message.guild, "Stick Holder"), { SPEAK: true }).catch((err) => {
                    datedErr(`Error in updateOverwrite for role Stick Holder in ${message.guild.name}:`,err);
                    message.tempSend("The bot has encountered a problem. Please contact the developer by DMing the bot.").catch(datedErr);
                }); //Add Stick Holder permissions to the channel
                
                message.member.voice.channel.updateOverwrite(message.guild.roles.everyone, { SPEAK: false }).catch((e) =>
                    datedErr("Error in tsjoin: voice: updateOverwrite @everyone:", e)
                ); //Disable @everyones' ability to speak. This prevents users joining from being able to speak for a moment before the bot mutes them
                
                tsEmbed //create the tsEmbed
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .setColor("GREEN")
                    .setTitle("Talking Stick:")
                    .addField(`${message.member.displayName} has the Talking Stick!`, `Currently in ${message.member.voice.channel.name}`)
                    .setFooter(`To pass the Talking Stick, use ${prefix}tspass <ping a user in the same channel as you>`);

                for (const [_, member] of message.member.voice.channel.members) { //mute everyone in the channel except for the member who called ts
                    if (member != message.member) {
                        member.voice.setMute(true).catch((e) => {
                            datedErr(`Unable to mute voice in ${message.guild.name}:`,e);
                            message.tempReply(`**Unable to mute members in ${message.member.voice.channel.name}, please report this by DMing the bot.**`).catch(datedErr);
                        });
                        member.roles.add(findRole(member.guild, "Stick Listener")).catch((e) => {
                            datedErr(`Unable to update role for ${member.user.tag} (${member.id}):`,e)
                            message.tempReply(`**Unable to update role for ${member.user.tag}. Please DM the bot about this incident. A possible solution is to move the Talking Stick role above all others under Server Settings > Roles and by ensuring that the Talking Stick role has the Manage Roles permission.**`).catch(datedErr);
                        });
                    }
                }
                
                message.channel.send(tsEmbed).catch(datedErr); //send the embed

            } else if (args?.toLowerCase() == "text") {//if the user passed the argument "text"
                message.guild.roles.cache.array().forEach((r) => {
                    if(!["muted", "timeout"].includes(r.name.toLowerCase())) message.channel.updateOverwrite(r, { SEND_MESSAGES: false }).catch((e) =>
                        datedErr(`Could not update permissions for ${r.name} in ${message.channel.name} in ${message.guild.name} requested by ${message.author.tag} (${message.member.id}) :`, e)
                    );
                    
                });

                message.channel.updateOverwrite(findRole(message.guild, "Talking Stick"), { SEND_MESSAGES: true }).catch(datedErr);
                message.member.roles.add(findRole(message.guild, "Stick Holder")).catch(datedErr);
                message.channel.updateOverwrite(findRole(message.guild, "Stick Holder"), {SEND_MESSAGES: true}).catch(datedErr);
                message.channel.updateOverwrite(message.guild.roles.everyone, {SEND_MESSAGES: false}).catch(datedErr);
                    
                tsEmbed
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .setColor("GREEN")
                    .setTitle("Talking Stick:")
                    .addField(`${message.member.displayName} has the talking stick!`, `Currently in ${message.channel.name}`)
                    .setFooter(`To pass the Talking Stick, use ${prefix}tspass <ping a user>`);

                message.channel.send(tsEmbed).catch((e) =>
                    datedErr(e, `\nStill could not send tsEmbed in ${message.channel.name} in ${message.guild.name}, requested by ${message.author.tag} (${message.author.id}), even after attempting to override.`)
                );
            }
            
            else if(!args) message.tempReply(`You must supply one argument. If you are in a voice channel, use \`${prefix}tsjoin voice\`. If you are in a text channel, use \`${prefix}tsjoin text\`.`);
            else if(!message.member.voice.channel && args == "voice") message.tempReply("You need to join a voice channel first!");
            else if(args) message.tempReply(`"\`${args}\`" is not a valid option for ${prefix}${command}`); 
        } else message.tempReply("You do not have permission to do this."); 
    } else message.tempReply(`Please run \`${prefix}tsinit\` to create the required roles`);
}
 