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
    
    if (message.author.id === developer.id && message.reference?.messageId) {
        const repliedTo = await message.channel.messages.fetch(message.reference.messageId);

        const senderId = repliedTo.embeds[0]?.author?.name.split("(").at(1)?.replace(")", "").trim();
        if (!senderId) {
            logger.error("Malformed sender ID: " + senderId);
            await message.reply("Malformed sender ID: " + senderId).catch(logger.error);
            return;
        }
        const client = message.client;
        const target = await client.users.fetch(senderId).catch((err) => {
            logger.error(`Failed to fetch user ID for inline developer reply ${senderId}:\n${err}`);
            return null;
        });

        if (!target) {
            await message.reply(`Failed to fetch user ID for inline developer reply \`${senderId}\`.`).catch(logger.error);
            return;
        }

        const sendEmbedBuilder = new EmbedBuilder()
            .setAuthor({
                name: developer.displayName,
                iconURL: developer.avatarURL() ?? developer.displayAvatarURL()
            })
            .setDescription(message.content)
            .setFooter({ text: "This message is from the bot developer.", iconURL: client.user.displayAvatarURL() })
        ;
        
        try {
            await client.users.send(senderId, { embeds: [sendEmbedBuilder] });
            sendEmbedBuilder
                .setAuthor({
                    name: `To ${target.username} (${target.id})`,
                    iconURL: target.avatarURL() ?? target.displayAvatarURL()
                })
            ;

            await developer.send({ embeds: [sendEmbedBuilder] });

            await message.react('🐦').catch(logger.error);
        } catch (err) {
            logger.debug(`There was an error sending the message to ${target.username} (${target.id}):\n${err}`);
            await message.react('❌').catch(logger.error);
        }
        return;
    }

    try {
        await developer.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `${user.username} (${user.id})`, iconURL: user.displayAvatarURL() })
                    .setDescription(message.content)
                    .addFields([{ name: "Mutual Servers", value: relatedGuilds ?? "None Found" }])
            ],
            files: message.attachments.map((value: Attachment) => value)
        });
    } catch (err) {
        logger.error(`Error sending message from ${message.author.username} (${message.author.id}):\n${err}`);
        await channel.send("There was an error sending the message. Try again in a little while, add `_thoth` on Discord, or join the [support server](https://discord.gg/Jxe7mK2dHT).");
        return;
    }

    await message.react('✅').catch(logger.error);
}