import '../prototypes/tempReply.js';
import { someRole, findRole, guildHasRoles, date } from '../coagulators/functionCoagulator.js';
import { developer } from '../coagulators/configCoagulator.js';

export default async function (message) {
    if(guildHasRoles(message)) {
        if(message.member.hasPermission(8) || someRole(message.member, 'Stick Controller') || message.member.id == developer.id) {
            if(message.mentions.members.first()){
                if(!message.mentions.members.first().voice.channelID) {
                    message.tempReply(`${message.mentions.members.first().name} is not in a voice channel.`);
                }
                if(message.member.voice.channel) {
                    if(message.mentions.members.first().voice.channelID == message.member.voice.channelID) {
                        message.mentions.members.first().roles.add(findRole(message.guild, 'Stick Holder'))
                            .then(() => console.log(date(),`Successfully added the Stick Holder role to ${message.mentions.members.first().username}#${message.mentions.members.first().discriminator} (${message.mentions.members.first().id}) by ${message.member.user.username}#${message.member.user.discriminator} (${message.member.id}) in ${message.guild.name}`))
                            .catch(err => console.error(date(),`Could not add the Stick Holder role to ${message.mentions.members.first().username}#${message.mentions.members.first().discriminator} (${message.mentions.members.first().id}) by ${message.member.user.username}#${message.member.user.discriminator} (${message.member.id}) in ${message.guild.name}:`, err));
                        message.mentions.members.first().voice.setMute(false)
                            .then(() => console.log(date(),`Successfully unmuted ${message.mentions.members.first()}#${message.mentions.members.first().discriminator} (${message.mentions.members.first().id}) by ${message.member.user.username}#${message.member.user.discriminator} (${message.member.id}) in ${message.guild.name}`))
                            .catch(err => console.error(date(),`Could not unmute ${message.mentions.members.first().username}#${message.mentions.members.first().discriminator} (${message.mentions.members.first().id}) by ${message.member.user.username}#${message.member.user.discriminator} (${message.member.id}) in ${message.guild.name}:`, err));
                    }
                    else {
                        message.tempReply(`${message.mentions.members.first().name} is not in your voice channel.`);
                    }
                }
            } 
            else {
                message.tempReply('You must mention a user to pass the stick to.');
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