import { Colors, EmbedBuilder, PermissionOverwriteOptions, VoiceState } from "discord.js";

import { logger } from "../../main.ts";

import { Roles, StickFlags } from "../../exports/dataExports.ts";
import { getRole } from "../../exports/functionExports.ts";
import createListenerOverwrites from "../../functions/createListenerOverwrites.ts";
import cleanupStickSession from "../../functions/cleanupStickSession.ts";

// dont remove mute overwrite to avoid join/leave spam abuse, only clear on Stick-Session end

/**
 * Handler for the VoiceStateUpdate event. Ensures up-to-date server-mute state if a user leaves during a Stick session.
 * @param oldState The previous {@link VoiceState} in the interaction.
 * @param newState The new {@link VoiceState} in the interaction.
 */
export default async function handleVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
    const member = newState.member;

    if (!member) {
        logger.error(`Missing member in newState (handleVoiceStateUpdate):\n${JSON.stringify(newState, null, 4)}`);
        return;
    }

    const guild = newState.guild;
    const channel = newState.channel;
    
    // this might get really slow...?
    const activeRole = await getRole(guild, Roles.TSActive);
    if (!activeRole) return;

    const newStateActiveOverwrites = channel?.permissionOverwrites.cache.get(activeRole.id);
    const oldActive = oldState.channel?.permissionOverwrites.cache.get(activeRole.id)?.allow.has(StickFlags.ACTIVE_MAGIC);
    const newActive = newStateActiveOverwrites?.allow.has(StickFlags.ACTIVE_MAGIC);

    // return if
        // the user did not change channels
        // the user was not in a channel and joins a non stick-session
        // the user was not in a stick-session and leaves
        // the user was not in a stick session and joins another non stick-session
    if (
        (oldState.channelId === newState.channelId) ||
        (!oldActive && !channel) ||
        (!oldActive && !newActive)
    ) return;

    // if the user leaves a stick session channel and was a stick holder and there are no more stick holders, end the session
    if (oldActive && oldState.channel) {
        const wasHolder = (oldState.channel?.permissionOverwrites.cache.get(member.id)?.allow.bitfield ?? 0n) & (StickFlags.VOICE_MAGIC);
        const remainingHolders = oldState.channel?.permissionOverwrites.cache.filter((overwrite) => (overwrite.allow.bitfield & StickFlags.VOICE_MAGIC) !== 0n);

        if (wasHolder && remainingHolders.size === 1) {
            try {
                await cleanupStickSession(oldState.channel);
                await oldState.channel.send({ embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: "Stick Session Ended", iconURL: oldState.channel.client.user.displayAvatarURL() })
                        .addFields({
                            name: `Last Stick Holder <@${newState.member.id}> left ${oldState.channel.name}`,
                            value: "Therefore, the Stick-Session has ended. You may now talk freely."
                        })
                        .setColor(Colors.Green)
                ]});
            } catch (err) {
                logger.error(`Couldn't cleanup Stick-Session of ${oldState.channel.name} in ${oldState.guild.name}:\n${err}`);
            }
        }
    }

    // if the user joins a stick session and the channel doesn't yet have overwrites for them, add them
    if (newActive && channel) {
        const memberOverwrites = channel?.permissionOverwrites.cache.get(member.id);
        const isManaged = ((memberOverwrites?.allow.bitfield ?? 0n) | (memberOverwrites?.deny.bitfield ?? 0n)) & StickFlags.VOICE_MAGIC;

        if (!isManaged) {
            try {
                await channel.permissionOverwrites.create(
                    member,
                    createListenerOverwrites(channel, member) as PermissionOverwriteOptions
                );
            } catch (err) {
                logger.error(`Couldn't create permission overwrite for ${newState.channel.name} in ${newState.guild.name}:\n${err}`);
            }
        }

        return;
    }
}