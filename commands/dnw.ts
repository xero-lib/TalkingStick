import { Colors, EmbedBuilder, MessageFlags } from "discord.js";

import { developer } from "../exports/configExports";
import { ValidInteraction } from "../data/ValidInteraction";
import replyEphemeral from "../functions/replyEphemeral";

const errmsg = (msg: string) => `Unable to find guild owner to attach to message. Please try again momentarily.\nMessage:\n${msg}`

/**
 * Allows a user to send a bug report to the developer.
 * @param interaction The interaction to operate on
 * @throws If an interaction reply or developer message fails.
 */
export default async function dnw(interaction: ValidInteraction) {
    const message = interaction.options.getString("message");
    if (!(typeof message === "string") || message.length === 0) return;

    const owner = await interaction.guild.fetchOwner().catch(() => null);
    if (!owner) {
        await replyEphemeral(interaction, errmsg(message));
        return
    }

    await developer.send({
        embeds: [
            new EmbedBuilder()
                .setTitle("__DNW Report__")
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() ?? interaction.member.displayAvatarURL() })
                .setDescription(interaction.options.getString("message"))
                .addFields(
                    {
                        name: "Server Name",
                        value: interaction.guild.name
                    },
                    {
                        name: "Join Date",
                        value: `${interaction.guild.joinedAt}`
                    },
                    {
                        name: "Owner",
                        value: `${owner.user.username} (${owner.id})`
                    },
                    {
                        name: "User Count",
                        value: `${interaction.guild.memberCount}`
                    },

                )
                .setImage(interaction.guild.iconURL())
                .setColor(Colors.Red)        
        ]
    });

    await replyEphemeral(interaction, "Report sent, you will receive response from `_thoth` via bot DM as soon as he is available. Alternatively, join the [support server](https://discord.gg/cJ77STQ)");
}
