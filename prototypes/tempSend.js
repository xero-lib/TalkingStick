import { MessageEmbed, Message } from "discord.js";

import "./timeoutDelete.js";

Object.defineProperty(Message.prototype, "tempSend", {
    /**
     * @param {string | number | MessageEmbed} msg 
     * @returns {Promise<Message>}
     */
    value: function (msg) {
        return this.channel.send(msg).timeoutDelete(this)
    },
    writable: true,
    configurable: true
});