import { Collection, NonThreadGuildBasedChannel, OverwriteResolvable, PermissionFlagsBits } from "discord.js";

import { logger } from "../main.ts";

import { getRole } from "../exports/functionExports.ts";
import { Roles, StickFlags } from "../exports/dataExports.ts";

export default async function cleanupStickSession(channel: NonThreadGuildBasedChannel) {
    const {
        BOT_MAGIC,
        REVERT_MAGIC,
        CommunicatePermission,
     } = channel.isVoiceBased()
        ?
            {
                BOT_MAGIC: StickFlags.VOICE_MAGIC,
                REVERT_MAGIC: StickFlags.VOICE_REVERT,
                CommunicatePermission: PermissionFlagsBits.Speak
            }
        :
            {
                BOT_MAGIC: StickFlags.TEXT_MAGIC,
                REVERT_MAGIC: StickFlags.TEXT_REVERT,
                CommunicatePermission: PermissionFlagsBits.SendMessages
            }
    ;
    const newOverwrites = new Collection<string, OverwriteResolvable>(
        channel.permissionOverwrites.cache.map(({ id, type, allow, deny }) => [
            id,
            {
                id,
                type,
                allow: allow.bitfield,
                deny: deny.bitfield
            }
        ])
    );

    const activeRole     = await getRole(channel.guild, Roles.TSActive       ).catch(() => undefined);
    const oldOverwrites = channel.permissionOverwrites;

    if (!activeRole) {
        logger.error(`Dirty channel ${channel.name} in ${channel.guild.name}.`);
    } else {
        newOverwrites.delete(activeRole.id);
    }

    // if the initiator's overwrites have REVERT_MAGIC or a non-CommuniatePermission flag (besides BOT_MAGIC and REVERT_MAGIC)
    for (const [id, overwrite] of oldOverwrites.cache) {
        const currentOverwrites = newOverwrites.get(id);

        const currentAllow = currentOverwrites?.allow as bigint ?? overwrite.allow.bitfield;
        const currentDeny  = currentOverwrites?.deny  as bigint ?? overwrite.deny .bitfield;

        if (
            ((currentAllow | currentDeny) &  REVERT_MAGIC) ||
            ((currentAllow | currentDeny) & ~REVERT_MAGIC & ~CommunicatePermission & ~BOT_MAGIC )
        ) {
            newOverwrites.set(
                id,
                {
                    id,
                    type: overwrite.type,
                    allow: (currentAllow & ~REVERT_MAGIC & ~CommunicatePermission & ~BOT_MAGIC)
                        | ((currentAllow &  REVERT_MAGIC)?  CommunicatePermission : 0n),
                    deny:  (currentDeny  & ~REVERT_MAGIC & ~CommunicatePermission & ~BOT_MAGIC)
                        | ((currentDeny  &  REVERT_MAGIC)?  CommunicatePermission : 0n)
                }
            )
        } else newOverwrites.delete(id);
    }

    await channel.permissionOverwrites.set(newOverwrites);
}