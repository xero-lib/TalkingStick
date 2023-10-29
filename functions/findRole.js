import { GuildMember, Guild, Role } from "discord.js";

/**
 * @param {GuildMember | Guild} interactionMemberOrGuild
 * @param {string} roleName 
 * @returns {Role | undefined}
 */
export default (interactionMemberOrGuild, roleName) => interactionMemberOrGuild.roles.cache.find((r) => r.name == roleName);
