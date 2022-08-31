import { inspect } from "util";
import { ChatInputCommandInteraction } from "discord.js";
import { developer } from "../exports/configExports.js";
import { resolveUserID, datedErr } from "../exports/functionExports.js";

import "../prototypes/tempSend.js";

/**
 * @param {ChatInputCommandInteraction} interaction 
 * @param {string} args
 * @returns {void}
 */

export default async function (interaction, args) {
    if(interaction.member.id == developer.id) {
        let user = resolveUserID(args);
        if (user) interaction.reply({ content: `\`\`\`json\n${inspect(user)}\n\`\`\``, ephemeral: true }).catch(datedErr);
        else interaction.reply({ content: args + "resolveUserID returned **`false`**", ephemeral: true }).catch(datedErr);
    }
}
