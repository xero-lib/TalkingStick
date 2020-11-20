import '../prototypes/tempReply.js';
import '../prototypes/tempSend.js';
import Discord from 'discord.js';
import  {defaultPrefix as prefix, developer} from '../coagulators/configCoagulator.js';
import {someRole, findRole} from '../coagulators/functionCoagulator.js';

export default async function tsjoin(message, args, command) {
    const tsEmbed = new Discord.MessageEmbed();
    if (someRole(message.member, 'Stick Controller') || message.member.permissions.has(8) || message.member.id == developer.id) { //if message author is in Stick Controller group or an admin
        if(someRole(message.guild, 'Stick Controller') || someRole(message.guild, 'Stick Holder')){
            if (message.member.voice.channel && args == "voice") {
                message.member.roles.add(findRole(message.guild, 'Stick Holder'))
                    .catch(e => {
                        console.log('Could not add Stick holder to', `${message.author.username}#${message.author.discriminator} (${message.author.id}) in ${message.guild.name}`)
                    }); //add message author to Stick Holder
                message.member.voice.channel.updateOverwrite(findRole(message.guild, 'Stick Holder'), {
                    SPEAK: true
                })
                .catch((err) => {
                    console.error(err);
                    message.channel.send('In order for Talking Stick to work properly, you must drag the \`Talking Stick\` role to the top of the list in server settings. Talking Stick will attempt to run without this, but will not be able to function properly, and is strongly disadvized.').catch(console.error);
                });
                
                message.member.voice.channel.updateOverwrite(message.guild.roles.everyone, {
                    SPEAK: false
                })
                .catch(e => console.error('Error in tsjoin: voice: updateOverwrite everyone'));
                
                tsEmbed
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .setColor('GREEN')
                    .setTitle('Talking Stick:')
                    .addField(`${message.member.displayName} has the talking stick!`, `Currently in ${message.member.voice.channel.name}`)
                    .setFooter(`To pass the Talking Stick, use ${prefix}tspass <ping a user in the same channel as you>`);

                for (const [_, member] of message.member.voice.channel.members) {
                    if (member != message.member){
                        member.voice.setMute(true)
                            .catch(err => message.tempReply(`Unable to mute members in ${message.member.voice.channel.name}, please report this by DMing the bot.`));

                        member.roles.add(findRole(member.guild, 'Stick Listener'))
                            .catch(e => {
                                console.log(e, `\nUnable to update role for ${member.user.username}#${member.user.discriminator} (${member.id})`)
                                message.tempReply(`Unable to update role for ${member.user.username}#${member.user.discriminator}. Please DM the bot about this incident. A possible solution is to move the Talking Stick role above all others under Server Settings > Roles and my ensuring that the Talking Stick role has Manage Roles permissions.`)
                                    .catch(e2 => {
                                        console.log(e2)
                                    });
                            });
                    }
                }
                
                message.tempSend(tsEmbed);
            } 
            else if(args == "text")  {
                message.guild.roles.cache.array().forEach(r => {
                    if(!r.name == 'muted' && !r.name == 'Muted') {
                        message.channel.updateOverwrite(r, {SEND_MESSAGES: false})
                            .then(c => console.log(`The channel ${message.channel.name} now has the talking stick in ${message.guild.name}`))
                            .catch(e => console.log(`Could not update permissions for ${r.name} in ${message.channel.name} in ${message.guild.name} requested by ${message.author.username}#${message.author.discriminator} (${message.member.id}) :`, e));
                    }
                })

                message.channel.updateOverwrite(findRole(message.guild, 'Talking Stick'), {SEND_MESSAGES: true})
                    .then(c => console.log(`Set Talking Stick type permissions in ${message.channel.name} (${message.guild.name})`))
                    .catch(console.error);message.member.roles.add(findRole(message.guild, 'Stick Holder')).catch(console.error);

                message.channel.updateOverwrite(findRole(message.guild, 'Stick Holder'), {SEND_MESSAGES: true})
                    .then(c => console.log(`The channel ${message.channel.name} now has the talking stick in ${message.guild.name}`))
                    .catch(console.error);

                message.channel.updateOverwrite(message.guild.roles.everyone, {SEND_MESSAGES: false})
                    .then(c => console.log(`Set @everyone type permissions in ${message.channel.name} (${message.guild.name})`))
                    .catch(console.error);
                    
                tsEmbed
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .setColor('GREEN')
                    .setTitle('Talking Stick:')
                    .addField(`${message.member.displayName} has the talking stick!`, `Currently in ${message.channel.name}`)
                    .setFooter(`To pass the Talking Stick, use ${prefix}tspass <ping a user>`);

                message.tempReply(tsEmbed)
                    .catch(e => {
                        console.log(e, `\nStill could not send tsEmbed in ${message.channel.name} in ${message.guild.name}, requested by ${message.author.username}#${message.author.discriminator} (${message.author.id}), even after attempting to override.`);


                    });
            }
            else if(!args) {
                message.tempReply(`You must supply one argument. If you are in a voice channel, use \`${prefix}tsjoin voice\`. If you are in a text channel, use \`${prefix}tsjoin text\`.`)
            }
            else if(!message.member.voice.channel && args == 'voice') {
                message.tempReply('You need to join a voice channel first!');
            } 
            else if(args && message.member.voice.channel) {
                message.tempReply(`"\`${args}\`" is not a valid option for ${prefix}${command}`);
            } 
        }
        else {
            message.tempReply(`Please run \`${prefix}tsinit\` to create the required roles`);
        }
    }
    else {
        message.tempReply('You do not have permission to do this.');
    }
}
 