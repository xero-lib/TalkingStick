import { Collection, GuildMember, NonThreadGuildBasedChannel, OverwriteData,  OverwriteType, PermissionFlagsBits, PermissionOverwriteManager } from "discord.js";
import { StickFlags } from "../data/StickFlags";

export default function createListenerOverwrites(
    channel: NonThreadGuildBasedChannel,
    member: GuildMember
): OverwriteData;

export default function createListenerOverwrites(
    channel: NonThreadGuildBasedChannel,
    ...member: GuildMember[]
): Collection<string, OverwriteData>;

export default function createListenerOverwrites(
    channel: NonThreadGuildBasedChannel,
    ...members: GuildMember[]
): OverwriteData | Collection<string, OverwriteData> {
    const existingOverwrites = channel.permissionOverwrites;

    const [
        CommunicatePermission,
        REVERT_MAGIC,
        BOT_MAGIC
    ] = channel.isVoiceBased()
        ? [PermissionFlagsBits.Speak, StickFlags.VOICE_REVERT, StickFlags.VOICE_MAGIC]
        : [PermissionFlagsBits.SendMessages, StickFlags.TEXT_REVERT, StickFlags.TEXT_MAGIC]
    ;

    const calculateBitfield = (m: GuildMember): OverwriteData => {
        const existingAllow = existingOverwrites.cache.get(m.id)?.allow.bitfield ?? 0n;
        const existingDeny  = existingOverwrites.cache.get(m.id)?.deny .bitfield ?? 0n;

        return {
            id: m.id,
            type: OverwriteType.Member,
            allow: (existingAllow & ~CommunicatePermission) | ((existingAllow & CommunicatePermission) ? REVERT_MAGIC : 0n),
            deny:  existingDeny | CommunicatePermission | ((existingDeny & CommunicatePermission) ? REVERT_MAGIC : BOT_MAGIC)
        };
    }

    if (members.length === 1) return calculateBitfield(members[0]);

    const overwrites: Collection<string, OverwriteData> = new Collection(
        existingOverwrites.cache.map(({ id, type, allow, deny }) =>
            [
                id,
                {
                    id,
                    type,
                    allow: allow.bitfield,
                    deny: deny.bitfield
                }
            ]
        )
    );

    for (const m of members) overwrites.set(m.id, calculateBitfield(m));

    return overwrites;
}