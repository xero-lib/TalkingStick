import { GuildMember, Guild } from "discord.js";

/**
 * @param {GuildMember | Guild} messageMemberOrGuild
 * @param {string} roleName 
 * @returns {boolean}
 */
export default function (messageMemberOrGuild, roleName) {
    return messageMemberOrGuild.roles.cache.some((r) => r.name == roleName);
}