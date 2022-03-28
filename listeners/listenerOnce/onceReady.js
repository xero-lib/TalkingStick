import { client } from "../../exports/configExports.js";
import { date, setPresence } from "../../exports/functionExports.js";
import chalk from "chalk";

export default async function () {
        let members = 0;
        client.guilds.cache.forEach((guild) => members += guild.memberCount);
        console.log(date(),`Currently in ${chalk.yellow(client.guilds.cache.map(guild => guild.name).length)} servers, serving ${members} users\n` + date(), chalk.greenBright(`Ready in ${client.guilds.cache.array().length} servers!`));
        setPresence();
}