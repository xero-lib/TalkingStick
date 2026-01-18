import { logger } from '../../main.ts';

/**
 * Handles ShardReconnecting events, logging them when they fire.
 * @param shardId ID of the shard which is attempting to reconnect.
 */
export default function handleShardReconnecting(shardId: number) {
  logger.debug(`Reconnecting shard ${shardId}...`);
}