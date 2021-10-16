import { Message } from "discord.js";
import * as commands from "../exports/commandExports.js";

let CommandMap = {};

/**
* @param {string} name
* @param {(message: Message, args?: string | number) => void} action 
*/

function registerCommand(name, action) { CommandMap[name] = action }

for(const [key, command] of Object.entries(commands)) registerCommand(key, command);

export default CommandMap;