import { Message, MessageEmbed } from "discord.js";

import "./tempSend.js";
import "./timeoutDelete.js"

Object.defineProperty(Message.prototype, "tempReply", {
    /**
     * @param {string | number | MessageEmbed} msg
     * @returns {Promise<Message>}
     */
    value: function (msg) {
        return this.reply(msg).timeoutDelete(this);
    },
    writable: true,
    configurable: true
});
