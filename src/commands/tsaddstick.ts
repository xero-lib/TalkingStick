import { GuildMember, OverwriteType, PermissionFlagsBits, PermissionOverwriteOptions } from "discord.js";

import { logger } from "../main.ts";

import { OverwriteManager, Roles, StickFlags, ValidInteraction } from "../exports/dataExports.ts";
import { getRole, hasRole, replyEphemeral } from "../exports/functionExports.ts";

/**
 * @param interaction The interaction to operate on.
 * @throws
 */
export default async function tsaddstick(interaction: ValidInteraction) {
    const member = interaction.member;
    // if the initiator does not have ManageRoles or ManageChannels, nor Stick Controller
    if (
        !(
            member.permissions.any([PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageChannels]) ||
            await hasRole(interaction.member, Roles.StickController)
        )
    ) { // then tell them they don't have permission, and return
        await replyEphemeral(interaction, "You do not have permission to add a Stick.");
        return;
    }

    const target = interaction.options.getMember("recipient");
    if (!(target instanceof GuildMember)) {
        logger.warn(`Unable to resolve user ${(target?.nick ?? "") + (target ? " " : "")}in ${interaction.guild.name}.`);
        await replyEphemeral(interaction, "Unable to resolve user. Please wait a moment and try again.");

        return;
    }

    // const initiatorPerms = member.permissions.bitfield;

    const channelType = interaction.options.get("channel-type")?.value;

    // should be impossible for the API to omit a channel-type value, or allow a non- "voice" | "text" value
    if (!["voice", "text"].includes(channelType?.toString() ?? "")) return;

    const isVoice = channelType === "voice";
    const channel = isVoice
        ? target.voice.channel
        : interaction.channel
        ;

    // if the initiator is in a voice channel but the mentioned member is not
    if (!channel) {
        await replyEphemeral(interaction, `<@${target.id}> is not in a voice channel.`);
        return;
    }

    const activeRole = await getRole(interaction.guild, Roles.TSActive).catch(logger.error);
    if (!activeRole) {
        await replyEphemeral(interaction, "Unable to find critical roles. Please run `tsinit`.");
        return;
    }

    if (!channel.permissionOverwrites.cache.get(activeRole.id)?.allow.has(StickFlags.ACTIVE_MAGIC)) {
        await replyEphemeral(interaction, `There does not appear to be an active Stick-Session in <#${channel.id}>.`);
        return;
    }

    const targetOverwrites = new OverwriteManager(isVoice, channel.permissionOverwrites.cache.get(target.id) ?? { id: target.id, type: OverwriteType.Member });

    if (targetOverwrites.hasStick()) {
        await replyEphemeral(interaction, `<@${target.id}> already has a stick.`);
        return;
    }

    targetOverwrites.giveStick();

    try {
        await channel.permissionOverwrites.create(
            target,
            targetOverwrites.toOverwriteData() as PermissionOverwriteOptions
        );
    } catch (err) {
        logger.error(`Failed to add stick to ${target.user.username} (${target.id}):\n${err}`);
        await replyEphemeral(interaction, `Talking Stick was unable to grant permission modifications for <#${channel.id}>.`);
        return;
    }

    await replyEphemeral(interaction, `Granted a stick to <@${target.id}>.`);
}