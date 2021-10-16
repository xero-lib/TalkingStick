import { Message } from "discord.js";
import { date } from "../exports/functionExports.js";
import { developer } from "../exports/configExports.js";
import { setPresence, datedErr } from "../exports/functionExports.js";

import "../prototypes/tempSend.js";

/**
 * @param {Message} message 
 * @returns {void}
 */

export default async function (message) {
    console.log(date(),`Refresh Presence requested by ${message.author.tag}`);
    if ([developer.id, "178973249500217344"].includes(message.member.id)) {
        setPresence().then(() => {
            console.log(date(),`Presence set by ${message.author.tag}.`);
            message.react("✅");
            message.tempSend("Presence refreshed.").catch(datedErr);
        }).catch(datedErr);
    }
}
