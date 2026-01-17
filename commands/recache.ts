import { logger } from "../index";
import { developer, client } from "../exports/configExports";
import { ValidInteraction } from "../data/ValidInteraction";
import replyEphemeral from "../functions/replyEphemeral";

/**
 * Fetches all guilds.
 * @param interaction The interaction to operate on.
 * @throws If an interaction reply fails.
 */
export default async function recacheHard(interaction: ValidInteraction) {
    if (interaction.user.id !== developer.id) {
        logger.error(`${interaction.user.tag} (${interaction.user.id}) attempted to execute HARDRECACHE without permission.`);
        await replyEphemeral(interaction, "You do not have permission to execute this command.");

        return;
    }

    logger.info("Recaching...");

    for (const guild of client.guilds.cache.values()) {
        try {
            await guild.fetch();
            logger.info(`"${guild.name}" has been hard-recached`);
        } catch (e) {
            logger.error(`Error hard-recaching "${guild.name}": ${e}`);
        }
    }
}
