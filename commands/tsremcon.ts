import { Colors, EmbedBuilder, GuildMember, PermissionFlagsBits } from "discord.js";

import { logger } from "../main.ts";

import { Roles, ValidInteraction } from "../exports/dataExports.ts";
import { hasRole, getRole, replyEphemeral, replySafe } from "../exports/functionExports.ts";

/**
 * Removes the Stick Controller role from a target member.
 * @param interaction The interaction to operate on.
 */
export default async function remcon(interaction: ValidInteraction) {
    // if the initiator isn't an administrator
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        logger.error("Reached theoretically impossible state in tsremcon, as this command should only be accessible by administrators on the client-level.");
        await replySafe(interaction, "You must be an administrator to use this command.");

        return;
    }

    let member = interaction.options.getMember("stick-controller");
    // if the retrieved member is not a GuildMember
    if (!(member instanceof GuildMember)) {
        const user = interaction.options.getUser("stick-controller", true);
        try {
            member = await interaction.guild.members.fetch(user.id);
        } catch (e) {
            logger.error(`Encountered an error attempting to fetch ${user.username} (${user.id}) in guild ${interaction.guild.name}: ${e}`);
            await replyEphemeral(interaction, "Unable to fetch member. If this issue persists, please contact the bot developer.");

            return;
        }
    }
    
    const controllerRole = await getRole(interaction.guild, Roles.StickController);
    if (!controllerRole) { 
        await replySafe(interaction, "Server does not have all Talking Stick roles. Please run `/tsinit`.");
        return;
    }

    if (!await hasRole(member, Roles.StickController)) {
        await replyEphemeral(interaction, `<@${member.id}> is not a Stick Controller.`);
        return;
    }

    await member.roles.remove(controllerRole);
    await replyEphemeral(
        interaction,
        {
            embeds:
            [
                new EmbedBuilder()
                    .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
                    .setColor(Colors.Red)
                    .setTitle("**Stick Controller Removed**")
                    .addFields([{ name: "Controller removed from:", value: `<@${member.id}>` }])
                    .setDescription(`Stick Controller permissions have been removed from ${member.displayName} by ${interaction.member.displayName}`)
            ]
        }
    );
}
