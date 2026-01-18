import { EmbedBuilder, PermissionFlagsBits, Colors, Collection, OverwriteResolvable, OverwriteType } from "discord.js";

import { logger } from "../main.ts";

import { Roles, StickFlags, ValidInteraction } from "../exports/dataExports.ts";
import { getRole, hasRole, replySafe, replyEphemeral } from "../exports/functionExports.ts";

// implement pass to muted individuals and pre-mute restoration, but only allow admins to pass to them (careful!)

/**
 * Initiates a Stick-Session in a particular voice or text channel.
 * @param interaction The interaction to operate on.
 * @throws If an interaction reply fails.
 */
export default async function tsjoin(interaction: ValidInteraction) {
    const member = interaction.member;

    // if the initiator does not have ManageRoles or ManageChannels, nor Stick Controller
    if (!(
        (member.permissions.bitfield & (PermissionFlagsBits.ManageRoles | PermissionFlagsBits.ManageChannels | PermissionFlagsBits.MuteMembers)) ||
        await hasRole(member, Roles.StickController)
    )) {
        await replySafe(interaction, "You do not have permission to start a Stick-Session."); 
        return;
    }

    const everyoneRole = interaction.guild.roles.everyone;

    const channelType = interaction.options.get("channel-type")?.value; // resolve the requested channel type

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
                channel: member.voice.channel,
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

    if (!channel) {
        await replyEphemeral(interaction, "You need to join a voice channel first!");
        return;
    }

    const activeRole     = await getRole(interaction.guild, Roles.TSActive       ).catch(() => undefined);
    const controllerRole = await getRole(interaction.guild, Roles.StickController).catch(() => undefined);

    // if any of the roles weren't found, which should be impossible given we check in handleInteractionCreate
    if (!(activeRole && controllerRole)) {
        // then log the event and reply to the user that roles weren't found, and return.
        logger.error("Reached theoretically impossible state in tsjoin: nonexistent roles after confirmation of initialization.")
        await replyEphemeral(interaction, "Unable to find critical roles. Please run the `tsinit` command."); 

        return;
    }

    if (channel.permissionOverwrites.cache.get(activeRole.id)?.allow.has(StickFlags.ACTIVE_MAGIC)) {
        await replyEphemeral(interaction, `There is already an active Stick-Session in ${channel.name}.`);
        return;
    }

    const oldOverwrites = channel.permissionOverwrites;
    const newOverwrites: Collection<string, OverwriteResolvable> = new Collection(
        oldOverwrites.cache.map(({ id, type, allow, deny }) =>
            [
                id,
                {
                    id,
                    type,
                    allow: allow.bitfield,
                    deny: deny.bitfield
                }
            ]
        )
    );

    // set channel magic to track Stick-Session
    newOverwrites.set(
        activeRole.id,
        {
            id: activeRole.id,
            type: OverwriteType.Role,
            allow: StickFlags.ACTIVE_MAGIC,
            deny: 0n
        }
    );

    /**
     * Determines the original (non-bot-assigned) state of allow and deny permission bitfields.
     * @param allow Overwrite's allow bitfield.
     * @param deny Overwrite's deny bitfield.
     * @returns Object containing whether or not the member had explicit permissions.
     */
    const getOriginalState = (allow: bigint, deny: bigint): { wasAllowed: boolean, wasDenied: boolean } => {
        const fromBot = ((allow | deny) & BOT_MAGIC) !== 0n;
        
        const wasAllowed = 0n !== (
            fromBot
                ? allow & REVERT_MAGIC
                : allow & CommunicatePermission
        );

        const wasDenied  = 0n !== (
            fromBot
                ? deny & REVERT_MAGIC
                : deny & CommunicatePermission
        );

        return { wasAllowed, wasDenied };
    }

    /**
     * 
     * @param id The ID of the {@link Role} or {@link GuildMember} to set overwrite for.
     * @param type The type of object you're setting the overwrite for ({@link Role} or {@link GuildMember}).
     * @param currentAllow The existing allow overwrite bitfield.
     * @param currentDeny The existing deny overwrite bitfield.
     */
    const setMuteOverwrite = (id: string, type: OverwriteType, currentAllow: bigint, currentDeny: bigint) => {
        const original = getOriginalState(currentAllow, currentDeny);

        newOverwrites.set(
            id,
            {
                id,
                type,
                allow: (~BOT_MAGIC & currentAllow & ~CommunicatePermission) | (original.wasAllowed ? REVERT_MAGIC : 0n),
                deny:    BOT_MAGIC | currentDeny |   CommunicatePermission  | (original.wasDenied  ? REVERT_MAGIC : 0n)
            }
        );
    }

    const initiatorOverwrites = oldOverwrites.cache.get(member.id);
    const initiatorAllow = (initiatorOverwrites?.allow.bitfield ?? 0n) as bigint;
    const initiatorDeny  = (initiatorOverwrites?.deny .bitfield ?? 0n) as bigint;

    const initiatorOriginal = getOriginalState(initiatorAllow, initiatorDeny);

    newOverwrites.set(
        member.id,
        {
            id: member.id, // member to update overwrites for
            type: OverwriteType.Member,
            allow: (initiatorAllow & ~REVERT_MAGIC) // strip potential garbage REVERT_MAGIC
                | BOT_MAGIC 
                | CommunicatePermission 
                | (initiatorOriginal.wasAllowed ? REVERT_MAGIC : 0n), // add it back only if necessary
            deny: (initiatorDeny & ~REVERT_MAGIC & ~CommunicatePermission) // strip CommunicatePermission overwrite to rule out conflicts
                | (initiatorOriginal.wasDenied  ? REVERT_MAGIC : 0n)
        }
    );

    // manually mute admins?

    // set @everyone role to SendMessages: false. If certain roles have explicit send permissions, ask and track
    const everyoneOverwrites = oldOverwrites.cache.get(everyoneRole.id);
    setMuteOverwrite(
        everyoneRole.id,
        OverwriteType.Role,
        everyoneOverwrites?.allow.bitfield ?? 0n,
        everyoneOverwrites?.deny .bitfield ?? 0n
    );

    // goal: make it so that only stick holder can send message
    // options:
        // perhaps iterate through overwrites that exist with allow[Speak] and change them, including a flag to revert?
        // - get all roles with explicit send permissions (what about admins?)
        // - get all members with explicit send permissions (what about inherited roles/giant servers?)
        // - get all allow[SendMessage] overwrites for the channel, give them the TEXT_REVERT flag and deny. (current)

    const skipIds = [interaction.client.user.id, member.id, activeRole.id, everyoneRole.id];
    for (const [id, overwrite] of oldOverwrites.cache) {
        if (skipIds.includes(id)) continue;

        setMuteOverwrite(
            id,
            overwrite.type,
            overwrite.allow.bitfield,
            overwrite.deny .bitfield
        );
    }

    try {
        await channel.permissionOverwrites.set(newOverwrites);
    } catch (err) {
        logger.error(`(${channelType}) Could not update permissions of ${channel.name} in ${interaction.guild.name} requested by ${interaction.user.username} (${member.id}) : ${err}`);
        await replySafe(interaction, `Talking Stick was unable to update the permissions of ${channel.name}. Please ensure Talking Stick has Administrator permissions.`);

        return;
    }

    await replySafe(
        interaction,
        {
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: member.displayName, iconURL: interaction.member.displayAvatarURL() })
                    .setColor(Colors.Green)
                    .setTitle("Stick-Session Started")
                    .addFields([{ name: `${member.displayName} has the Talking Stick!`, value: `Currently in ${channel.name}` }])
                    .setFooter({ text: `To pass the Talking Stick, use the \`tspass ${channelType} @recipient\` command.` })
            ]
        }
    );
}
