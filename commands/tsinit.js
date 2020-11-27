import '../prototypes/tempSend.js';
import '../prototypes/tempReply.js';
import { roles, developer, defaultPrefix as prefix, Discord } from '../coagulators/configCoagulator.js';
import { createRole, someRole } from '../coagulators/functionCoagulator.js';
import { date } from '../coagulators/functionCoagulator.js';



export default async function tsinit(message, _) {
    if(message.member.permissions.has(8) || message.member.id == developer.id) {
        const tsinitEmbed = new Discord.MessageEmbed()
        try{
            for(let roleIdx in roles){
                if(!someRole(message.guild, roles[roleIdx])) {
                    if(roles[roleIdx] == 'Stick Holder'){
                        await createRole(roles[roleIdx], message, '#c79638');
                        tsinitEmbed.addField(`__**Creating ${roles[roleIdx]}**__`,`${roles[roleIdx]} has been created.`);
                    }
                    else {
                        await createRole(roles[roleIdx], message);
                        tsinitEmbed.addField(`__**Creating ${roles[roleIdx]}**__`,`${roles[roleIdx]} has been created.`);
                    } 
                }
                else {
                    tsinitEmbed.addField(`__**Creating ${roles[roleIdx]}**__`,`${roles[roleIdx]} is present.`);
                }
            }

            tsinitEmbed.setFooter('Done.')
                .setColor('GREEN')
                .setAuthor(`${message.author.username}#${message.author.discriminator} executed TSInit`, message.author.avatarURL());
            
            message.tempSend(tsinitEmbed);

            message.guild.fetch()
                .then(cached => {
                    message.tempSend(`Caching guild members (this allows the bot to efficiently mute users. If a user isn\'t being muted, try re-running \`${prefix}tsinit\`)`);
                    console.log(date,cached.name, 'has been cached due to tsinit.')
                }).catch(e => {
                    console.error(date,`Unable to cache ${message.guild.name} (ID: ${message.guild.id}) (owner: ${message.guild.owner} (${message.guild.ownerID}`, e);
                    message.tempSend(`Unable to cache all users! The bot might not work properly. To try again, rerun \`${prefix}tsinit\``)
                })

        } catch (err) {
            console.error(date,'Could not tsinit:',err);
            message.tempReply(`The bot most likely doesn\'t have sufficient permissions to complete this action. In server settings under roles, drag the \`Talking Stick\` role to the top. For more instruction on how to do this, type \`${prefix}help\`, and scroll to the bottom of the page.`)
            .then(() => console.log(date,`Reply sent to ${message.author.username}`));            
        }

    }
    else {
            message.tempReply('You do not have permission to do this.');
    }
        
}