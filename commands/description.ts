import { Colors, EmbedBuilder } from "discord.js";

import { botPfp } from "../exports/configExports";
import { ValidInteraction } from "../data/ValidInteraction";
import replyEphemeral from "../functions/replyEphemeral";

// static embed
const descriptionEmbed = new EmbedBuilder()
	.setColor(Colors.Blue)
	.setThumbnail(botPfp)
	.setTitle("**Talking Stick**")
	.setDescription("A bot that can act as a talking stick!\n\nIf one person has the talking stick, no one else can speak/type (depending on if you tell it to join a voice channel or a text channel).\n\n However, if you have the talking stick (or the special stick controller role) you can pass the talking stick to someone else so that they can talk!\n\nYou can even have multiple talking sticks so that several people can talk at the same time, but everyone else is muted in that channel.\n")
	.setFooter({ text: "To get an invite link, type `/invite`" });

/**
 * Provides the user with a brief description of the bot.
 * @param interaction The interaction to operate on.
 * @throws If an interaction reply fails.
 */
export default async function (interaction: ValidInteraction) {
	await replyEphemeral(interaction, { embeds: [descriptionEmbed] });
}