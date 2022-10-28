import { ChatInputCommandInteraction, EmbedBuilder, User } from "discord.js";
import { datedErr } from "../exports/functionExports.js";
import { client, developer } from "../exports/configExports.js";

import "../prototypes/tempReply.js";

/**
 * @param {ChatInputCommandInteraction} interaction 
 * @returns {void}
 */

export default async function (interaction) { //BIG WIP
    let msgSend = interaction.options.get("message")?.value
    // let sentUser = client.users.cache.get(interaction.options.get("id")?.value);
    let sentUser = await client.users.fetch(interaction.options.getString("id")).catch(() => {
        interaction.reply(`User with ID ${sentUser.id} not found.`)
    })
    let sender = interaction.user;

    const sendEmbedBuilder = new EmbedBuilder()
        .setAuthor({
            name: `${sender.tag} (Bot Owner and Lead Developer)`,
            iconURL: sender.avatarURL()
        })
        .setDescription(msgSend);
        
    client.users.send(interaction.options.getString("id"), { embeds: [sendEmbedBuilder] }).then(() => {
        sendEmbedBuilder
            .setAuthor({
                name: `From ${sender.tag} to ${sentUser.tag} (${sentUser.id})`,
                iconURL: developer.avatarURL()
            })
            .setTitle(`Sent to ${sentUser.tag} (${sentUser.id})`)
            .setThumbnail(sentUser.avatarURL());
        interaction.reply({
            content: `Successfully sent message to ${sentUser.tag} (${sentUser.id})`,
            ephemeral: true
        }).catch(datedErr);
        developer.send({
            embeds: [sendEmbedBuilder]
        }).catch(datedErr);
    }).catch((e) => {
        datedErr(`There was an error sending the message to ${sentUser.tag} (${sentUser.id})\n` + e);
        interaction.reply({
            content: `There was an error sending the message to ${sentUser.tag} (${sentUser.id}). Most likely not in a mutual server.`,
            ephemeral: true
        }).catch(datedErr);
    });
}
