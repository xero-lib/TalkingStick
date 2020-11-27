import '../prototypes/tempReply.js';
import { someRole, findRole, date } from '../coagulators/functionCoagulator.js';
import { defaultPrefix as prefix, developer } from '../coagulators/configCoagulator.js';

export default async function (message) {
    if(message.member.hasPermission(8) || message.member.id == developer.id) {
        if(someRole(message.guild, 'Stick Controller')){
            if(message.mentions.users.first()){
                if(someRole(message.mentions.users.first(), 'Stick Controller')){
                    message.mentions.members.first().roles.remove(findRole(message.guild, 'Stick Controller')).catch(e => console.error(date(),'Error in tsremcon: cannot remove role:',e));
                } else {
                    message.tempReply(`${message.mentions.members.first()} does not have Stick Controller.`);
                }
            } else {
                message.tempReply('You must ping someone to remove Stick Controller from.');
            }
        } else {
            message.tempReply(`Stick Controller not found. Please run \`${prefix}tsinit\` to create all required roles before attempting to use Talking Stick.`);
        }
    } else {
        message.tempReply('You do not have permission to do this.');
    }
}