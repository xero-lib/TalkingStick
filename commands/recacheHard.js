import { Message } from "discord.js";
import chalk from "chalk"; //have to import like this due to chalk being done entirely in module.exports
import { date, datedErr } from "../exports/functionExports.js";
import { developer, client } from "../exports/configExports.js";

import "../prototypes/tempReply.js";

/**
 * @param {Message} message
 * @returns {void}
 */

export default async function (message) {
    if (message.author.id == developer.id) {
        console.log(date(), chalk.bold("Recaching..."));

        for (const g of client.guilds.cache.values()) {
            await g.fetch()
                .then(() => console.log(date(),chalk.greenBright(`"${g.name}" has been hard recached`)))
                .catch((e) => datedErr(chalk.redBright(`Error hard recaching "${g.name}"\n${e}`)));
        }
    } else {
        message.tempReply("You do not have permission to execute this command. This incident has been reported.").catch(datedErr);
        datedErr(chalk.redBright(`${message.author.tag} (${message.author.id}) attempted to execute HARDRECACHE without permission.`));
        developer.send(`${message.author.tag} (${message.author.id}) attempted to execute HARDRECACHE without permission in ${message.guild.name}.`).catch(datedErr);
    }
}
