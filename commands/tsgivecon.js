import { EmbedBuilder, ChatInputCommandInteraction, PermissionsBitField } from "discord.js"
import { findRole, datedErr } from "../exports/functionExports.js";
import { developer } from "../exports/configExports.js";

// import "../prototypes/tempSend.js";
// import "../prototypes/tempReply.js";

/**
 * @param {ChatInputCommandInteraction} interaction
 * @returns {void}
 */

export default async function tsgivecon(interaction) {
    if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.member.id === developer.id) {
        const tsgiveconEmbed = new EmbedBuilder();
        let controller_role = findRole(interaction.guild, "Stick Controller");

        if (controller_role) {
            tsgiveconEmbed
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
                .setColor("Green")
                .setTitle(`TSGiveCon executed by ${interaction.user.tag}`);
            interaction.options.getMember("recipient").roles.add(controller_role)
                .then(() => {
                    tsgiveconEmbed.addFields([{ name: "TSGiveCon:", value: `${interaction.options.getMember("recipient").user.tag} has been given Stick Controller` }])
                    interaction.reply({ embeds: [tsgiveconEmbed], ephemeral: true }).catch(datedErr);
                })
                .catch((e) => {
                    datedErr("Error in tsgivecon:", e);
                    interaction.reply({ content: "In order for Talking Stick to work properly, you must drag the \`Talking Stick\` role to the top of the list in server settings.", ephemeral: false }).catch(datedErr);
                });
        } else {
            interaction.reply({ content: `Please run \`/tsinit\` to create all required roles.`, ephemeral: false }).catch(datedErr);
            datedErr(`Unable to find all roles in ${interaction.guild.name}(${interaction.guildId}): Controller: ${!!controller_role}`);
        }
    } else interaction.reply({ content: "You do not have permission to do this.", ephemeral: false }).catch(datedErr);
}