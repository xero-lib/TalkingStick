import { Message, Role } from "discord.js";

/**
 * @param {string} roleName 
 * @param {Message} message 
 * @param {string} roleColor 
 * @returns {Promise<Role>}
 */

export default async function (roleName, message, roleColor) {
    return message.guild.roles.create({
        data: {
            name: roleName,
            color: roleColor
        }, reason: `Created ${roleName}`
    });
}