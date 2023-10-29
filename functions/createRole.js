import { ChatInputCommandInteraction, Role } from "discord.js";

/**
 * @param {string} roleName 
 * @param {ChatInputCommandInteraction} interaction 
 * @param {string} roleColor 
 * @returns {Promise<Role>}
 */

export default async function (roleName, interaction, roleColor) {
    return interaction.guild.roles.create({
        name: roleName,
        color: roleColor,
        reason: `Created ${roleName} for Talking Stick`
    });
}