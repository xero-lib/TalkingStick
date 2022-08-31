import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { someRole, findRole, datedErr } from "../exports/functionExports.js";
import { developer } from "../exports/configExports.js";

/**
 * @param {ChatInputCommandInteraction} interaction
 */

export default async function (interaction) {
    if (interaction.member.permissions.has(8) || interaction.member.id == developer.id) {
        let member = interaction.options.getMember("stick-controller");
        if (someRole(interaction.guild, "Stick Controller")) {
            if (someRole(member, "Stick Controller")) {
                member.roles.remove(findRole(interaction.guild, "Stick Controller")).then(() => {
                    interaction.reply({
                        embeds: [new EmbedBuilder()
                            .setAuthor({ name: interaction.author.username, iconURL: interaction.author.avatarURL() })
                            .setColor("Red")
                            .setTitle("**Stick Controller Removed**")
                            .addFields({ name: "Controller removed from:", value: member.user.tag })
                            .setDescription(`Stick Controller permissions have been removed from ${member.displayName} by ${interaction.author.tag}`)
                        ]
                    });
                })
                .catch((e) => datedErr("Error in tsremcon: cannot remove role:", e));
            } else interaction.reply({ content: `${member.displayName} does not have Stick Controller.`, ephemeral: true }).catch(datedErr);
        } else interaction.reply({ content: `Stick Controller not found. Please run \`/tsinit\` to create all required roles before attempting to use Talking Stick.`, ephemeral: false }).catch(datedErr);
    } else interaction.reply({ content: "You do not have permission to do this.", ephemeral: false }).catch(datedErr);
}
