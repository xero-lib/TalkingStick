import chalk from "chalk";
import { EmbedBuilder, ChatInputCommandInteraction } from "discord.js"
import { date } from "../../exports/functionExports.js";
import { CommandMap } from "../../exports/functionExports.js";
import { client, developer } from "../../exports/configExports.js";

// import "../../prototypes/tempSend.js";
// import "../../prototypes/tempReply.js";

/**
 * @param {ChatInputCommandInteraction} interaction
 * @returns {void}
 */

export default async function (interaction) {
    if (!interaction.isChatInputCommand()) { return }

    if (interaction.guild) {
        CommandMap[interaction.commandName](interaction);
    } else {
        let relatedServers = [];

        client.guilds.cache.map((g) => g.members.cache.map((m) => { if (m.id == interaction.author.id) relatedServers.push(g.name) }));
        console.log(date(), chalk.green("Related Servers to bot:\n") + relatedServers.join('\n'));
        let related = relatedServers.join('\n');

        const dmEmbed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.author.tag} (${interaction.author.id})`, iconURL: interaction.author.avatarURL() })// .setFooter({ text: }`${Date.prototype.getHours()}:${Date.prototype.getMinutes()}:${Date.prototype.getSeconds()}` })
            .setDescription(interaction.content);

        if (interaction.attachments) {
            interaction.attachments.forEach(a => dmEmbed.attachFiles(a));
            interaction.attachments.forEach(a => (a.height || a.width) && (!dmEmbed.image) ? dmEmbed.setImage(a.url) : {});
        } else if (related) {
            dmEmbed.addFields({ name: "Servers", value: related });
        } else {
            dmEmbed.addFields({ name: "Servers", value: "None found." });
        }

        developer.send(dmEmbed)
            .then(() => interaction.react("✅"))
            .catch((e) => {
                console.error(date(), `Error sending message from ${interaction.author.username}#${interaction.author.discriminator} (${interaction.author.id}):`, e)
                interaction.channel.send("There was an error sending the message, try again in a little while, add Thoth#6134, or join the support server: https://discord.gg/Jxe7mK2dHT");
            });
    }
}