import { ChatInputCommandInteraction } from "discord.js";
import { date } from "../exports/functionExports.js";
import { developer } from "../exports/configExports.js";
import { setPresence, datedErr } from "../exports/functionExports.js";

// import "../prototypes/tempSend.js";

/**
 * @param {ChatInputCommandInteraction} interaction 
 * @returns {void}
 */

export default async function (interaction) {
    console.log(date(),`Refresh Presence requested by ${interaction.user.tag}`);
    if ([developer.id, "178973249500217344"].includes(interaction.member.id)) {
        setPresence().then(() => {
            console.log(date(),`Presence set by ${interaction.user.tag}.`);
            interaction.reply({ content: "Presence refreshed.", ephemeral: true }).catch(datedErr);
        }).catch(datedErr);
    }
}
