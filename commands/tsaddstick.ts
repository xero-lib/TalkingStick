import { GuildMember, OverwriteData, PermissionFlagsBits } from "discord.js";

import { logger } from "../index";
import hasRole from "../functions/hasRole";
import { Roles, ValidInteraction } from "../exports/dataExports";
import replyEphemeral from "../functions/replyEphemeral";
import { StickFlags } from "../exports/dataExports";

// const CAN_UNMUTE = (PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageRoles | PermissionFlagsBits.MuteMembers);

/**
 * @param interaction The interaction to operate on.
 * @throws
 */
export default async function tsaddstick(interaction: ValidInteraction) {
    const member = interaction.member;
    // if the initiator does not have ManageRoles or ManageChannels, nor Stick Controller
    if (
        !(
            member.permissions.bitfield & (PermissionFlagsBits.ManageRoles | PermissionFlagsBits.ManageChannels) ||
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

    const {
        channel,
        BOT_MAGIC,
        REVERT_MAGIC,
        CommunicatePermission,
     } = channelType === "voice"
        ?
            {
                channel: target.voice.channel,
                BOT_MAGIC: StickFlags.VOICE_MAGIC,
                REVERT_MAGIC: StickFlags.VOICE_REVERT,
                CommunicatePermission: PermissionFlagsBits.Speak
            }
        :
            {
                channel: interaction.channel,
                BOT_MAGIC: StickFlags.TEXT_MAGIC,
                REVERT_MAGIC: StickFlags.TEXT_REVERT,
                CommunicatePermission: PermissionFlagsBits.SendMessages
            }
    ;


    // if the initiator is in a voice channel but the mentioned member is not
    if (!channel) {
        await replyEphemeral(interaction, `${target.displayName} is not in a voice channel.`);
        return;
    }

    const targetPerms = channel?.permissionOverwrites.cache.get(target.id);
    const targetAllow = (targetPerms?.allow?.bitfield ?? 0n) as bigint;
    const targetDeny  = (targetPerms?.deny?.bitfield  ?? 0n) as bigint;

    await channel.permissionOverwrites.create(
        target,
        {
            allow: targetAllow
                    | CommunicatePermission
                    | (((targetAllow &  CommunicatePermission) && !(targetDeny & BOT_MAGIC)) ? REVERT_MAGIC : 0n),
            deny:  BOT_MAGIC
                    |   (targetDeny  & ~CommunicatePermission)
                    | (((targetDeny  &  CommunicatePermission) && !(targetDeny & BOT_MAGIC)) ? REVERT_MAGIC : 0n)
        } as OverwriteData as any
    );

    // unnecessary, as if they're able to addstick, they have the ability to unmute the target
    // check if 
    //     - the target user is explicitly muted but not by the bot and
    //     - the target does not have ManageChannel or ManageRoles or MuteMembers (can't unmute themselves) and
    //     - the initiator does not have ManageChannel or ManageRoles or MuteMembers (can't unmute the target)

    // if (
    //     (targetDeny & CommunicatePermission) && !(targetDeny & BOT_MAGIC) && 
    //     !(target.permissions.bitfield & CAN_UNMUTE) &&
    //     !(initiatorPerms & CAN_UNMUTE)
    // ) {

    // }
    
    // // unacceptable. rewrite to allow both voice and text
    // if (interaction.member.voice.channel && !target.voice.channel) {
    // }

    // if (interaction.member.voice.channel && target.voice.channelId === interaction.member.voice.channelId) {
    // try {
    //     await target.roles.add(holderRole);
    //     await target.voice.setMute(false);
    // } catch (e) {
    //     logger.error(`Failed to add holderRole to ${target.user.username} (${target.id}) in ${interaction.guild.name}`);
    //     await replySafe(interaction, `Failed to give ${target.displayName} a Talking Stick. Please ensure Talking Stick has Administrator permissons, and try again.`);

    //     return;
    // }
}