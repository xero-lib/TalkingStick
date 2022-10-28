import { /* Client, IntentsBitField, */ Routes } from 'discord.js';
import commands, { devCommands } from "./commandData.js"
import { REST } from '@discordjs/rest';
import { clientId, token } from '../config/botConfig.js';

const rest = new REST({ version: '10' }).setToken(token);

await rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);

await rest.put(Routes.applicationGuildCommands(clientId, "764720953463799838"), { body: [] })
	.then(() => console.log('Successfully deleted all application guild commands.'))
	.catch(console.error);

await rest.put(Routes.applicationCommands(clientId), { body: commands.map((cmd) => cmd.toJSON()) })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

await rest.put(Routes.applicationGuildCommands(clientId, "764720953463799838"), { body: devCommands.map((cmd) => cmd.toJSON()) })
	.then(() => console.log("Successfully registered application guild commands."))
	.catch(console.error);

// const client = new Client({intents: IntentsBitField.Flags.Guilds});
// client.login(token);

// export { token };
process.exit(0);