import { inspect } from "util";
import { ChatInputCommandInteraction } from "discord.js";
import { developer } from "../exports/configExports.js";
import { resolveUserID, datedErr } from "../exports/functionExports.js";

import "../prototypes/tempSend.js";

/**
 * @param {ChatInputCommandInteraction} interaction 
 * @returns {void}
 */

export default async function (interaction) {
    if(interaction.member.id !== developer.id) return;
    let user = resolveUserID(interaction.options.get("id").value);
    if (user) interaction.reply({ content: `\`\`\`json\n${inspect(user)}\n\`\`\``, ephemeral: true }).catch(datedErr);
    else interaction.reply({ content: interaction.options.get("id").value + "resolveUserID returned **`false`**", ephemeral: true }).catch(datedErr);
}
