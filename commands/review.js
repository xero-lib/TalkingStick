import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { date, datedErr } from "../exports/functionExports.js";
import { client, botPage, botPfp, developer } from "../exports/configExports.js";

const reviewEmbed = new EmbedBuilder()
    .setColor("Blue")
    .setTitle("**Enjoying Talking Stick?**")
    .setDescription("If you're enjoying Talking Stick, please consider reviewing and voting for it on the top.gg page associated with it (linked on \"Enjoying Talking Stick?\"), along with any feedback you have! If you're not enjoying Talking Stick, please DM the bot or me (Thoth#6134) any feedback you have.")
    .setFooter({ text: "Rating and voting on the bot helps it reach and help more people!" })
    .setThumbnail(botPfp)
    .setURL(botPage)

/**
 * @param {ChatInputCommandInteraction} interaction 
 * @returns {void}
 */

export default async function (interaction) {
    if (interaction.user.id === developer.id) {
        let serverOwners = [];

        for (const g of client.guilds.cache.values()) {
            if (serverOwners.indexOf(g.owner.user) === -1) {
                serverOwners.push(g.owner.user);
            }
        }
        let botName = (await client.application.fetch()).name;
        serverOwners.forEach((e) => {
            e.send({
                embeds: [reviewEmbed.setAuthor({ name: botName, iconURL: botPfp })]
            }).then(() => {
                console.log(date(), `Sent review invitation to ${e.tag}`)
            }).catch((err) => {
                datedErr(`Could not send review message:`, err)
            });
        })
    }
}
