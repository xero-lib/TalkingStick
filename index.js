// Imports //
import { token } from "./config/botConfig.js";
import {
    onMessage,
    onVoiceStateUpdate,
    onChannelCreate,
    onChannelDelete,
    onMessageUpdate,
    onInteractionCreate,
    onceReady,
    onceShardReconnecting,
} from "./exports/listenerExports.js";
import { date } from "./exports/functionExports.js";
import { Client, User, IntentsBitField } from "discord.js";
// import { setTimeout as wait } from 'node:timers/promises';

export const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.DirectMessages] });
console.warn(client.options);

// Login //
// async function login() {
//     await wait(100);
let application;
/** @type {User} */ let developer;

client.login(token).then(async () => {
    application = await client.application.fetch();
    /** @type {User} */ developer = application.owner;
});
// }

// await login();

// function getPromise() {
//     return new Promise((resolve) => {
//         client.once('ready', async () => {
//             resolve()
//         });
//     })
// }
// async function waitForClientLogin() {
//     await getPromise()
// }
// waitForClientLogin()

client
    .on("debug", (d) => {
        if (
            !(
                d.startsWith("[WS => Shard 0] [HeartbeatTimer]") ||
                d.startsWith("[WS => Shard 0] Heartbeat acknowledged") ||
                d.startsWith('[WS => Shard 0] [ReadyHeartbeat] Sending a heartbeat.')
            )
        ) console.log(date(), 'Debug:', d)
    })
    .on("warn", (w) => console.warn(date(), 'Warn:', w))
    .on("shardError", (e) => console.error(date(), 'Shard Error:', e))
    .on("shardResume", (r) => console.log(date(), 'Shard Resume:', r))
    .on("webhookUpdate", console.log);
    

// Listener.once //
client
    .once("ready", (c) => onceReady(c))
    .once("shardReconnecting", onceShardReconnecting);

// Listener.on //
// Process.on //
process.on("unhandledRejection", (e) => console.error("Unhandled promise rejection:", e));
process.on("exit", (e) => console.error("Exit:", e));

// Client.on //
client
    .on("interactionCreate", onInteractionCreate)
    .on("message", onMessage)
    .on("channelCreate", onChannelCreate)
    .on("channelDelete", onChannelDelete)
    .on("messageUpdate", onMessageUpdate)
    .on("voiceStateUpdate", onVoiceStateUpdate);

export { developer, application };