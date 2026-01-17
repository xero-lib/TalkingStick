import { Colors, EmbedBuilder, GuildMember, OverwriteData, PermissionFlagsBits } from "discord.js";

import { logger } from "../index";
import { Roles } from "../data/Roles";
import { ValidInteraction } from "../data/ValidInteraction";
import { getRole, hasRole } from "../exports/functionExports";
import replyEphemeral from "../functions/replyEphemeral";
import replySafe from "../functions/safeReply";
import { StickFlags } from "../data/StickFlags";

/**
 * Removes the Stick Holder role from a given user, if they have permission to do so.
 * @param interaction The interaction to operate on (must have `guild` and `member` properties present).
 */
export default async function remstick(interaction: ValidInteraction) {
    // if the interaction initiator is not an admin mor has the Stick Controller role
    if (!(
        interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
        await hasRole(interaction.member, Roles.StickController)
    )) {
        // then reply that the user doesn't have the necessary permission and return from the function
        await replyEphemeral(interaction, "You do not currently have permission to use this command. Ask an administrator for the Stick Controller role.");
        return;
    }

    const controllerRole = await getRole(interaction.guild, Roles.StickController);
    const activeRole     = await getRole(interaction.guild, Roles.TSActive       );

    // if any of the roles weren't found, which should be impossible given we check in handleInteractionCreate
    if (!(controllerRole && activeRole)) {
        // then log the event and reply to the user that roles weren't found, and return.
        logger.error("Reached theoretically impossible state in tsremstick: nonexistent roles after confirmation of initialization.")
        await replyEphemeral(interaction, "Unable to find critical roles. Please run `tsinit`."); 

        return;
    }
    
    const channelType = interaction.options.getString("channel-type", true);

    // then the member has permission to have executed the tsremstick command
    let target = interaction.options.getMember("stick-holder"); // get the member submitted by the interaction initiator to remove Stick Holder from

    if (!(target instanceof GuildMember)) {
        const user = interaction.options.getUser("stick-holder", true);
        try {
            target = await interaction.guild.members.fetch(user.id);
        } catch (e) {
            logger.error(`Encountered an error attempting to fetch ${user.username} (${user.id}) in guild ${interaction.guild.name}: ${e}`);
            await replyEphemeral(interaction, "Unable to fetch member. If this issue persists, please contact the bot developer.");

            return;
        }
    }

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

    if (!channel) {
        await replyEphemeral(interaction, `<@${target.id}> is not in a voice channel.`);
        return;
    }
    
    if (!channel.permissionOverwrites.cache.get(activeRole.id)?.allow.has(StickFlags.ACTIVE_MAGIC)) {
        await replyEphemeral(interaction, `There is not a Stick-Session active in <#${channel.name}>`);
        return;
    }

    const targetOverwrites = channel.permissionOverwrites.cache.get(target.id);


    if (!targetOverwrites || !targetOverwrites.allow.has(BOT_MAGIC)) {
        await replyEphemeral(interaction, `<@${target.id}> is not a Stick Holder.`);
        return;
    }

    // if the target member is an admin but the bot is not, the bot cannot update or modify roles or server-mute
    if (
        target.permissions.has(PermissionFlagsBits.Administrator)
        && !interaction.guild.members.cache.get(interaction.client.user.id)?.permissions.has(PermissionFlagsBits.Administrator)
    ) {
        await replyEphemeral(interaction, `<@${target.id}> is an Administrator of ${interaction.guild.name}. For Talking Stick to work properly with admins, it must be given administrative privileges.`);
        return;
    }

    // try to defer so we can exceed the 3-second interaction window
    try {
        await interaction.deferReply();
    } catch (err) {
        logger.error(`tsremstick deferReply received error: ${err}`);
    }


    try {
        // await target.roles.remove(holderRole);
        await channel.permissionOverwrites.create(
            target,
            {
                allow: targetOverwrites.allow.bitfield & ~BOT_MAGIC & ~CommunicatePermission,
                deny : targetOverwrites.deny.bitfield | BOT_MAGIC | CommunicatePermission,
            } as OverwriteData as any
        );

    } catch (err) {
        logger.error(`Failed to remove Stick Holder role from ${target.user.username} (${target.id}): ${err}`);
        await replySafe(interaction, `Failed to take the stick from the <@${target.id}>.`);

        return;
    }
    
    await replySafe(
        interaction,
        {
            embeds:
                [
                    new EmbedBuilder()
                        .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
                        .setColor(Colors.Red)
                        .addFields({
                            name: "Remove Stick",
                            value: `<@${target.id}> no longer has a Stick.`
                        })
                        .setFooter({ text: `${target.displayName}'s Stick has been taken.`, iconURL: target.displayAvatarURL() })
                ]
        }
    );
}
