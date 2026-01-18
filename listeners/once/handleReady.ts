import { Client } from "discord.js";

import { logger } from "../../main.ts";

import { setPresence } from "../../exports/functionExports.ts";
/**
 * Handles the onceReady event. Performs initial fetch of and sets presence for the {@link Client} instance.
 * @param client The {@link Client} instance to operate on.
 */
export default async function handleReady(client: Client<true>) {
    logger.info(`Currently in ${client.guilds.cache.size} servers`);
    try {
        await client.guilds.fetch();
    } catch (err) {
        logger.error(`Failed to handle ready event: ${err}`);
    }

    setPresence(client);
}