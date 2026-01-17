import { logger } from '../../index';

/**
 * Handles ShardReconnecting events, logging them when they fire.
 * @param shardId ID of the shard which is attempting to reconnect.
 */
export default async function handleShardReconnecting(shardId: number) {
  logger.debug(`Reconnecting shard ${shardId}...`);
}