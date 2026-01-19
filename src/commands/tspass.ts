import { EmbedBuilder, GuildMember, Colors, PermissionOverwriteOptions, OverwriteType } from "discord.js";

import { logger } from "../main.ts";

import { OverwriteManager, Roles, StickFlags, ValidInteraction } from "../exports/dataExports.ts";
import { getRole, replyEphemeral, replySafe } from "../exports/functionExports.ts";

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

    const isVoice = channelType === "voice";

    const channel = isVoice
        ? member.voice.channel
        : interaction.channel
    ;

    if (!channel) {
        await replyEphemeral(interaction, "You must be in a voice channel to use `/tspass Voice Channel`.");
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
        await replyEphemeral(interaction, `There does not appear to be an active Stick-Session in <#${channel.id}>.`);
        return;
    }
    
    const memberOverwrites = new OverwriteManager(
        isVoice,
        channel.permissionOverwrites.cache.get(member.id) ?? { id: member.id, type: OverwriteType.Member }
    );

    if (!memberOverwrites.hasStick()) {
        await replyEphemeral(interaction, "You don't appear to have the Talking Stick. To use `tspass`, you must first be a Stick Holder.");
        return;
    }

    // if the target member is either not in a voice channel or not in the initiator's voice channel
    if (isVoice && target.voice.channelId !== channel.id) {
        await replyEphemeral(interaction, `<@${target.id}> doesn't seem to be in your voice channel`);
        return;
    }
    
    const targetOverwrites = new OverwriteManager(
        isVoice,
        channel.permissionOverwrites.cache.get(target.id) ?? { id: target.id, type: OverwriteType.Member }
    );

    if (targetOverwrites.hasStick()) {
        await replySafe(interaction, `<@${target.id}> already has a updateTalking Stick in <#${channel.id}>`);
        return;
    }

    // pass
    memberOverwrites.takeStick();
    targetOverwrites.giveStick();

    try {
        await channel.permissionOverwrites.create(
            target.id,
            targetOverwrites.toOverwriteData() as PermissionOverwriteOptions
        )

        await channel.permissionOverwrites.create(
            member.id,
            memberOverwrites.toOverwriteData() as PermissionOverwriteOptions
        )
    } catch (err) {
        logger.error(`Unable to set new session state:\n${err}`);
        await replySafe(interaction, "Unable modify mutes. Talking Stick requires Administrator privileges in order to work properly.");

        return;
    }

    await replySafe(interaction, {
        embeds: [
            new EmbedBuilder()
                .setAuthor({
                        name: member.displayName,
                        iconURL: member.displayAvatarURL()
                })
                .setColor(Colors.Green)
                .setTitle("Talking Stick Passed")
                .setDescription(`<@${member.id}> passed the Talking Stick to <@${target.id}> in <#${channel.id}>!`)
        ]
    });
}