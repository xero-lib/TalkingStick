import { MessageEmbed, Message } from "discord.js";
import { createRole, someRole, datedErr } from "../exports/functionExports.js";
import { roles, developer, defaultPrefix as prefix } from "../exports/configExports.js";

import "../prototypes/tempSend.js";
import "../prototypes/tempReply.js";

/**
 * @param {Message} message 
 * @returns {void}
 */

export default async function (message) {
    if (message.member.permissions.has(8) || message.member.id == developer.id) {
        const tsinitEmbed = new MessageEmbed()
        
        for(let role of roles){
            if(!someRole(message.guild, role)) {
                if (role == "Stick Holder") await createRole(role, message, "#c79638").then(() => tsinitEmbed.addField(`__**Creating ${role}**__`,`${role} has been created.`)).catch(() => message.reply(`**Unable to create ${role}. Please ensure that the \`Talking Stick\` role is at the top of the roles list, and has sufficient permissions to create and manage roles.**`).catch(datedErr));
                else await createRole(role, message).then(() => tsinitEmbed.addField(`__**Creating ${role}**__`,`${role} has been created.`)).catch(datedErr);
            } else tsinitEmbed.addField(`__**Creating ${role}**__`,`${role} is present.`);
        }

        tsinitEmbed.setFooter("Done.")
            .setColor("GREEN")
            .setAuthor(`${message.author.tag} executed TSInit`, message.author.avatarURL());
        
        message.channel.send(tsinitEmbed).catch(datedErr);

        message.guild.fetch()
            .then(() => message.tempSend(`Caching guild members (this allows the bot to efficiently mute users. If a user isn't being muted, try re-running \`${prefix}tsinit\`)`).catch(datedErr))
            .catch((e) => {
                datedErr(`Unable to cache ${message.guild.name} (ID: ${message.guild.id}) (owner: ${message.guild.owner.user.tag} (${message.guild.ownerID}`, e);
                message.tempSend(`Unable to cache all users! The bot might not work properly. To try again, rerun \`${prefix}tsinit\``).catch(datedErr);
            })          
        

    } else message.tempReply("You do not have permission to do this.").catch(datedErr);        
}