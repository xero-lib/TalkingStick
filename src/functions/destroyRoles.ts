import { MessageFlags } from "discord.js";

import { logger } from "../main.ts";

import { getRole, replySafe } from "../exports/functionExports.ts";
import { Roles, ValidInteraction } from "../exports/dataExports.ts";

/**
 * Removes Talking Stick roles from a {@link https://discord.js.org/docs/packages/discord.js/main/Guild:Class|Guild}.
 * @param interaction The {@link https://discord.js.org/docs/packages/discord.js/main/ChatInputCommandInteraction:Class|ChatInputCommandInteraction} whose guild to remove roles from.
 * @throws If either the role could not be deleted, or an interaction reply failed.
 */
export default async function destroyRoles(interaction: ValidInteraction) {
    logger.trace(`Executing destroyRoles in ${interaction.guild.name}, initiated by ${interaction.user.username} (${interaction.user.id})`);

    // defer
    try {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    } catch {
        logger.debug("Failed to defer reply. Attempting to continue without...");
    }

    for (const roleEntry of Object.values(Roles)) {
        const role = await getRole(interaction.guild, roleEntry);
        if (!role) continue;
        try {
            await role.delete(`TSDestroyed by ${interaction.user.username} (${interaction.user.id})`)
        } catch (err) {
            logger.error(`Encountered error during destroyRoles:\n${err}`);
            await replySafe(interaction, `The bot likely lacks sufficient permissions to complete this action. Ensure Talking Stuck as Manage Roles permissions. Encountered: ${typeof err}.`);

            return;
        }
    }
}