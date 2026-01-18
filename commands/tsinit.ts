import { EmbedBuilder, PermissionsBitField, Colors, ColorResolvable, MessageFlags } from "discord.js";

import { logger } from "../main.ts";

import { Roles, ValidInteraction } from "../exports/dataExports.ts";
import { createRoles, replyEphemeral, replySafe } from "../exports/functionExports.ts";

/**
 * Initializes all roles required for Talking Stick.
 * @param interaction The interaction to operate on.
 * @throws If an interaction reply or deferReply fails.
 */
export default async function tsinit(interaction: ValidInteraction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })
    // if the user does not have ManageRoles permissions, reject. Failsafe, as levels above this should prevent this from being possible.
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        // then log the event and reply to the user that roles weren't found, and return.
        logger.error("Reached theoretically impossible state in tsinit: member missing ManageRoles permission.");
        await replyEphemeral(interaction, "You do not have permission to do this.");

        return;
    }

    const tsinitEmbed = new EmbedBuilder()
        .setFooter({ text: "Please ensure Talking Stick has Administrator permissions, it is required for proper functioning." })
        .setColor(Colors.Green)
        .setAuthor({ name: `${interaction.user.tag} executed TSInit`, iconURL: interaction.member.displayAvatarURL() })
    ;

    const roleMap: Map<Roles, ColorResolvable> = new Map();
    for (const role of Object.values(Roles)) roleMap.set(role, Colors.Default); // initialize all Roles in the map to default color.

    let results = undefined;
    try {
        results = await createRoles(interaction, roleMap);
    } catch (e) {
        logger.error(`Encountered error while creating roles with createRoles in ${interaction.guild.name}: ${e}`);
        await replySafe(interaction, "Talking Stick encountered an error");

        return;
    }
    if (results.size === 0) {
        tsinitEmbed.setFields({ name: "TSInit", value: "All roles already exist in the guild! Nothing to do." });
        await replySafe(interaction, { embeds: [tsinitEmbed] });
        return;
    }

    for (const role of Object.values(Roles)) {
        tsinitEmbed.addFields([{
            name: `__**Creating ${role}**__`,
            value: `${role} ${results.has(role) ? "has been created" : "is already present"}.`
        }]);
    }
    
    await replySafe(interaction, { embeds: [tsinitEmbed] });
}