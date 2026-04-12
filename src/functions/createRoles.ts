import { ColorResolvable } from "discord.js";

import { rolesMap } from "../main.ts";
import { hasRole } from "../exports/functionExports.ts";
import { Roles, ValidInteraction } from "../exports/dataExports.ts";

/**
 * Create all Talking Stick roles in a guild.
 * @param interaction Interaction in the target guild to operate on.
 * @param roles A {@link Map} of each role to its prescribed role color as an 8-character hex-string.
 * @returns A {@link Promise} which holds a {@link Set} of any created {@link Roles}.
 * @throws If a role was unable to be created.
 */
export default async function createRoles(interaction: ValidInteraction, roles: Map<Roles, ColorResolvable>): Promise<Set<Roles>> {
    const createdSet: Set<Roles> = new Set(); // could use a number and flip bits but no fixed size number type so it'd be weird
    const guildId = interaction.guild.id;

    for (const [role, color] of roles) {
        if (await hasRole(interaction.guild, role)) continue;

        const createdRole = await interaction.guild.roles.create({
            name: role,
            colors: {
                primaryColor: color
            },
            reason: `Created ${role} for Talking Stick`
        });

        // update the cached role map entry with the newly created role's ID
        if (!rolesMap.has(guildId)) rolesMap.set(guildId, new Map());
        rolesMap.get(guildId)!.set(role, createdRole.id);

        createdSet.add(role);
    }

    return createdSet;
}