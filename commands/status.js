import { EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { date, datedErr } from "../exports/functionExports.js";
import { developer, botPfp, client } from "../exports/configExports.js";

import "../prototypes/tempSend.js";

/**
 * @param {ChatInputCommandInteraction} interaction 
 * @returns {void}
 */

export default async function (interaction) {
    if (interaction.user.id == developer.id) {
        const statusEmbed = new EmbedBuilder()
            .setAuthor({ name: "Talking Stick", iconURL: botPfp })
            .setTitle("**STATUS**")
            .addFields([
                { name: "Online Status",    value: client.isReady() ? "Online" : "Starting" }, //pointless, as it would be unable to respond if not ready
                { name: "Server Count",     value: `${(await client.guilds.fetch()).size}`  },
                { name: "User Count",       value: `${client.users.cache.size}`             },
                { name: "Uptime",           value: `${client.uptime/1000/60/60/24} days`    }
            ])

        interaction.reply({ embeds: [statusEmbed], ephemeral: true }).catch(datedErr);
        console.log(date(),`Server Count: ${client.guilds.cache.size}\nUser Count: ${client.users.cache.size}\nUptime: ${client.uptime}`);
    }
}