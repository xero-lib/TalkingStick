import { EmbedBuilder, GuildMember, Colors, PermissionFlagsBits } from "discord.js"

import { logger } from "../main.ts";

import { Roles } from "../exports/dataExports.ts";
import { getRole, hasRole, replyEphemeral, replySafe } from "../exports/functionExports.ts";
import { ValidInteraction } from "../exports/dataExports.ts";

/**
 * Gives a particular user the Stick Controller role.
 * @param interaction The interaction to operate on.
 * @throws If an interaction reply failed.
 */
export default async function tsgivecon(interaction: ValidInteraction) {
    if(!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
        await replyEphemeral(interaction, "You do not have permission to do this.");
        return;
    }

    const controllerRole = await getRole(interaction.guild, Roles.StickController);

    // if the controller role wasn't found, which should be impossible given we check in handleInteractionCreate
    if (!controllerRole) {
        // then log the event and reply to the user that roles weren't found, and return.
        logger.error("Reached theoretically impossible state in tsgivecon: nonexistent roles after confirmation of initialization.")
        await replySafe(interaction, "Unable to find critical roles. Please run `tsinit`."); 

        return;
    }

    const target = interaction.options.getMember("recipient");
    if (!(target instanceof GuildMember)) {
        logger.warn(`Unable to resolve user ${(target?.nick ?? "") + target ? " " : ""}in ${interaction.guild.name}.`);
        await replyEphemeral(interaction, "Unable to resolve user. Please wait a moment and try again.");

        return;
    }

    if (await hasRole(target, Roles.StickController)) {
        await replyEphemeral(interaction, `<@${target.id}> is already a Stick Controller.`)
    }
    
    try {
        await target.roles.add(controllerRole);
    } catch (e) {
        logger.error(`Encountered error in tsgivecon while adding Stick Controller to ${target.user.username} (${target.id}): ${e}`);
        await replySafe(interaction, "Talking Stick was unable to give you the Stick Holder role. Please ensure Talking Stick as Administrator permissions.");

        return;
    }

    await replyEphemeral(
        interaction,
        {
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
                    .setColor(Colors.Green)
                    .setTitle("Stick Controller Given")
                    .addFields([{ name: `${interaction.member.displayName} gave Stick Controller`, value: `to ${target.displayName}` }])
            ]
        }
    );
}