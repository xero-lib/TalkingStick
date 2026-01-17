import { logger } from "../index";
import { developer } from "../exports/configExports";
import { setPresence } from "../exports/functionExports";
import { ValidInteraction } from "../data/ValidInteraction";
import replyEphemeral from "../functions/replyEphemeral";
import replySafe from "../functions/safeReply";

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
    } catch (e) {
        logger.error("Failed to manually refresh presence.");
        await replySafe(interaction, "Failed to refresh presence. Please try again.");

        return;
    }

    await replyEphemeral(interaction, "Presence refreshed.");
}
