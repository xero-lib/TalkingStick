import { EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { developer } from "../exports/configExports.js";
import { hasRoles, findRole, someRole, datedErr } from "../exports/functionExports.js";

// import "../prototypes/tempSend.js";
// import "../prototypes/tempReply.js";

/**
 * @param {ChatInputCommandInteraction} interaction 
 */

export default async function (interaction) {
    if (hasRoles(interaction.guild) && hasRoles(interaction.member)) {
        if (
            someRole(interaction.guild, "Stick Holder" ||
            interaction.member.permissions.has(8) ||
            someRole(interaction.member, "Stick Controller") ||
            interaction.member.id === developer.id)
        ) {
            let member = interaction.options.getMember("stick-holder");
            const tsremstickEmbed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.username, iconURL: interaction.member.displayAvatarURL() })
                .setColor("Red");
            if (interaction.member.voice.channel && interaction.member.voice.channel !== member.voice.channel)
                tsremstickEmbed.addFields([{ name: "TSRemStick", value: `${member.user.tag} is not in the voice channel.` }]);
            else if (!interaction.member.voice.channel && !member.voice.channel) {
                if (someRole(member, "Stick Holder"))
                    member.roles.remove(findRole(member, "Stick Holder")).catch(datedErr);
                else {
                    tsremstickEmbed.addFields([{ name: "TSRemStick", value: `${member.user.tag} is not a Stick Holder` }]);
                    interaction.reply({ embeds: [tsremstickEmbed] }).catch(datedErr);
                }
            }
            if (member.voice.channel === interaction.member.voice.channel) {
                member.roles.remove(findRole(interaction.guild, "Stick Holder")).catch(datedErr);
                member.voice.setMute(true).catch(datedErr);
            } else if (someRole(member, "Stick Holder")) {
                member.roles.remove(findRole(member, "Stick Holder")).catch(() =>
                    interaction.reply({ content: "In order for Talking Stick to work properly, you must drag the \`Talking Stick\` role to the top of the list in server settings.", ephemeral: false }).catch(datedErr)
                );
                tsremstickEmbed.addFields([{ name: "Took Stick", value: `Took stick from ${member.user.username}` }]);
                interaction.reply({ embeds: [tsremstickEmbed] }).catch(datedErr);
            }
        } else interaction.reply({ content: "You do not have permission to do this.", ephemeral: false }).catch(datedErr);
    } else interaction.reply({ content: `Please run \`/tsinit\` to create all required roles.`, ephemeral: false }).catch(datedErr);
}
