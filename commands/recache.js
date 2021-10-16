import chalk from "chalk";//have to import like this due to chalk being done entirely in module.exports
import { Message } from "discord.js";
import { datedErr } from "../exports/functionExports.js";
import { developer, client } from "../exports/configExports.js"; //see if a server has the ts roles

import "../prototypes/tempReply.js";

/**
 * @param {Message} message
 * @returns {void}
 */

export default async function (message) {
    if (message.author.id == developer.id) for (const g of client.guilds?.cache?.values()) await g.members.fetch().catch((e) => datedErr(chalk.redBright(`Error recaching "${g.name}"\n`) + chalk.redBright(e)));
    else {
        datedErr(chalk.redBright(`${message.author.tag} (${message.author.id}) attempted to execute RECACHE without permission.`));
        message.tempReply("You do not have permission to execute this command. This incident has been reported.").catch(datedErr);
    }
}
