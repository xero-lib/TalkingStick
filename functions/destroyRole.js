import { ChatInputCommandInteraction } from "discord.js";
import { findRole } from "../exports/functionExports.js";
import { date, datedErr } from "../exports/functionExports.js";

/**
 * @param {string} roleName 
 * @param {ChatInputCommandInteraction} interaction 
 * @returns {void}
 */

export default async function (roleName, interaction) {
    findRole(interaction.guild, roleName).delete(`TSDestroyed by ${interaction.user.tag} (${interaction.user.id})`).catch(() => interaction.tempReply(`The bot most likely doesn't have sufficient permissions to complete this action. In server settings under roles, drag the \`Talking Stick\` role to the top. For more instruction on how to do this, scroll to the bottom of \`/help\``).catch(datedErr)).catch(datedErr);
}