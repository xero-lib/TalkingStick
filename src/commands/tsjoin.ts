import { EmbedBuilder, PermissionFlagsBits, Colors, Collection, OverwriteType } from "discord.js";

import { logger } from "../main.ts";

import { getRole, hasRole, replySafe, replyEphemeral } from "../exports/functionExports.ts";
import { Roles, StickFlags, ValidInteraction, OverwriteManager } from "../exports/dataExports.ts";

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
        member.permissions.any([PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.MuteMembers]) ||
        await hasRole(member, Roles.StickController)
    )) {
        await replySafe(interaction, "You do not have permission to start a Stick-Session."); 
        return;
    }

    const everyoneRole = interaction.guild.roles.everyone;

    const channelType = interaction.options.get("channel-type")?.value; // resolve the requested channel type

    // should be impossible for the API to omit a channel-type value, or allow a non- "voice" | "text" value
    if (!["voice", "text"].includes(channelType?.toString() ?? "")) return; 

    const isVoice = channelType === "voice";
    const channel = isVoice ? member.voice.channel : interaction.channel;

    if (!channel) {
        await replyEphemeral(interaction, "You need to join a voice channel first!");
        return;
    }

    // if the role wasn't found, which should be impossible given we check in handleInteractionCreate
    const activeRole = await getRole(interaction.guild, Roles.TSActive).catch(() => undefined);
    if (!activeRole) {
        // then log the event and reply to the user that roles weren't found, and return.
        logger.error("Reached theoretically impossible state in tsjoin: nonexistent roles after confirmation of initialization.")
        await replyEphemeral(interaction, "Unable to find critical roles. Please run the `tsinit` command."); 

        return;
    }

    if (channel.permissionOverwrites.cache.get(activeRole.id)?.allow.has(StickFlags.ACTIVE_MAGIC)) {
        await replyEphemeral(interaction, `There is already an active Stick-Session in <#${channel.id}>.`);
        return;
    }

    const oldOverwrites = channel.permissionOverwrites;
    const newOverwrites: Collection<string, OverwriteManager> = new Collection(
        oldOverwrites.cache.map((overwrite) =>
            [
                overwrite.id,
                new OverwriteManager(isVoice, overwrite)
            ]
        )
    );

    // set channel magic to track Stick-Session
    newOverwrites.set(
        activeRole.id,
        new OverwriteManager(
            isVoice,
            {
                id: activeRole.id,
                type: OverwriteType.Role,
                allow: StickFlags.ACTIVE_MAGIC,
                deny: 0n
            }
        )
    );


    const initiatorOverwrites = new OverwriteManager(
        isVoice,
        oldOverwrites.cache.get(member.id) ?? { id: member.id, type: OverwriteType.Member }
    );

    initiatorOverwrites.giveStick();

    newOverwrites.set(member.id, initiatorOverwrites);

    // manually mute admins?

    // set @everyone role to SendMessages: false. If certain roles have explicit send permissions, ask and track
    const everyoneOverwrites = new OverwriteManager(isVoice, oldOverwrites.cache.get(everyoneRole.id) ?? { id: everyoneRole.id, type: OverwriteType.Role });
    everyoneOverwrites.initListener();

    newOverwrites.set(everyoneRole.id, everyoneOverwrites)

    const skipIds = [interaction.client.user.id, member.id, activeRole.id, everyoneRole.id];
    for (const [id, _overwrite] of newOverwrites) {
        if (skipIds.includes(id)) continue;
        newOverwrites.get(id)?.initListener();
    }

    // if voice channel, apply for all users currently in the channel
    if (isVoice) for (const [id, _member] of channel.members) {
        if (newOverwrites.has(id) || skipIds.includes(id)) continue;

        const memberOverwrites = new OverwriteManager(isVoice, { id, type: OverwriteType.Member});
        memberOverwrites.initListener()

        newOverwrites.set(id, memberOverwrites);
    }

    const overwrites = new Collection(newOverwrites.map((overwrite, id) =>
        [
            id,
            overwrite.toOverwriteData()
        ]
    ));

    try {
        await channel.permissionOverwrites.set(overwrites);
    } catch (err) {
        logger.error(`(${channelType}) Could not update permissions of ${channel.name} in ${interaction.guild.name} requested by ${interaction.user.username} (${member.id}):\n${err}`);
        await replySafe(interaction, `Talking Stick was unable to update the permissions of <#${channel.id}>. Please ensure Talking Stick has Administrator permissions.`);

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
                    .setDescription(`<@${member.id}> has the Talking Stick! Currently in <#${channel.id}>`)
                    .setFooter({ text: `To pass the Talking Stick, use the \`tspass ${channelType} @recipient\` command.` })
            ]
        }
    );
}
