import { GuildMember, Guild, Role } from "discord.js";

/**
 * @param {GuildMember | Guild} messageMemberOrGuild
 * @param {string} roleName 
 * @returns {Role | undefined}
 */
export default (messageMemberOrGuild, roleName) => (messageMemberOrGuild).roles.cache.find((r) => r.name == roleName);
