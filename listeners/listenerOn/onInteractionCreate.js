import { ChatInputCommandInteraction } from "discord.js"
import { CommandMap } from "../../exports/functionExports.js";

// import "../../prototypes/tempSend.js";
// import "../../prototypes/tempReply.js";

/**
 * @param {ChatInputCommandInteraction} interaction
 * @returns {void}
 */

export default async function (interaction) {
    if (interaction.guild && interaction.isChatInputCommand()) {
        CommandMap[interaction.commandName](interaction);
    } else {
        interaction.reply("You can only use Talking Stick in servers.")
    }
}