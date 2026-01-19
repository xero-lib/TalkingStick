import { EmbedBuilder } from "discord.js";

import { logger } from "../main.ts";
import { ValidInteraction } from "../exports/dataExports.ts";
import { developer } from "../exports/configExports.ts";
import { replyEphemeral, replySafe } from "../exports/functionExports.ts";

/**
 * Allows the bot to send a message to a given user if they have DMd the bot
 * @param interaction The interaction to operate on.
 * @throws If an interaction reply or `developer.send` fails.
 */
export default async function sendMessage(interaction: ValidInteraction) {
    const client = interaction.client;
    const message = interaction.options.get("message")?.value
    if (!(typeof message === "string")) {
        await replySafe(interaction, "No message provided.");
        return;
    }

    const id = interaction.options.getString("id");
    if (!id) {
        await replySafe(interaction, "No user ID provided.");
        return;
    }

    const target = await client.users.fetch(id).catch((err) => {
        logger.error(`Failed to fetch user ID ${id}:\n${err}`);
        return null;
    });

    if (!target) {
        await replySafe(interaction, `Failed to fetch ${id}.`);
        return;
    }

    const sendEmbedBuilder = new EmbedBuilder()
        .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.avatarURL() ?? interaction.member.displayAvatarURL()
        })
        .setDescription(message)
        .setFooter({ text: "This message is from the bot developer.", iconURL: client.user.displayAvatarURL() })
    ;
    
    try {
        await client.users.send(id, { embeds: [sendEmbedBuilder] });
        sendEmbedBuilder
            .setAuthor({
                name: `To ${target.username} (${target.id})`,
                iconURL: target.avatarURL() ?? target.displayAvatarURL()
            })
        ;

        await developer.send({ embeds: [sendEmbedBuilder] });

        await replyEphemeral(interaction, `Successfully sent message to ${target.username} (${target.id}). A copy of this message has been sent via the bot to your DMs.`);
    } catch (err) {
        logger.debug(`There was an error sending the message to ${target.username} (${target.id}):\n${err}`);
        await replyEphemeral(interaction, `There was an error sending the message to ${target.username} (${target.id}). Most likely not in a mutual server.`);
    }
}
