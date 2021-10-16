import { TextChannel, VoiceChannel } from "discord.js";
import { client } from "../../exports/configExports.js";
import { datedErr } from "../../exports/functionExports.js";

/**
 * @param {TextChannel | VoiceChannel} c
 * @returns {void}
 */

export default async function (c) {
    if (c.name && !client.guilds.cache.get(c.guild.id).channels.cache.delete(c.id))
        datedErr("Could not remove deleted channel from cache");
}