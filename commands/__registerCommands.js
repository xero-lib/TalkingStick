import { Client, IntentsBitField, Routes } from 'discord.js';
import commands from "./commandData.js"
import { REST } from '@discordjs/rest';
import { clientId, token } from '../config/botConfig.js';

const rest = new REST({ version: '10' }).setToken(token);

await rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);

await rest.put(Routes.applicationCommands(clientId), { body: commands.map((cmd) => cmd.toJSON()) })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

const client = new Client({intents: IntentsBitField.Flags.Guilds});
client.login(token);

export { token };