import { InteractionResponse, Message } from "discord.js";

import { ContentUnion, ValidInteraction } from "../exports/dataExports.ts";

/**
 * If interaction is already replied or deferred, `editReply`, otherwise `reply`.
 * @param interaction The interaction to operate on.
 * @param content Message text or payload to reply with.
 * @returns Promise which resolves to a {@link Message} if already replied or deferred, or an {@link InteractionResponse} if a new reply was created.
 * @throws If either the editReply or reply failed.
 * 
 * @example
 * const response = await safeReply(interaction as ValidInteraction, "Hello, world!").catch((err) => {
 *     console.error(`Failed to send reply:\n${err}`);
 *     return null;
 * });
 * 
 * if (!response) return;
 * 
 * await response.edit("Hello, World!");
 */
export default function replySafe(interaction: ValidInteraction, content: ContentUnion): Promise<Message | InteractionResponse> {
    if (interaction.replied || interaction.deferred) {
        if (interaction.ephemeral) {
            return interaction.followUp(content); // we don't want a replySafe to be ephemeral
        }

        return interaction.editReply(content);
    }

    return interaction.reply(content)
}