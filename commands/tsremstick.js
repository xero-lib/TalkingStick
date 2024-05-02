import { EmbedBuilder, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import { developer } from "../exports/configExports.js";
import { hasRoles, findRole, someRole, datedErr } from "../exports/functionExports.js";

// import "../prototypes/tempSend.js";
// import "../prototypes/tempReply.js";

/**
 * @param {ChatInputCommandInteraction} interaction 
 */

export default async function (interaction) {
    if (!hasRoles(interaction.guild)) {
        interaction.reply("Server does not have Talking Stick roles. Please run `/tsinit`.").catch(datedErr); 
        return;
    }

    if (
        hasRoles(interaction.guild) && 
        (
            interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) ||
            interaction.member.id === developer.id
        )
    ) {
        let holder_role = findRole(interaction.guild, "Stick Holder");
        let member = interaction.options.getMember("stick-holder");

        const tsremstickEmbed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.member.displayAvatarURL() })
            .setColor("Red");
        if (interaction.member.voice.channel && interaction.member.voice.channel !== member.voice.channel) {
            tsremstickEmbed.addFields([{ name: "TSRemStick", value: `${member.user.tag} is not in the voice channel.` }]);
        } else if (!interaction.member.voice.channel && !member.voice.channel) {
            if (someRole(member, "Stick Holder")) {
                member.roles.remove(holder_role).catch(datedErr);
            } else {
                tsremstickEmbed.addFields([{ name: "TSRemStick", value: `${member.user.tag} is not a Stick Holder` }]);
                interaction.reply({ embeds: [tsremstickEmbed] }).catch(datedErr);
            }
        }

        if (member.voice.channel === interaction.member.voice.channel) {
            member.roles.remove(holder_role).catch(datedErr);
            member.voice.setMute(true).catch(datedErr);
        } else if (someRole(member, "Stick Holder")) {
            member.roles.remove(holder_role).then(() => interaction.reply({ embeds: [tsremstickEmbed] }).catch(datedErr)).catch(() =>
                interaction.reply({ content: "In order for Talking Stick to work properly, you must drag the \`Talking Stick\` role to the top of the list in server settings.", ephemeral: false }).catch(datedErr)
            );
        }
    } else {
        interaction.reply({ content: "You do not have permission to do this.", ephemeral: false }).catch(datedErr);
    }
}
