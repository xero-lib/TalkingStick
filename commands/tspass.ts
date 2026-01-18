import { EmbedBuilder, GuildMember, Colors, PermissionFlagsBits, OverwriteType, PermissionOverwriteOptions } from "discord.js";

import { logger } from "../main.ts";

import { Roles, StickFlags, ValidInteraction } from "../exports/dataExports.ts";
import { getRole, replyEphemeral, replySafe } from "../exports/functionExports.ts";

// if the target already has a talking stick, tell the initiator and do nothing

/**
 * Passes the Talking Stick from the interaction initiator to a target member.
 * @param interaction The interaction to operate on.
 * @throws If an interaction reply failed.
 */
export default async function tspass(interaction: ValidInteraction) {
    const member = interaction.member;
    
    const target = interaction.options.getMember("recipient");
    if (!(target instanceof GuildMember)) {
        await replyEphemeral(interaction, "Unable to resolve user. Please wait a moment and try again.");
        return;
    }

    if (target.id === member.id) {
        await replySafe(interaction, `You (<@${member.id}>) cannot pass the stick to yourself (<@${target.id}>)`);
        return;
    }

    const channelType = interaction.options.get("channel-type")?.value;

    // should be impossible for the API to omit a channel-type value, or allow a non- "voice" | "text" value
    if (!["voice", "text"].includes(channelType?.toString() ?? "")) return;

    const {
        channel,
        BOT_MAGIC,
        CommunicatePermission,
     } = channelType === "voice"
        ?
            {
                channel: member.voice.channel,
                BOT_MAGIC: StickFlags.VOICE_MAGIC,
                CommunicatePermission: PermissionFlagsBits.Speak
            }
        :
            {
                channel: interaction.channel,
                BOT_MAGIC: StickFlags.TEXT_MAGIC,
                CommunicatePermission: PermissionFlagsBits.SendMessages
            }
    ;


    if (!channel) {
        await replyEphemeral(interaction, "You are not in a voice channel.");
        return;
    }

    const activeRole     = await getRole(interaction.guild, Roles.TSActive       ).catch(() => undefined);
    const controllerRole = await getRole(interaction.guild, Roles.StickController).catch(() => undefined);

    // if any of the roles weren't found, which should be impossible given we check in handleInteractionCreate
    if (!(activeRole && controllerRole)) {
        // then log the event and reply to the user that roles weren't found, and return.
        logger.error(`Reached theoretically impossible state in tsjoin: nonexistent roles after confirmation of initialization.`)
        await replyEphemeral(interaction, "Unable to find critical roles. Please run the `tsinit` command."); 

        return;
    }

    if (!channel.permissionOverwrites.cache.get(activeRole.id)?.allow.has(StickFlags.ACTIVE_MAGIC)) {
        await replyEphemeral(interaction, `There does not appear to be an active Stick-Session in ${channel.name}.`);
        return;
    }
    
    const memberOverwrites = channel.permissionOverwrites.cache.get(member.id);
    const memberAllow = (memberOverwrites?.allow ?? 0n) as bigint;
    const memberDeny  = (memberOverwrites?.deny  ?? 0n) as bigint;

    /* 
    * if the initiator has explicit deny: CommunicationPermission and doesn't have BOT_MAGIC on allow (i.e. if they're not manually muted)
    * if the initiator DOES have BOT_MAGIC, they were manually muted while holding the stick, so allow them to pass it. 
    */
    if (!(memberAllow & BOT_MAGIC)) {
        await replyEphemeral(interaction, "You don't appear to have the Talking Stick. To use `tspass`, you must first be a Stick Holder.");
        return;
    }

    // if the target member is either not in a voice channel or not in the initiator's voice channel
    if (channelType === "voice" && target.voice.channelId !== channel.id) {
        await replyEphemeral(interaction, `${target.displayName} doesn't seem to be in your voice channel`);
        return;
    }
    
    const targetOverwrites = channel.permissionOverwrites.cache.get(target.id);
    const targetAllow = (targetOverwrites?.allow ?? 0n) as bigint;
    const targetDeny  = (targetOverwrites?.deny  ?? 0n) as bigint;

    try {
        await channel.permissionOverwrites.create(
            target.id,
            {
                id: target.id,
                type: OverwriteType.Member,
                allow: targetAllow | CommunicatePermission,
                deny:  targetDeny & ~CommunicatePermission
            } as PermissionOverwriteOptions
        )

        await channel.permissionOverwrites.create(
            member.id,
            {
                id: member.id,
                type: OverwriteType.Member,
                allow: memberAllow & ~CommunicatePermission,
                deny: memberDeny | CommunicatePermission
            } as PermissionOverwriteOptions
        )
    } catch (err) {
        logger.error(`Unable to update mute state:\n${err}`);
        await replySafe(interaction, `Unable modify mutes. Talking stick requires Administrator privileges in order to work properly.`);

        return;
    }

    await replySafe(interaction, {
        embeds: [
            new EmbedBuilder()
                .setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.member.displayAvatarURL()
                })
                .setTitle("Talking Stick Passed")
                .addFields({
                    name: `${interaction.member.displayName} passed the Talking Stick`,
                    value: `to ${target.user.username} in ${channelType === "voice" ? target.voice.channel!.name : interaction.channel.name}`
                })
                .setColor(Colors.Green)
        ]
    });
}