import { date, setPresence } from "../../exports/functionExports.js";
import chalk from "chalk";
import { Client } from "discord.js";

/**
 * 
 * @param {Client<true>} client 
 */

export default async function (client) {
    await client.guilds.fetch();
    console.log(date(),`Currently in ${chalk.yellow(client.guilds.cache.size)} servers`);
    setPresence();
}