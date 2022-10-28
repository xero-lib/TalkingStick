import * as commands from "../exports/commandExports.js";

let CommandMap = {};

/**
* @param {string} name
* @param {(interaction: ChatInputCommandInteraction, args?: string | number) => void} action 
*/

function registerCommand(name, action) { CommandMap[name] = action }

for(const [key, command] of Object.entries(commands)) registerCommand(key, command);

export default CommandMap;