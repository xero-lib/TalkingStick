import { ChatInputCommandInteraction, Guild, MessageFlags } from "discord.js";

import { logger } from "../index";
import { Roles } from "../data/Roles";
import { getRole } from "../exports/functionExports";
import { ValidInteraction } from "../data/ValidInteraction";
import replySafe from "./safeReply";

/**
 * Removes Talking Stick roles from a {@link Guild}.
 * @param interaction the {@link ChatInputCommandInteraction} whose guild to remove roles from.
 * @throws If either the role could not be deleted, or an interaction reply failed.
 */
export default async function destroyRoles(interaction: ValidInteraction) {
    logger.trace(`Executing destroyRoles in ${interaction.guild.name}, initiated by ${interaction.user.username} (${interaction.user.id})`);

    // defer
    try {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    } catch (err) {
        logger.debug("Failed to defer reply. Attempting to continue without...");
    }

    for (const role_entry of Object.values(Roles)) {
        const role = await getRole(interaction.guild, role_entry);
        if (!role) continue;
        try {
            await role.delete(`TSDestroyed by ${interaction.user.tag} (${interaction.user.id})`)
        } catch (e) {
            logger.error(`Encountered error during destroyRoles: ${e}`);
            await replySafe(interaction, `The bot likely lacks sufficient permissions to complete this action. Ensure Talking Stuck as Manage Roles permissions. Encountered: ${typeof e}.`);

            return;
        }
    }
}