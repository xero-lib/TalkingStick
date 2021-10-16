import { Message } from "discord.js";
import { botInv } from "../config/botConfig.js";
import { datedErr } from "../exports/functionExports.js";


/**
 * @param {Message} message 
 * @returns {void}
 */

export default async function (message) {
    message.channel.send(botInv).catch((e) => 
        datedErr(`Could not send invite requested by ${message.author.tag} (${message.author.id}) in ${message.guild.name}:`, e)
    );
}
