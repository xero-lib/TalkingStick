import { date, datedErr, setPresence } from "../../exports/functionExports.js";
import { Client } from "discord.js";

/**
 * 
 * @param {Client<true>} client 
 */

export default async function (client) {
    await client.guilds.fetch();
    console.log(date(),`Currently in ${client.guilds.cache.size} servers`);
    setPresence();
}