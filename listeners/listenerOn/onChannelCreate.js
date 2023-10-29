import { TextChannel, VoiceChannel } from "discord.js";
import { date } from "../../exports/functionExports.js";

/**
 * @param {TextChannel | VoiceChannel} c 
 * @returns {void}
 */

export default async function (c /*channel*/ ) { 
    if(c.name) await c.fetch().catch((e) => console.error(date(),`Could not fetch ${e?.name} in ${e?.guild.name}:`,e));
}