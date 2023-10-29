import chalk from "chalk"; //have to import like this due to chalk being done entirely in module.exports
import { EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { client, developer } from "../exports/configExports.js";
import { datedErr } from "../exports/functionExports.js";

// import "../prototypes/tempReply.js";

/**
 * @param {ChatInputCommandInteraction} interaction
 */

export default async function (interaction) {
    let owner = await interaction.guild.fetchOwner();
    const dnwEmbed = new EmbedBuilder()
        .setTitle("__DNW Report__")
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
        .setDescription(interaction.options.getString("message"))
        .addFields(...[
            {
                name: "Server Name",
                value: interaction.guild.name
            },
            {
                name: "Join Date",
                value: `${interaction.guild.joinedAt}`
            },
            {
                name: "Owner",
                value: `${owner.user.tag} (${owner.id})`
            },
            {
                name: "User Count",
                value: `${interaction.guild.memberCount}`
            },

        ])
        .setImage(interaction.guild.iconURL())
        .setColor("Red")        
        ;

    developer.send({ embeds: [dnwEmbed] }).catch((e) => datedErr('\n' + interaction.user.tag + '\n' + chalk.bold(interaction.commandName) + '\n' + e));

    // message.delete().catch(() => datedErr("Message already deleted."));
    interaction.reply({ content: "Report sent, you will receive a friend request from Thoth#6134 as soon as he is available, or, join the support server: https://discord.gg/cJ77STQ", ephemeral: true}).catch(datedErr);
}
