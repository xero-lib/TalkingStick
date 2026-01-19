import { Message, EmbedBuilder, Attachment, DMChannel } from "discord.js"

import { logger } from "../../main.ts";

import { developer } from "../../exports/configExports.ts";

/**
 * Handler for MessageCreate event.
 * @param message The {@link Message} passed by the event listener.
 * @throws If developer or channel send fails.
 */
export default async function handleMessageCreate(message: Message) {
    const channel = message.channel;
    if (!(channel instanceof DMChannel) || message.author.bot) return;

    const user = message.author;
    const relatedGuilds = message.client.guilds.cache.filter((g) => g.members.cache.has(user.id)).map((g) => g.name).join('\n');

    try {
        await developer.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `${user.username} (${user.id})`, iconURL: user.displayAvatarURL() })// .setFooter({ text: `${Date.prototype.getHours()}:${Date.prototype.getMinutes()}:${Date.prototype.getSeconds()}` })
                    .setDescription(message.content)
                    .addFields([{ name: "Mutual Servers", value: relatedGuilds ?? "None Found"}])
            ],
            files: message.attachments.map((value: Attachment) => value)
        });

        await message.react('✅');
    } catch (err) {
        logger.error(`Error sending message from ${message.author.username} (${message.author.id}):\n${err}`);
        await channel.send("There was an error sending the message. Try again in a little while, add `_thoth` on Discord, or join the [support server](https://discord.gg/Jxe7mK2dHT).");
    }
}