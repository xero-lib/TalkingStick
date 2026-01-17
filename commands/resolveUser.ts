import { logger } from "../index";
import { developer } from "../exports/configExports";
import { ValidInteraction } from "../data/ValidInteraction";
import replySafe from "../functions/safeReply";
import replyEphemeral from "../functions/replyEphemeral";

/**
 * Allows the bot to resolve a username to a stringified user object.
 * @param interaction The interaction to operate on.
 * @throws If an interaction reply fails.
 */
export default async function resolveuser(interaction: ValidInteraction) {
    if(interaction.member.id !== developer.id) return;

    const username = interaction.options.get("username")?.value;
    if (!(typeof username === "string")) {
        await replySafe(interaction, "No username provided.");
        return;
    }

    for (const [_id, guild] of interaction.client.guilds.cache) {
        const member = (await guild.members.fetch({ query: username.toLowerCase(), limit: 1 }).catch(logger.error))?.first();
        if (member) {
            await replyEphemeral(interaction, `\`\`\`json\n${JSON.stringify(member.user, null, 4)}\n\`\`\``);
            return;
        }
    }

    await replyEphemeral(interaction, `Could not resolve user with username: ${username}.`);
}
