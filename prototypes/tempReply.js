import { EmbedBuilder, ChatInputCommandInteraction } from "discord.js";

import "./tempSend.js";
import "./timeoutDelete.js"

Object.defineProperty(ChatInputCommandInteraction.prototype, "tempReply", {
    /**
     * @param {string | number | EmbedBuilder} msg
     * @returns {Promise<ChatInputCommandInteraction>}
     */
    value: function (msg) {
        return this.reply(msg).timeoutDelete(this);
    },
    writable: true,
    configurable: true
});
