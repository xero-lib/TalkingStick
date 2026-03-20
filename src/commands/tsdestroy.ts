import { EmbedBuilder, PermissionFlagsBits, Colors } from "discord.js";

import { logger } from "../main.ts";

import { Roles, ValidInteraction } from "../exports/dataExports.ts";
import { destroyRoles, hasRole, replyEphemeral, replySafe } from "../exports/functionExports.ts";

/**
 * Deletes all Talking Stick roles in a given guild.
 * @param interaction The interaction to operate on.
 * @throws If an interaction reply fails.
 */
export default async function tsdestroy(interaction: ValidInteraction) {
    // check permission first
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
        await replyEphemeral(interaction, "You do not have permission to do this.");
        return;
    }

    const guild = await interaction.guild.fetch().catch((err) => {
        logger.error(`Unable to fetch guild state of ${interaction.guild.name}:\n${err}`);
        return null;
    });

    if (!guild) {
        await replyEphemeral(interaction, "Talking Stick encountered an error while trying to fetch server data. Please try again in a moment.");
        return;
    };

    const tsdestroyEmbed = new EmbedBuilder();

    for (const role of Object.values(Roles)) {
        if (await hasRole(guild, role)) tsdestroyEmbed.addFields([{ name: `Destroying \`${role}\``, value: `${role} destroyed.` }]);
        else tsdestroyEmbed.addFields([{ name: `__Skipping ${role}__`, value: `${role} is not present.` }]);
    }

    try {
        await destroyRoles(interaction);
    } catch (err) {
        logger.debug(`destroyRoles failed:\n${err}`);
        tsdestroyEmbed.addFields({ name: `Error`, value: "A problem occured during role deletion. If any roles are still present, you may have to manually delete them." });
    }

    tsdestroyEmbed
        .setColor(Colors.Red)
        .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
        .setDescription(`<@${interaction.member.id}> executed TSDestroy.`)
        .setFooter({ text: "`tsdestroy` execution concluded." });

    await replySafe(interaction, { content: "", embeds: [tsdestroyEmbed] });
}
