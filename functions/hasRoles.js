import { GuildMember, Guild } from "discord.js";
import { roles } from "../exports/configExports.js";
import { someRole } from "../exports/functionExports.js";

/**
 * @param {GuildMember | Guild} memOrGuildObj 
 * @returns {boolean}
 */

export default async function (memOrGuildObj) {
    let roleIndicator = 0;
    roles.forEach((r) => { if (!someRole(memOrGuildObj, r)) roleIndicator++; });
    if (roleIndicator != roles.length) return false;
    return true;
}