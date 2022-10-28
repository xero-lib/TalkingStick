import { User } from "discord.js"
import { client } from "../exports/configExports.js";

/**
 * @param {string} tag 
 * @returns {User | undefined}
 */

export default function (tag) { return client.users.cache.find((u) => u.tag === tag) }