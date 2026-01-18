import * as commands from "../exports/commandExports.ts";
import { ValidInteraction } from "../data/ValidInteraction.ts";

export type CommandNames = keyof typeof commands;
const commandMap: Map<CommandNames,  (interaction: ValidInteraction) => Promise<void>> = new Map();

for(const [key, command] of Object.entries(commands)) commandMap.set(key as CommandNames, command);

export default commandMap;