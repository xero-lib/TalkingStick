import { Message } from "discord.js";
import { datedErr } from "../exports/functionExports.js";

import "./tempSend.js";
import "./tempReply.js";

Object.defineProperty(Promise.prototype, "timeoutDelete", {
    /**
     * @param {Message} message 
     * @returns {void}
     */
    value: async function timeoutDelete(message) {
        return this.then(async (sentMessage) => {
            if (!sentMessage?.deleted) sentMessage.delete({timeout: 30000}).catch(() => {});
            if (!message?.deleted) message.delete({timeout: 30000}).catch(() => {});
        }).catch((e) => {
            if (!message.deleted) datedErr(`Unable to apply delete timeout to message from ${message.author.tag} (${message.member.id}) in ${message.channel.name} in ${message.guild.name}:`, e);
            else if (message.deleted) null;
            else datedErr("An unknown error has occured in timeoutDelete:",e);
        });
    },
    writable: true,
    configurable: true
});