import {
    Message,
    InteractionReplyOptions,
    MessageFlags,
    InteractionResponse,
    MessageFlagsBitField,
    MessageFlagsResolvable,
} from "discord.js";

import { ValidInteraction } from "../exports/dataExports.ts";

/**
 * Replies to an interaction ephemerally if not already replied or deferred, otherwise uses followUp.
 * 
 * @async
 * @param interaction The interaction to operate on.
 * @param content Either a string to reply with, or an {@link InteractionReplyOptions} object.
 * 
 * @throws If an interaction reply or followUp fails.
 * @returns A promise which resolves to the {@link Message} object representing the sent message if followUp, and {@link InteractionResponse} if reply.
 * 
 * @example
 * const message = await replyEphemeral(interaction as ValidInteraction, { content: "Hello, world!", embeds: [exampleEmbeds] }).catch((err) => {
 *     console.error(`Failed to send reply: ${err}`);
 *     return null;
 * });
 * 
 * if (!message) return;
 * 
 * await message.edit("Hello, World!");
 */
export default async function replyEphemeral(
    interaction: ValidInteraction,
    content: string | InteractionReplyOptions
): Promise<Message | InteractionResponse> {
    // if content is a string, put it in an InteractionReplyOptions object
    const options = typeof content === "string"
        ? { content }
        : { ...content } // spread to avoid unintended mutation
    ;
    
    // ensure ephemeral flag is set
    options.flags = new MessageFlagsBitField(options.flags as MessageFlagsResolvable)
        .add(MessageFlags.Ephemeral)
        .bitfield
    ;

    options.withResponse = true;

    // if interaction is already replied or deferred, followUp, otherwise, reply
    return interaction.replied || interaction.deferred
        ? await interaction.followUp(options)
        : await interaction.reply(options)
    ;
}