import { NonThreadGuildBasedChannel, DMChannel} from "discord.js";

import { logger } from "../../main.ts";

/**
 * Handles ChannelDelete event, ensuring immediate channel removal from cache.
 * @param channel The channel which was deleted.
 */
export default function handleChannelDelete(channel: DMChannel | NonThreadGuildBasedChannel) {
    if (!channel.client.channels.cache.delete(channel.id)) logger.info("Deleted channel already removed from cache. If you see several of these, it's probably safe to remove this listener.");
}