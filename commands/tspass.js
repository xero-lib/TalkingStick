import '../prototypes/tempReply.js';
import '../prototypes/tempSend.js';
import Discord from 'discord.js';
import { findRole, someRole, guildHasRoles } from '../coagulators/functionCoagulator.js';
import { client, defaultPrefix as prefix, developer } from '../coagulators/configCoagulator.js';
import { date } from '../coagulators/functionCoagulator.js';

export default async function (message, args) {
    if(guildHasRoles(message.guild)) {
        if(someRole(message.member, 'Stick Controller') || someRole(message.member, 'Stick Holder') ||  message.member.permissions.has(8) || message.member.id === developer.id) {
            const tspassEmbed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL())
                .setColor('GREEN');
            if(args == 'voice') {
                if(message.mentions.members.first()) {
                    if(message.mentions.members.first().voice.channelID && message.mentions.members.first().voice.channelID == message.member.voice.channelID) {
                        message.mentions.members.first().voice.setMute(false).catch(console.error);
                        if(message.member.id != message.mentions.members.first().id) {
                            message.member.voice.setMute(true).catch(err => {
                                console.error(date(),'TSPass Error in message.member.voice.setMute:',err);
                            });
                            message.member.roles.add(findRole(message.guild, 'Stick Listener')).catch(err => {
                                console.error(date(),'TSPass Error in message.member.roles.add:',err);
                            });
                            message.member.roles.remove(findRole(message.guild, 'Stick Holder')).catch(err => {
                                console.error(date(),'TSPass Error in message.member.roles.remove:',err);
                                message.tempReply('In order for Talking Stick to work properly, you must drag the \`Talking Stick\` role to the top of the list in server settings.');
                            });
                        }
                        message.mentions.members.first().roles.add(findRole(message.guild, 'Stick Holder')).catch(console.error);
                        tspassEmbed.addField('TSPass', `Passed stick to ${message.mentions.members.first().displayName} in ${message.mentions.members.first().voice.channel.name}`);
                        message.tempSend(tspassEmbed);
                    } 
                    else if(!message.mentions.members.first().voice.channelID && !message.member.voice.channelID) {
                        message.mentions.members.first().roles.add(findRole(message.guild, 'Stick Holder'))
                            .then(() => tspassEmbed.addField('TSPass', `Passed stick to ${message.mentions.members.first()} in ${message.channel.name}`))
                            .catch(e => console.error(date(),'Error in tspass:',e));
                        message.member.roles.remove(findRole(message.guild, 'Stick Holder')).catch(console.error);
                        message.tempSend(tspassEmbed);
                    }
                    else if(message.mentions.members.first().voice.channelID && message.mentions.members.first().voice.channelID != message.member.voice.channelID) {
                        tspassEmbed.addField('TSPass', `**${message.mentions.members.first().displayName} is not in ${message.member.voice.channel.name}.**`);
                    }
                    // } else if(message.guild.members.cache.has(args)) { 
                    //     member = message.guild.members.cache.get(args);
                    //     member.roles.add(findeRole(message.guild, 'Stick Holder')).catch(console.error);
                    }
                } 
                else if(args == 'text') {
                    if(message.mentions.members.first()) {
                        message.member.roles.remove(findRole(message.guild, 'Stick Holder'))
                            .catch(err => {
                                console.error(date(),'TSPass Error in message.member.roles.remove:',err);
                                message.tempReply('In order for Talking Stick to work properly, you must drag the \`Talking Stick\` role to the top of the list in server settings.');
                            });
                        message.mentions.members.first().roles.add(findRole(message.guild, 'Stick Holder')).catch(console.error);
                        tspassEmbed.addField('TSPass', `Passed stick to ${message.mentions.members.first().displayName} in ${message.channel.name}`);

                        message.mentions.members.first().roles.add(findRole(message.guild, 'Stick Holder'))
                            .then(() => {
                                tspassEmbed.addField('TSPass', `Passed stick to ${message.mentions.members.first().displayName} in ${message.channel.name}`)
                            })
                            .catch(e => console.error(date(),`Unable to add stick holder to ${message.author.tag}:`,e));
                            
                        message.member.roles.remove(findRole(message.guild, 'Stick Holder')).catch(console.error);
                        message.tempSend(tspassEmbed);
                    }       
                            // } else if(message.guild.members.cache.has(args)) { 
                            //     member = message.guild.members.cache.get(args);
                            //     member.roles.add(findeRole(message.guild, 'Stick Holder')).catch(console.error);
                        
                    }
                    else {
                        message.tempReply('**This command takes two arguments: `voice` or `text` and <ping a user>**');
                    }
        } else {
            message.tempReply('You do not have permission to do this.');
        }
    } else {
        message.tempReply(`You must run \`${prefix}tsinit\` to initialize all required roles for Talking Stick to work properly.`);
    }
}