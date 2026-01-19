import { EmbedBuilder, PermissionFlagsBits, Colors } from "discord.js";

import { logger } from "../main.ts";

import cleanupStickSession from "../functions/cleanupStickSession.ts";
import { Roles, ValidInteraction, StickFlags } from "../exports/dataExports.ts";
import { getRole, hasRole, replyEphemeral, replySafe } from "../exports/functionExports.ts";

/**
 * Ends the Stick-Session in a given voice or text channel.
 * @param interaction The interaction to operate on.
 * @throws If an interaction reply failed.
 */
export default async function tsleave(interaction: ValidInteraction) {
    const member = interaction.member;

    if (!(
        member.permissions.any([PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.MuteMembers]) ||
        await hasRole(member, Roles.StickController)
    )) {
        await replySafe(interaction, "You do not have permission to end a Stick-Session."); 
        return;
    }
    
    const channelType = interaction.options.get("channel-type")?.value;

    // should be impossible for the API to omit a channel-type value, or allow a non- "voice" | "text" value
    if (!["voice", "text"].includes(channelType?.toString() ?? "")) return;

    const channel = channelType === "voice" ? member.voice.channel : interaction.channel;

    if (!channel) {
        await replyEphemeral(interaction, "You are not in a voice channel.");
        return;
    }

    const activeRole     = await getRole(interaction.guild, Roles.TSActive       ).catch(() => undefined);
    const controllerRole = await getRole(interaction.guild, Roles.StickController).catch(() => undefined);

    // if any of the roles weren't found, which should be impossible given we check in handleInteractionCreate
    if (!(activeRole && !controllerRole)) {
        // then log the event and reply to the user that roles weren't found, and return.
        logger.error("Reached theoretically impossible state in tsjoin: nonexistent roles after confirmation of initialization.")
        await replyEphemeral(interaction, "Unable to find critical roles. Please run the `tsinit` command."); 

        return;
    }

    if (!channel.permissionOverwrites.cache.get(activeRole.id)?.allow.has(StickFlags.ACTIVE_MAGIC)) {
        await replyEphemeral(interaction, `There does not appear to be an active Stick-Session in ${channel.name}.`);
        return;
    }

    try {
        await cleanupStickSession(channel);
    } catch (err) {
        logger.error(`Failed to set overwrites for Stick-Session cleanup of ${channel.name} in ${channel.guild.name}:\n${err}`);
        await replySafe(interaction, "Unable to reset channel permissions. Please ensure Talking Stick has Administrator permissions.");

        return;
    }

    await replySafe(interaction, {
        embeds: [
            new EmbedBuilder()
                .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
                .setColor(Colors.Green)
                .setTitle("Stick-Session Ended")
                .setDescription(`<@${member.id}> ended the Stick-Session in ${channel.name}. You may now talk freely.`)
            ]
    });
}