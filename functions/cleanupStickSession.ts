import { Collection, NonThreadGuildBasedChannel } from "discord.js";

import { logger } from "../main.ts";

import { getRole } from "../exports/functionExports.ts";
import { Roles, OverwriteManager } from "../exports/dataExports.ts";

export default async function cleanupStickSession(channel: NonThreadGuildBasedChannel) {
    const newOverwrites = new Collection<string, OverwriteManager>(
        channel.permissionOverwrites.cache.map((overwrite) =>
            [
                overwrite.id,
                new OverwriteManager(channel.isVoiceBased(), overwrite)
            ]
        )
    );

    const activeRole    = await getRole(channel.guild, Roles.TSActive).catch(() => undefined);
    const oldOverwrites = channel.permissionOverwrites;

    if (!activeRole) {
        logger.error(`Dirty channel ${channel.name} in ${channel.guild.name}.`);
    } else {
        newOverwrites.delete(activeRole.id);
    }

    // if the initiator's overwrites have REVERT_MAGIC or a non-CommuniatePermission flag (besides BOT_MAGIC and REVERT_MAGIC)
    for (const [id, _overwrite] of oldOverwrites.cache) {
        const currentOverwrites = newOverwrites.get(id);
        if (!currentOverwrites) continue;

        currentOverwrites.revert();

        // if the user doesn't have any other existing overwrites, delete
        if (currentOverwrites.isEmpty()) newOverwrites.delete(id);
    }

    const overwrites = new Collection(newOverwrites.map((overwrite, id) =>
        [
            id,
            overwrite.toOverwriteData()
        ]
    ));

    await channel.permissionOverwrites.set(overwrites);
}