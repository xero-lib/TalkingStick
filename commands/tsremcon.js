import { Message, MessageEmbed } from "discord.js";
import { someRole, findRole, datedErr } from "../exports/functionExports.js";
import { defaultPrefix as prefix, developer } from "../exports/configExports.js";

import "../prototypes/tempReply.js";

/**
 * @param {Message} message 
 */

export default async function (message) {
    if (message.member.hasPermission(8) || message.member.id == developer.id) {
        if (someRole(message.guild, "Stick Controller")) {
            if (message.mentions.users.first()) {
                if (someRole(message.mentions.members.first(), "Stick Controller")) {
                    message.mentions.members.first().roles.remove(findRole(message.guild, "Stick Controller")).then(() => {
                        message.channel.send(new MessageEmbed()
                            .setAuthor(message.author.username, message.author.avatarURL())
                            .setColor("RED")
                            .setTitle("**Stick Controller Removed**")
                            .addField("Controller removed from:", message.mentions.members.first().user.tag)
                            .setDescription(`Stick Controller permissions have been removed from ${message.mentions.members.first().displayName} by ${message.author.tag}`)
                        );
                    })
                    .catch((e) => datedErr("Error in tsremcon: cannot remove role:", e));
                } else message.tempReply(`${message.mentions.members.first()} does not have Stick Controller.`).catch(datedErr);
            } else message.tempReply("You must ping someone to remove Stick Controller from.").catch(datedErr);
        } else message.tempReply(`Stick Controller not found. Please run \`${prefix}tsinit\` to create all required roles before attempting to use Talking Stick.`).catch(datedErr);
    } else message.tempReply("You do not have permission to do this.").catch(datedErr);
}
