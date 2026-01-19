import { Colors, EmbedBuilder, OverwriteType, PermissionOverwriteOptions, VoiceState } from "discord.js";

import { logger } from "../../main.ts";

import { OverwriteManager, Roles, StickFlags } from "../../exports/dataExports.ts";
import { getRole } from "../../exports/functionExports.ts";
import cleanupStickSession from "../../functions/cleanupStickSession.ts";

// dont remove mute overwrite to avoid join/leave spam abuse, only clear on Stick-Session end
// could probably use some optimization

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
    const newChannel = newState.channel;
    const oldChannel = oldState.channel;
    
    // this might get really slow...?
    const activeRole = await getRole(guild, Roles.TSActive);
    if (!activeRole) return;

    const newStateActiveOverwrites = new OverwriteManager(true, newChannel?.permissionOverwrites.cache.get(activeRole.id) ?? { id: activeRole.id, type: OverwriteType.Role });
    const oldStateActiveOverwrites = new OverwriteManager(true, oldChannel?.permissionOverwrites.cache.get(activeRole.id) ?? { id: activeRole.id, type: OverwriteType.Role });

    const oldActive = oldStateActiveOverwrites.isActiveSession();
    const newActive = newStateActiveOverwrites.isActiveSession();


    // return if
        // the user did not change channels
        // the user was not in a channel or a non stick-session and joins a non stick-session
        // the user was not in a stick-session and leaves
        // the user was not in a stick session and joins another non stick-session

    if (
        (oldState.channelId === newState.channelId) ||
        (!oldActive && !newChannel) ||
        (!oldActive && !newActive)
    ) return;


    // if the user leaves a stick session channel and was a stick holder and there are no more stick holders, end the session
    if (oldChannel && oldActive) {
        const oldChannelMemberOverwrites = new OverwriteManager(true, oldChannel.permissionOverwrites.cache.get(member.id) ?? { id: member.id, type: OverwriteType.Member });
        const remainingHolders = oldChannel.permissionOverwrites.cache.filter((overwrite) => (overwrite.allow.bitfield & StickFlags.VOICE_MAGIC) !== 0n);

        if (oldChannelMemberOverwrites.hasStick() && remainingHolders.size === 1) {
            try {
                await cleanupStickSession(oldState.channel);
                await oldState.channel.send({ embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Green)
                        .setAuthor({ name: "Stick Session Ended", iconURL: oldState.channel.client.user.displayAvatarURL() })
                        .setDescription(`<@${newState.member.id}> left <#${oldState.channel.id}>, so the Stick-Session has ended. You may now talk freely.`)
                ]});
            } catch (err) {
                logger.error(`Couldn't cleanup Stick-Session of ${oldState.channel.name} in ${oldState.guild.name}:\n${err}`);
            }
        }
    }

    // if the user joins a stick session and the channel doesn't yet have overwrites for them, add them
    if (newChannel && newActive) {
        const memberOverwrites = new OverwriteManager(true, newChannel?.permissionOverwrites.cache.get(member.id) ?? { id: member.id, type: OverwriteType.Member });
        if (!memberOverwrites.isManaged()) {
            memberOverwrites.initListener();
            try {
                await newChannel.permissionOverwrites.create(
                    member,
                    memberOverwrites.toOverwriteData() as PermissionOverwriteOptions
                );
            } catch (err) {
                logger.error(`Couldn't create permission overwrite for ${newState.channel.name} in ${newState.guild.name}:\n${err}`);
            }
        }

        return;
    }
}