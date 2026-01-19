import { logger } from "../../main.ts";

/**
 * Handles ShardResume events, logging the incident.
 * @param shardId Shard number which has resumed.
 * @param replayedEvents Number of events replayed after resuming.
 */
export default function handleShardResume(shardId: number, replayedEvents: number) {
    logger.debug(`Shard ${shardId} resumed. ${replayedEvents} events replayed.`);
}