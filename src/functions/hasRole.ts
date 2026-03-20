import { GuildMember, Guild } from "discord.js";

import { Roles } from "../exports/dataExports.ts";
import { getRole } from "../exports/functionExports.ts";

/**
 * Checks if a {@link Guild} or {@link GuildMember} has a particular variant of {@link Roles}.
 * @param source - The {@link Guild} or {@link GuildMember} to look for the given {@link Roles} variant in.
 * @param role - The desired {@link Roles} variant to check for.
 * @returns Resolves to `true` if the {@link Guild} or {@link GuildMember} has the given {@link Roles} variant, `false` otherwise.
 */
export default async function hasRole(source: Guild | GuildMember, role: Roles): Promise<boolean> {
    const resolvedRole = await getRole(source, role);

    if (!resolvedRole) return false;

    // if the source is a Guild, the role existing is sufficient
    if (source instanceof Guild) return true;

    // for GuildMember, check if the member actually has the role
    return source.roles.cache.has(resolvedRole.id);
}