import { Guild, GuildMember, Role } from "discord.js";

import { rolesMap, logger } from "../main.ts";
import { Roles } from "../exports/dataExports.ts";

/**
 * Gets a {@link https://discord.js.org/docs/packages/discord.js/main/Role:Class|Role} from a specific {@link https://discord.js.org/docs/packages/discord.js/main/Guild:Class|Guild} or {@link https://discord.js.org/docs/packages/discord.js/main/GuildMember:Class|GuildMember}.
 * @param source The {@link Guild} or {@link GuildMember} to search.
 * @param role The {@link Roles} variant to retrieve.
 * @returns Returns the {@link Role} if found, and `undefined` if not.
 */
export default async function getRole(source: Guild | GuildMember, role: Roles): Promise<Role | undefined> {
    const guild = source instanceof Guild ? source : source.guild;

    logger.trace(`Getting role ${role} from ${guild.name} (${guild.id})`);

    // if rolesMap does not contain info on the current guild, try to cache it
    if (!rolesMap.has(guild.id)) {
        logger.debug(`New Guild ID encountered. Indexing roles for ${guild.name} (${guild.id})`);

        // fetch all guild roles
        const retrievedRoles = await guild.roles.fetch().catch(() => null);
        
        if (!retrievedRoles) {
            logger.error(`Failed to fetch roles from ${guild.name} (${guild.id})`);
            return undefined;
        }

        const variantMap = new Map<Roles, string>();

        // iterate over each variant of the role, caching each
        for (const name of Object.values(Roles)) {
            logger.trace(`Indexing ${name} role in ${guild.name}`);

            // find the role in the fetched roles collection
            const guildRole = retrievedRoles.find((r) => r.name === name);

            // if the guildRole wasn't found, the server is not properly set up, so return undefined
            if (!guildRole) {
                logger.debug(`Unable to find ${name} role in ${guild.name}`);
                return undefined;
            }

            // set each variant in the map
            variantMap.set(name as Roles, guildRole.id);
        }

        rolesMap.set(guild.id, variantMap);
    }

    // optional chain prevents very rare race condition of guild deletion before role retrieval
    const roleId = rolesMap.get(guild.id)?.get(role);
    return roleId ? guild.roles.cache.get(roleId) : undefined;
}