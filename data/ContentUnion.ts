// import { Component, Embed } from "discord.js";
import { InteractionEditReplyOptions, InteractionReplyOptions } from "discord.js";

// export type ContentUnion = string | { content?: string, embeds?: Embed[], components: Component[] };
export type ContentUnion = string | (InteractionReplyOptions & InteractionEditReplyOptions);