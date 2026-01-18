import { REST, Routes } from "discord.js";
import { commands, devCommands } from "./commandData.ts"
import { clientId, devGuildId } from "../config/botConfig.ts";

import { load as loadEnv} from "@std/dotenv";

const env = await loadEnv();

const rest = new REST({ version: '10' }).setToken(env.TOKEN);

await rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);

await rest.put(Routes.applicationGuildCommands(clientId, devGuildId), { body: [] })
	.then(() => console.log('Successfully deleted all application guild commands.'))
	.catch(console.error);

await rest.put(Routes.applicationCommands(clientId), { body: commands.map((cmd) => cmd.toJSON()) })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

await rest.put(Routes.applicationGuildCommands(clientId, devGuildId), { body: devCommands.map((cmd) => cmd.toJSON()) })
	.then(() => console.log("Successfully registered application guild commands."))
	.catch(console.error);

Deno.exit(0);
