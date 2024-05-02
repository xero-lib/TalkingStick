import { ChatInputCommandInteraction } from "discord.js";
import { datedErr } from "../exports/functionExports.js";
import { developer, client } from "../exports/configExports.js"; //see if a server has the ts roles

// import "../prototypes/tempReply.js";

/**
 * @param {ChatInputCommandInteraction} interaction
 * @returns {void}
 */

export default async function (interaction) {
    if (interaction.user.id == developer.id) {
        let errGuilds = [];
        for (const g of client.guilds?.cache?.values()) {
            g.members.fetch().catch((e) => {
                errGuilds.push(g.name);
                datedErr(`Error recaching "${g.nme}"\n${e}`);
            });
        }
        if (errGuilds.length === 0) {
            interaction.reply({ content: "Recache successful"})
        } else {
            interaction.reply({ content: `Recaching failed in ${errGuilds.length} servers:\n\`\`\`\n${errGuilds.join("\n")}\n\`\`\``})
        }
    } else {
        datedErr(`${interaction.user.tag} (${interaction.user.id}) attempted to execute RECACHE without permission.`);
        developer.send(`${interaction.user.tag} has tried to run restricted command recache in ${interaction.guild.name}`);
        interaction.reply({
            content: "You do not have permission to execute this command. This incident has been reported.",
            ephemeral: true
        }).catch(datedErr);
    }
}