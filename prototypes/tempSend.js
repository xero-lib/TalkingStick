import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

import "./timeoutDelete.js";

Object.defineProperty(ChatInputCommandInteraction.prototype, "tempSend", {
    /**
     * @param {string | number | EmbedBuilder} msg 
     * @returns {Promise<ChatInputCommandInteraction>}
     */
    value: function (msg) {
        return this.channel.send(msg).timeoutDelete(this)
    },
    writable: true,
    configurable: true
});