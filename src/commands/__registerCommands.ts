import { REST, Routes } from "discord.js";
import { commands, devCommands } from "./commandData.ts"

const [
	CLIENT_ID,
	DEV_GUILD_ID
] = Bun.env.BUN_ENV !== "production"
	? 
		[
			"609233676471107584", // Talking Stick ID
			"764720953463799838"  // Talking Stick Guild
		]
	:
		[
			"347845944378916867", // Testing Bot ID
			"347844679074709504"  // Testing Guild 
		]
;

const TOKEN = Bun.env.TOKEN;

if (!TOKEN) {
	console.error("No token found in environment.");
	process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);

await rest.put(Routes.applicationGuildCommands(CLIENT_ID, DEV_GUILD_ID), { body: [] })
	.then(() => console.log('Successfully deleted all application guild commands.'))
	.catch(console.error);

await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands.map((cmd) => cmd.toJSON()) })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

await rest.put(Routes.applicationGuildCommands(CLIENT_ID, DEV_GUILD_ID), { body: devCommands.map((cmd) => cmd.toJSON()) })
	.then(() => console.log("Successfully registered application guild commands."))
	.catch(console.error);

process.exit(0);