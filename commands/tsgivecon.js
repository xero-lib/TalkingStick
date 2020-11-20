import '../prototypes/tempReply.js';
import '../prototypes/tempSend.js';
import { findRole }      from '../coagulators/functionCoagulator.js';
import { defaultPrefix, developer, Discord } from '../coagulators/configCoagulator.js'

export default async function tsgivecon(message, _) {
    if(message.member.hasPermission(8) || message.member.id == developer.id) {
        const tsgiveconEmbed = new Discord.MessageEmbed();
        
        if(findRole(message.guild, 'Stick Controller')){
            if(message.mentions.members.first()){
                tsgiveconEmbed.setAuthor(message.author.username, message.author.avatarURL())
                    .setColor('GREEN')
                    .setTitle(`TSGiveCon executed by ${message.author.username}`)
                message.mentions.members.first().roles.add(findRole(message.guild, 'Stick Controller'))
                    .then(s => {
                        tsgiveconEmbed.addField('TSGiveCon:', `${message.mentions.members.first().username} has been given Stick Controller`)
                        message.tempSend(tsgiveconEmbed);
                    })
                    .catch(err => {
                        console.error(err);
                        message.tempReply('In order for Talking Stick to work properly, you must drag the \`Talking Stick\` role to the top of the list in server settings.');
                    });

                return;
            }
            else {
                message.tempReply('**You must mention someone to give Stick Controller.**');
                return;
            }
        }
        else {
            message.tempReply(`Please run \`${defaultPrefix}tsinit\` to create all required roles.`);
            return;
        }
    }
    else {
        message.tempReply('You do not have permission to do this.');
        return;
    }
}