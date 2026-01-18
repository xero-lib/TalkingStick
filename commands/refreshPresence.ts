import { logger } from "../main.ts";
import { developer } from "../exports/configExports.ts";
import { ValidInteraction } from "../exports/dataExports.ts";
import { replyEphemeral, replySafe, setPresence } from "../exports/functionExports.ts";

/**
 * Allows the bot's presence to be manually refreshed in case of silliness.
 * @param interaction The interaction to operate on.
 * @throws If an interaction reply fails.
 */
export default async function refreshPresence(interaction: ValidInteraction) {
    logger.info(`Refresh Presence requested by ${interaction.user.username}`);
    if (interaction.member.id !== developer.id ) return;

    try {
        await setPresence(interaction.client);
        logger.trace(`Presence set successfully by ${interaction.user.username}.`);
    } catch (err) {
        logger.error(`Failed to manually refresh presence:\n${err}`);
        await replySafe(interaction, "Failed to refresh presence. Please try again.");

        return;
    }

    await replyEphemeral(interaction, "Presence refreshed.");
}
