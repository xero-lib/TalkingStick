import { GuildMember, OverwriteType, PermissionFlagsBits, PermissionOverwriteOptions } from "discord.js";

import { logger } from "../main.ts";

import { OverwriteManager } from "../exports/dataExports.ts";
import { Roles, ValidInteraction } from "../exports/dataExports.ts";
import { hasRole, replyEphemeral } from "../exports/functionExports.ts";

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

    const channel = channelType === "voice"
        ? target.voice.channel
        : interaction.channel
    ;

    // if the initiator is in a voice channel but the mentioned member is not
    if (!channel) {
        await replyEphemeral(interaction, `<@${target.id}> is not in a voice channel.`);
        return;
    }

    const targetOverwrites = new OverwriteManager(channel.isVoiceBased(), channel?.permissionOverwrites.cache.get(target.id) ?? { id: target.id, type: OverwriteType.Member });
    targetOverwrites.giveStick();

    await channel.permissionOverwrites.create(
        target,
        targetOverwrites.toOverwriteData() as PermissionOverwriteOptions
    );
}