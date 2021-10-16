import { inspect } from "util";
import { Message } from "discord.js";
import { developer } from "../exports/configExports.js";
import { resolveUserID, datedErr } from "../exports/functionExports.js";

import "../prototypes/tempSend.js";

/**
 * @param {Message} message 
 * @param {string} args
 * @returns {void}
 */

export default async function (message, args) {
    if(message.member.id == developer.id) {
        let user = resolveUserID(args);
        if (user) message.channel.send(`\`\`\`json\n${inspect(user)}\n\`\`\``).catch(datedErr);
        else message.tempSend(args + "resolveUserID returned **`false`**").catch(datedErr);
    }
}
