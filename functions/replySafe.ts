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
 *     console.error(`Failed to send reply: ${err}`);
 *     return null;
 * });
 * 
 * if (!response) return;
 * 
 * await response.edit("Hello, World!");
 */
export default async function replySafe(interaction: ValidInteraction, content: ContentUnion): Promise<Message | InteractionResponse> {
    return interaction.replied || interaction.deferred
        ? await interaction.editReply(content)
        : await interaction.reply(content)
    ;
}