import { EmbedBuilder, PermissionFlagsBits, Colors } from "discord.js";

import { logger } from "../index";
import { Roles, ValidInteraction } from "../exports/dataExports";
import { destroyRoles, getRole, hasRole } from "../exports/functionExports";
import replySafe from "../functions/safeReply";
import replyEphemeral from "../functions/replyEphemeral";

/**
 * Deletes all Talking Stick roles in a given guild.
 * @param interaction The interaction to operate on.
 * @throws If an interaction reply fails.
 */
export default async function tsdestroy(interaction: ValidInteraction) {
    const guild = await interaction.guild.fetch().catch((e) => {
        logger.error(`Unable to fetch guild state of ${interaction.guild.name}`);
        return null;
    });

    if (!guild) {
        await replyEphemeral(interaction, "Talking Stick encountered an error while trying to fetch server data. Please try again in a moment.");
        return;
    };

    await replyEphemeral(interaction, "Destroying roles...");

    // if the user does not have ManageRoles permissions, 
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
        // then reply to the user that they are missing permissions, and return.
        await replyEphemeral(interaction, "You do not have permission to do this.");
        return;
    }

    const tsdestroyEmbed = new EmbedBuilder();
    
    for (const role of Object.values(Roles)) {
        // if the guild has the given role
        if (await hasRole(guild, role)) tsdestroyEmbed.addFields([{ name: `Destroying \`${role}\``, value: `${role} destroyed.` }]); 
        else tsdestroyEmbed.addFields([{ name: `__Skipping ${role}__`, value: `${role} is not present.` }]);
    }

    try {
        await destroyRoles(interaction);
    } catch (e) {
        logger.debug(`destroyRoles failed: ${e}`);
        // probably just make this its own reply
        tsdestroyEmbed.addFields({ name: `Error`, value: "A problem occured during role deletion. If any roles are still present, you may have to manually delete them." });
    }
    
    tsdestroyEmbed.setAuthor({ name: `${interaction.member.displayName} (${interaction.user.id}) executed TSDestroy`, iconURL: interaction.member.displayAvatarURL() })
        .setColor(Colors.Red)
        .setFooter({ text: "`tsdestroy` execution concluded." });

    await replyEphemeral(interaction, { content: "", embeds: [tsdestroyEmbed] });
}
