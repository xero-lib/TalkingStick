import '../prototypes/tempSend.js';
import '../prototypes/tempReply.js';
import {developer, defaultPrefix as prefix, Discord} from '../coagulators/configCoagulator.js';
import { guildHasRoles, findRole, someRole } from '../coagulators/functionCoagulator.js';

export default async function (message) {
    if(guildHasRoles(message)) {
        if(someRole(message.guild, 'Stick Holder' || message.member.hasPermission(8) || someRole(message.member, 'Stick Controller') || message.member.id === developer.id)) {
            const tsremstickEmbed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL())
                .setColor('RED');
            if(message.mentions.users.first()){
                if(message.member.voice.channelID && message.member.voice.channelID != message.mentions.members.first().voice.channelID) {
                    tsremstickEmbed.addField('TSRemStick', `${message.mentions.members.first().name} is not in the voice channel.`);
                }
                else if (!message.member.voice.channelID && !message.mentions.members.first().voice.channelID) {
                    if(someRole(message.mentions.members.first(), 'Stick Holder')) {
                        message.mentions.members.first().roles.remove(findRole(message.mentions.members.first(), 'Stick Holder')).catch(console.error);
                    }
                    else {
                        tsremstickEmbed.addField('TSRemStick', `${message.mentions.members.first().username} is not a Stick Holder`);
                        await message.tempSend(tsremstickEmbed);
                        return;
                    }
                }
                if(message.mentions.members.first().voice.channelID == message.member.voice.channelID) {
                    message.mentions.members.first().roles.remove(findRole(message.guild, 'Stick Holder')).catch(console.error);
                    message.mentions.members.first().voice.setMute(true).catch(console.error);
                } 
                else if(someRole(message.mentions.members.first(), 'Stick Holder')){
                    message.mentions.members.first().roles.remove(findRole(message.mentions.members.first(), 'Stick Holder'))
                        .catch(err => {
                            message.tempSend('In order for Talking Stick to work properly, you must drag the \`Talking Stick\` role to the top of the list in server settings.');
                        });
                    tsremstickEmbed.addField(`Took stick from ${message.mentions.members.first().username}`);
                    message.tempSend(tsremstickEmbed);
                }
            }
        }
        else {
            message.tempReply('You do not have permission to do this.');
        }
    }
    else {
        message.tempReply(`Please run \`${prefix}tsinit\` to create all required roles.`);
    }
}