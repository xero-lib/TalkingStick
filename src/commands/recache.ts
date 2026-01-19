import { logger } from "../main.ts";

import { developer } from "../exports/configExports.ts";
import { ValidInteraction } from "../exports/dataExports.ts";
import { replyEphemeral } from "../exports/functionExports.ts";

/**
 * Fetches all guilds.
 * @param interaction The interaction to operate on.
 * @throws If an interaction reply fails.
 */
export default async function recacheHard(interaction: ValidInteraction) {
    if (interaction.user.id !== developer.id) {
        logger.error(`${interaction.user.username} (${interaction.user.id}) attempted to execute HARDRECACHE without permission.`);
        await replyEphemeral(interaction, "You do not have permission to execute this command.");

        return;
    }

    logger.info("Recaching...");

    for (const guild of interaction.client.guilds.cache.values()) {
        try {
            await guild.fetch();
            logger.info(`"${guild.name}" has been hard-recached`);
        } catch (err) {
            logger.error(`Error hard-recaching "${guild.name}":\n${err}`);
        }
    }
}
