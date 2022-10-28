import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { developer, } from "../exports/configExports.js";
import { someRole, findRole, hasRoles, date, datedErr } from "../exports/functionExports.js";

// import "../prototypes/tempReply.js";

/**
 * @param {ChatInputCommandInteraction} interaction
 * @returns {void}
 */

export default async function (interaction) {
    let member = interaction.options.getMember("recipient");
    if(hasRoles(interaction.member)) {
        if (
            interaction.member.permissions.has(PermissionFlagsBits.Flags.Administrator) ||
            someRole(interaction.member, "Stick Controller") ||
            interaction.member.id == developer.id
        ) {
            if (interaction.member.voice.channel && !member.voice.channelId) {
                /*if the executor is in a voice channel but the mentioned member is not */
                interaction.reply({ content: `${member.voice.channelId} is not in your voice channel.`, ephemeral: true }).catch(datedErr);
            }
            else if (interaction.member.voice.channel && member.voice.channelId == interaction.member.voice.channelId) {
                member.roles
                    .add(
                        findRole(
                            interaction.guild,
                            "Stick Holder"
                        )
                    ).catch((err) =>
                        datedErr(`Could not add the Stick Holder role to ${member.user.tag} (${member.user.id}) by ${interaction.member.user.tag} (${interaction.member.id}) in ${interaction.guild.name}:`, err));
                member.voice
                    .setMute(false)
                    .catch((err) =>
                        datedErr(`Could not unmute ${member.user.tag} (${member.id}) by ${interaction.member.user.tag} (${interaction.member.id}) in ${interaction.guild.name}:`, err)
                    );
            } /*todo*/ // else if (!interaction.member.voice.channelId && !membervoice.channelId) 
        } else interaction.reply({ content: "You do not have permission to do this.", ephemeral: true }).catch(datedErr);
    } else interaction.reply({ content: `Please run \`/tsinit\` to create all required roles.`, ephemeral: true }).catch(datedErr);
}