import { ChatInputCommandInteraction } from "discord.js";
import chalk from "chalk"; //have to import like this due to chalk being done entirely in module.exports
import { date, datedErr } from "../exports/functionExports.js";
import { developer, client } from "../exports/configExports.js";

import "../prototypes/tempReply.js";

/**
 * @param {ChatInputCommandInteraction} interaction
 * @returns {void}
 */

export default async function (interaction) {
    if (interaction.user.id == developer.id) {
        console.log(date(), chalk.bold("Recaching..."));

        for (const g of client.guilds.cache.values()) {
            await g.fetch()
                .then(() => console.log(date(),chalk.greenBright(`"${g.name}" has been hard recached`)))
                .catch((e) => datedErr(chalk.redBright(`Error hard recaching "${g.name}"\n${e}`)));
        }
    } else {
        interaction.tempReply("You do not have permission to execute this command. This incident has been reported.").catch(datedErr);
        datedErr(chalk.redBright(`${interaction.user.tag} (${interaction.user.id}) attempted to execute HARDRECACHE without permission.`));
        developer.send(`${interaction.user.tag} (${interaction.user.id}) attempted to execute HARDRECACHE without permission in ${message.guild.name}.`).catch(datedErr);
    }
}
