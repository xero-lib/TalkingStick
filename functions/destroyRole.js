import { Message } from "discord.js";
import { findRole } from "../exports/functionExports.js";
import { date, datedErr } from "../exports/functionExports.js";

/**
 * @param {stromg} roleName 
 * @param {Message} message 
 * @returns {void}
 */

export default async function (roleName, message) {
    findRole(message.guild, roleName).delete(`TSDestroyed by ${message.author.name} (${message.author.id})`).catch(() => message.tempReply(`The bot most likely doesn't have sufficient permissions to complete this action. In server settings under roles, drag the \`Talking Stick\` role to the top. For more instruction on how to do this, scroll to the bottom of \`${prefix}help\``).catch(datedErr)).catch(datedErr); //delete Stick Controller
    console.log(date(),`Deleted role ${roleName} in ${message.guild.name} (${message.guild.id})`);
}