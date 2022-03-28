import { MessageEmbed, Message } from "discord.js";
import { roles } from "../exports/configExports.js";
import { someRole, findRole, destroyRole, datedErr } from "../exports/functionExports.js";

import "../prototypes/tempSend.js";
import "../prototypes/tempReply.js";

/**
 * @param {Message} message 
 * @returns {void}
 */

export default async function (message) {
    if (message.member.hasPermission(8) || message.member.id == developer.id) { //if message author has admin perms
        const tsdestroyEmbed = new MessageEmbed();
        let str = "";
        if (findRole(message.guild, "TSLeft")) findRole(message.guild, "TSLeft").members.map(member => member.user.username).forEach((member) => str += member + '\n');
        
        for (let roleIdx in roles) {
            if (someRole(message.guild, roles[roleIdx])) {
                destroyRole(roles[roleIdx], message);
                tsdestroyEmbed.addField(`__Destroying ${roles[roleIdx]}__`,`${roles[roleIdx]} has been destroyed.`); 
            } else tsdestroyEmbed.addField(`__Creating ${roles[roleIdx]}__`,`${roles[roleIdx]} is not present.`);
        }
        
        if (str != "") tsdestroyEmbed.addField("**Users still muted:**\n", `${str}\n**These users must be manually unmuted the next time they join a voice channel.**`);
        tsdestroyEmbed.setAuthor(`${message.author.tag} executed TSDestroy`, message.author.avatarURL())
            .setColor("RED")
            .setFooter("Done.");
        message.tempSend(tsdestroyEmbed).catch(datedErr);
     
        
    } else message.tempReply("You do not have permission to do this.").catch(datedErr);
}