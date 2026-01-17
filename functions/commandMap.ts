import * as commands from "../exports/commandExports";
import { ValidInteraction } from "../data/ValidInteraction";

export type CommandNames = keyof typeof commands;
const commandMap: Map<CommandNames,  (interaction: ValidInteraction) => Promise<any>> = new Map();

for(const [key, command] of Object.entries(commands)) commandMap.set(key as CommandNames, command);

export default commandMap;