import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { datedErr } from "../exports/functionExports.js";
import { defaultPrefix as prefix, botPfp } from "../exports/configExports.js";

const descriptionEmbed = new EmbedBuilder()
	.setColor("BLUE")
	.setThumbnail(botPfp)
	.setTitle("**Talking Stick**")
	.setDescription("A bot that can act as a talking stick!\n\nIf one person has the talking stick, no one else can speak/type (depending on if you tell it to join a voice channel or a text channel).\n\n However, if you have the talking stick (or the special stick controller role) you can pass the talking stick to someone else so that they can talk!\n\nYou can even have multiple talking sticks so that several people can talk at the same time, but everyone else is muted in that channel.\n")
	.setFooter({ text: `To get an invite link, type /invite` });

/**
 * @param {ChatInputCommandInteraction} interaction
 */

export default async function (interaction) { interaction.reply(descriptionEmbed).catch(datedErr) }