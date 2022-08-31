import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { datedErr } from "../exports/functionExports.js";
import { defaultPrefix as prefix, client, developer } from "../exports/configExports.js";

import "../prototypes/tempReply.js";

/**
 * @param {ChatInputCommandInteraction} interaction 
 * @param {string} args 
 * @param {string} command 
 * @returns {void}
 */

export default async function (interaction) { //BIG WIP
    let msgSend = interaction.options.get("message")?.value; //WIP
    let sentUser = client.users.cache.get(args);
    const sendEmbedBuilder = new EmbedBuilder()
        .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL() })
        .setDescription(msgSend);
    
    if (sentUser) {
        sentUser.send({ embeds: [sendEmbedBuilder] }).then(() => {
            sendEmbedBuilder
                .setAuthor({ name: `From ${interaction.user.tag} to ${sentUser.tag} (${sentUser.id})`, iconURL: developer.avatarURL() })
                .setTitle(`Sent to ${sentUser.tag} (${sentUser.id})`)
                .setThumbnail(sentUser.avatarURL());
            interaction.reply({ content: `Successfully sent message to ${sentUser.tag} (${args})`, ephemeral: true }).catch(datedErr);
            developer.send({ embeds: [sendEmbedBuilder] }).catch(datedErr);
        }).catch((e) => {
            datedErr(`There was an error sending the message to ${sentUser.tag} (${args})\n` + e);
            interaction.reply({ content: `There was an error sending the message to ${sentUser.tag} (${args})\n \`\`\`\n${e}\n\`\`\``, ephemeral: true }).catch(datedErr);
        });
    } else {
        datedErr(`Could not send message to ${args} as they are most likely not in the cache.`);
        interaction.reply({ content: `Unable to send message to ${args}`, ephemeral: true }).catch((e) => datedErr(`Unable to alert ${interaction.user.tag} of sendMessage error: `, e));
    }
}
