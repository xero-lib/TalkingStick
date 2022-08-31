import { ChatInputCommandInteraction } from "discord.js";
import { botInv } from "../config/botConfig.js";
import { datedErr } from "../exports/functionExports.js";


/**
 * @param {ChatInputCommandInteraction} interaction
 * @returns {void}
 */

export default async function (interaction) {
    interaction.reply({ content: botInv, ephemeral: true }).catch((e) => 
        datedErr(`Could not send invite requested by ${interaction.user.tag} (${interaction.user.id}) in ${interaction.guild.name}:`, e)
    );
}
