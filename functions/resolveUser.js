import { User } from "discord.js"
import { client } from "../exports/configExports.js";

/**
 * @param {string} username 
 * @returns {User | undefined}
 */

export default function (username) { return client.users.cache.find((u) => u.tag == username) }