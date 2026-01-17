import { EmbedBuilder } from "discord.js";

import { ValidInteraction } from "../exports/dataExports";
import { developer, botPfp, client } from "../exports/configExports";
import replyEphemeral from "../functions/replyEphemeral";

/**
 * Gives a brief status overview of the bot.
 * @param interaction The interaction to operate on.
 * @throws If an interaction reply fails.
 */
export default async function status(interaction: ValidInteraction) {
    if (interaction.user.id === developer.id) {
        const statusEmbed = new EmbedBuilder()
            .setAuthor({ name: "Talking Stick", iconURL: botPfp })
            .setTitle("**STATUS**")
            .addFields([
                { name: "Server Count",     value: (await client.guilds.fetch()).size.toString(10)                 },
                { name: "User Count",       value: client.users.cache.size.toString(10)                            },
                { name: "Uptime",           value: client.uptime ? client.uptime/1000/60/60/24 + "days": "Unknown" }
            ])

        await replyEphemeral(interaction, { embeds: [statusEmbed] });
    }
}