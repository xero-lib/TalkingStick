import { GuildMember, Guild } from "discord.js";

/**
 * @param {GuildMember | Guild} interactionMemberOrGuild
 * @param {string} roleName 
 * @returns {boolean}
 */
export default function (interactionMemberOrGuild, roleName) {
    return interactionMemberOrGuild.roles.cache.some((r) => r.name == roleName);
}