import chalk from "chalk";//have to import like this due to chalk being done entirely in module.exports
import { ChatInputCommandInteraction } from "discord.js";
import { datedErr } from "../exports/functionExports.js";
import { developer, client } from "../exports/configExports.js"; //see if a server has the ts roles

import "../prototypes/tempReply.js";

/**
 * @param {ChatInputCommandInteraction} interaction
 * @returns {void}
 */

export default async function (interaction) {
    if (interaction.user.id == developer.id) for (const g of client.guilds?.cache?.values()) await g.members.fetch().catch((e) => datedErr(chalk.redBright(`Error recaching "${g.name}"\n`) + chalk.redBright(e)));
    else {
        datedErr(chalk.redBright(`${interaction.user.tag} (${interaction.user.id}) attempted to execute RECACHE without permission.`));
        interaction.reply({ content: "You do not have permission to execute this command. This incident has been reported.", ephemeral: true }).catch(datedErr);
    }
}
