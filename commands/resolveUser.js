import { inspect } from "util";
import { ChatInputCommandInteraction } from "discord.js";
import { developer } from "../exports/configExports.js";
import { resolveUser, datedErr } from "../exports/functionExports.js";

import "../prototypes/tempSend.js";

/**
 * @param {ChatInputCommandInteraction} interaction 
 * @returns {void}
 */

export default async function (interaction) {
    if(interaction.member.id == developer.id) {
        let user = resolveUser(interaction.options.get("tag").value);
        if (user) interaction.reply({ content: `\`\`\`json\n${inspect(user)}\n\`\`\``, ephemeral: true }).catch(datedErr);
        else interaction.reply({content: interaction.options.get("tag").value + "\tresolveUser returned **`false`**", ephemeral: true }).catch(datedErr);
    }
}
