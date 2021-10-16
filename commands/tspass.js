import { MessageEmbed, Message } from "discord.js";
import { datedErr } from "../exports/functionExports.js";
import { defaultPrefix as prefix, developer } from "../exports/configExports.js";
import { findRole, someRole, hasRoles } from "../exports/functionExports.js";

import "../prototypes/tempSend.js";
import "../prototypes/tempReply.js";

/**
 * @param {Message} message 
 * @param {string} args 
 */

export default async function (message, args) {
    if(hasRoles(message.guild)) {
        if(
            someRole(message.member, "Stick Controller") ||
            someRole(message.member, "Stick Holder") ||
            message.member.permissions.has(8) ||
            message.member.id === developer.id
        ) {
            const tspassEmbed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL())
                .setColor("GREEN");
            if(args == "voice") { //ignore the pyramid of death, I'll be implementing SCE in the next commit
                if(message.mentions.members?.first()) {
                    let mmmFirst = message.mentions.members.first();
                    if(mmmFirst.voice.channelID && mmmFirst.voice.channelID === message.member.voice.channelID) {
                        mmmFirst.voice.setMute(false).catch(datedErr);
                        if(message.member.id != mmmFirst.id) {
                            message.member.voice.setMute(true).catch((e) => 
                                datedErr("TSPass Error in message.member.voice.setMute:", e)
                            );
                            message.member.roles.add(findRole(message.guild, "Stick Listener")).catch((e) => 
                                datedErr("TSPass Error in message.member.roles.add:", e)
                            );
                            message.member.roles.remove(findRole(message.guild, "Stick Holder")).catch((e) => {
                                datedErr("TSPass Error in message.member.roles.remove:", e);
                                message.tempReply("In order for Talking Stick to work properly, you must drag the \`Talking Stick\` role to the top of the list in server settings.").catch(datedErr);
                            });
                        }

                        mmmFirst.roles.add(findRole(message.guild, "Stick Holder")).catch(datedErr);
                        tspassEmbed.addField("TSPass", `Passed stick to ${mmmFirst.displayName} in ${mmmFirst.voice.channel.name}`);
                        message.channel.send(tspassEmbed).catch(datedErr);
                    } else if(!mmmFirst.voice.channelID && !message.member.voice.channelID) {
                        mmmFirst.roles.add(findRole(message.guild, "Stick Holder"))
                            .then(() => tspassEmbed.addField("TSPass", `Passed stick to ${mmmFirst.user.tag} in ${message.channel.name}`))
                            .catch((e) => datedErr("Error in tspass:", e));
                        message.member.roles.remove(findRole(message.guild, "Stick Holder")).catch(datedErr);
                        message.channel.send(tspassEmbed).catch(datedErr);
                    } else if(mmmFirst.voice.channelID && mmmFirst.voice.channelID != message.member.voice.channelID)
                        tspassEmbed.addField("TSPass", `**${mmmFirst.displayName} is not in ${message.member.voice.channel.name}.**`);
                }
            } else if(args == "text") {
                if(message.mentions.members.first()) {
                    let mmmFirst = message.mentions.members.first();
                    message.member.roles.remove(findRole(message.guild, "Stick Holder")).catch((err) => {
                        datedErr("TSPass Error in message.member.roles.remove:",err);
                        message.tempReply("In order for Talking Stick to work properly, you must drag the \`Talking Stick\` role to the top of the list in server settings.");
                    });

                    mmmFirst.roles.add(findRole(message.guild, "Stick Holder")).then(() => 
                        tspassEmbed.addField("TSPass", `Passed stick to ${mmmFirst.displayName} in ${message.channel.name}`)
                    ).catch((e) => datedErr(`Unable to add stick holder to ${message.author.tag}:`,e));
                        
                    message.member.roles.remove(findRole(message.guild, "Stick Holder")).catch(datedErr);
                    message.channel.send(tspassEmbed).catch(datedErr);
                }
            } else message.tempReply("**This command takes two arguments: `voice` or `text` and <ping a user>**").catch(datedErr);
        } else message.tempReply("You do not have permission to do this.").catch(datedErr);
    } else message.tempReply(`You must run \`${prefix}tsinit\` to initialize all required roles for Talking Stick to work properly.`).catch(datedErr);
}
