import { logger } from "../index";
import { developer } from "../exports/configExports";
import { ValidInteraction } from "../exports/dataExports";
import replySafe from "../functions/safeReply";
import replyEphemeral from "../functions/replyEphemeral";

/**
 * Allows the bot to resolve a user ID to a stringified user object.
 * @param interaction The interaction to operate on.
 * @throws If an interaction reply failed.
 */
export default async function resolveUserId(interaction: ValidInteraction) {
    if(interaction.member.id !== developer.id) return;

    const id = interaction.options.get("id")?.value;
    if (!(typeof id === "string")) {
        await replySafe(interaction, "No ID provided.");
        return;
    }
    
    const user = await interaction.guild.members.fetch({ user: id }).catch((e) => {
        logger.debug(`Unable to fetch user with ID ${id}: ${e}`);
        return null;
    });

    if (!user) {
        await replyEphemeral(interaction, `Could not resolve user wit ID: ${id}`);
        return;
    }

    await replyEphemeral(interaction, `\`\`\`json\n${JSON.stringify(user, null, 4)}\n\`\`\``);
}
