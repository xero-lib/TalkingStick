import { Guild, GuildMember } from "discord.js";

import { rolesMap } from "../main.ts";
import { Roles } from "../exports/dataExports.ts";

/**
 * Determines whether or not a {@link Role} exists in a {@link Guild} or {@link GuildMember} cache.
 * @param source The {@link Guild} or {@link GuildMember} to search.
 * @param role The {@link Roles} variant to retrieve, or the ID of the role.
 * @returns Returns whether or not the  {@link Roles} variant was found in cache.
 */
export default function hasCachedRole(source: Guild | GuildMember, role: Roles | string): boolean {
    // if the source is a Guild, not a GuildMember
    if (source instanceof Guild) {
        // if the role passed is a Roles variant (can't use instanceof here).
        return Object.values(Roles).includes(role as Roles)
            // return if it is cached in the rolesMap.
            ? rolesMap.get(source.id)?.has(role as Roles) ?? false
            // return if the ID is in the Guild's role cache.
            : source.roles.cache.has(role)
        ;
    }

    // at this point, the source must be a GuildMember.
    // if the role passed is a Roles variant (can't use instanceof here).
    return Object.values(Roles).includes(role as Roles)
        // return if it is in the rolesMap, and if that role exists on the GuildMember, and if not, manually search the GuildMember's roles cache.
        ? source.roles.cache.has(rolesMap.get(source.guild.id)?.get(role as Roles) ?? "") || source.roles.cache.some((r) => r.name === role)
        // return if the role ID is in the GuildMember's role cache.
        : source.roles.cache.has(role)
    ;
}