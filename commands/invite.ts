import { OAuth2Scopes, PermissionFlagsBits } from "discord.js";

import { logger } from "../index";
import { ValidInteraction } from "../data/ValidInteraction";
import replyEphemeral from "../functions/replyEphemeral";

/**
 * Allows a user to invite Talking Stick to a different server.
 * @param interaction The interaction to operate on.
 * @throws If an interaction reply fails.
 */
export default async function invite(interaction: ValidInteraction) {
    const inviteLink = interaction.client.generateInvite({
        permissions: [PermissionFlagsBits.Administrator],
        scopes: [OAuth2Scopes.Bot]
    });
    
    logger.info(`Generated bot invite for ${interaction.user.username} (${interaction.user.id}) in ${interaction.guild.name}: ${inviteLink}`);

    await replyEphemeral(interaction, `You can invite Talking Stick to your server by clicking [here](${inviteLink})!`);
}
