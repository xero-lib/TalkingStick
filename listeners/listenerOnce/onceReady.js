import { date, setPresence } from "../../exports/functionExports.js";
import chalk from "chalk";

export default async function (client) {
    console.log(date(),`Currently in ${chalk.yellow(client.guilds.cache.map(guild => guild.name).length)} servers\n` + date(), chalk.greenBright(`Ready in ${client.guilds.cache.size} servers!`));
    setPresence(client);
}