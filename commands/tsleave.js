import '../prototypes/tempReply.js';
import '../prototypes/tempSend.js';
import Discord from 'discord.js';
import { defaultPrefix as prefix } from '../coagulators/configCoagulator.js';
import { someRole, findRole } from '../coagulators/functionCoagulator.js';

export default async function (message, args, command) {
    console.log('entered')
    const tsLeaveEmbed = new Discord.MessageEmbed();
    if ((someRole(message.member, 'Stick Controller') || message.member.hasPermission(8))) {
        console.log('entered2')
        if(someRole(message.guild, 'Stick Holder')) {    
            if(!args) {
                message.tempReply(`You must supply one argument. If you are in a voice channel, use \`${prefix}tsleave voice\`. If you are in a text channel, use \`${prefix}tsleave text.\``);
            }
            else if (args !== 'text' && args !== 'voice') {
                message.tempReply(`${args} is not understood with ${command}`);
            }
            
            if (message.member.voice.channel && args == "voice") {
                console.log('entered3')
                for (const [_, member] of message.guild.members.cache) {
                    if(member.voice.channelID && member.voice.channelID == message.member.voice.channelID) {
                        member.voice.setMute(false).catch(console.error);
                        member.roles.remove(findRole(message.guild, 'Stick Holder')).catch(console.error);
                        member.roles.remove(findRole(message.guild, 'Stick Listener')).catch(console.error);
                    }
                }
                tsLeaveEmbed.setAuthor(message.author.username, message.author.avatarURL())
                    .setColor('GREEN')
                    .setTitle('Talking Stick:')
                    .addField(`${message.member.displayName} removed the Talking Stick.\n\tYou may now talk freely.`, `Removed from ${message.member.voice.channel.name}`);

                message.member.voice.channel.updateOverwrite(findRole(message.guild, 'Stick Holder'), {
                    SPEAK: null
                })
                .then()
                .catch(console.error);
                
                message.member.voice.channel.updateOverwrite(message.guild.roles.everyone, {
                    SPEAK: null
                })
                .catch(beep => {
                    console.error(beep);
                });
                message.tempSend(tsLeaveEmbed);
            } 
            else if (args == "text") {
                console.log('entered4')
                message.guild.roles.cache.array().forEach(r => {
                    if(!r.name == 'muted' && !r.name == 'Muted') {
                        console.log('entered6')
                        message.channel.updateOverwrite(r, {SEND_MESSAGES: null})
                            .then(c => console.log(`The channel ${message.channel.name} now has the talking stick in ${message.guild.name}`))
                            .catch(e => console.log(`Could not update permissions for ${r.name} for ${message.channel.name} in ${message.guild.name} requested by ${message.author.username}#${message.author.discriminator} (${message.member.id}) :`, e));
                    }
                })
                
                await message.channel.updateOverwrite(findRole(message.guild, 'Stick Holder'), {SEND_MESSAGES: null}).catch(console.err);
                await message.channel.updateOverwrite(message.guild.roles.everyone, {SEND_MESSAGES: null}).catch(console.err);
                for (const [memberID, member] of message.guild.members.cache) {
                    if(!member.voice.channelID && someRole(member, 'Stick Holder')) {
                        member.roles.remove(findRole(message.guild, 'Stick Holder')).catch(console.err);
                    }
                }
                
                tsLeaveEmbed
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .setColor('GREEN')
                    .setTitle('Talking Stick:')
                    .addField(`${message.member.displayName} removed the Talking Stick.\n\tYou may now type freely.`, `Removed from ${message.channel.name}`);

                message.tempSend(tsLeaveEmbed);
            }
        }
        else {
                message.tempReply(`Please run \`${prefix}tsinit\` to create all requried roles.`);
        }
    }
    else {
        message.tempReply('You do not have permission to do this.');
    }
}