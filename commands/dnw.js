import chalk from "chalk"; //have to import like this due to chalk being done entirely in module.exports
import { EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { developer } from "../exports/configExports.js";
import { datedErr } from "../exports/functionExports.js";

// import "../prototypes/tempReply.js";

/**
 * @param {ChatInputCommandInteraction} interaction
 */

export default async function (interaction) {
    const dnwEmbed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
        .setDescription(interaction.commandName)
        .setFooter({ text: interaction.createdTimestamp });

    developer.send(dnwEmbed).catch((e) => datedErr('\n' + interaction.user.tag + '\n' + chalk.bold(interaction.commandName) + '\n' + e));

    // message.delete().catch(() => datedErr("Message already deleted."));
    message.reply("Message sent. Please also send a DM with a server invite and a screenshot/description of any problems you're having to the bot. The developer will be with you as soon as possible.").catch(datedErr);
}
