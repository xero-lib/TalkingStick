import Discord from "discord.js";
import * as commands from "../barrels/commandCoagulator.js";

let CommandMap = {};

/**
 * @param {!string} name
 * @param {(msg: Discord.Message, ...args: string)=>Promise.<void>} action
 */
function RegisterCommand(name, action) {
  CommandMap[name] = action;
}

for (const [key, command] of Object.entries(commands))
  RegisterCommand(key, command);

export default CommandMap;
