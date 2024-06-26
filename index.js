// Imports //
import { token } from "./config/botConfig.js";
import { date, datedErr } from "./exports/functionExports.js";
import { Client, User, IntentsBitField, Partials } from "discord.js";

import {
    onMessage,
    onVoiceStateUpdate,
    // onChannelCreate,
    // onChannelDelete,
    onInteractionCreate,
    onceReady,
    onceShardReconnecting,
} from "./exports/listenerExports.js";

export const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.DirectMessages,
        // IntentsBitField.Flags.GuildMembers,
    ],
    partials: [
        Partials.Channel
    ]
 });
console.warn(client.options);

// Login //
let application;
/** @type {User} */ let developer;

client.login(token).then(async () => {
    application = await client.application.fetch();
    /** @type {User} */ developer = application.owner;
});

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
    .on("error", datedErr)
    .on("warn", (w) => console.warn(date(), 'Warn:', w))
    .on("shardError", (e) => datedErr('Shard Error:', e))

// Listener.once //
client
    .once("ready", onceReady)
    .once("shardReconnecting", onceShardReconnecting);

// Listener.on //
// Process.on //
process.on("unhandledRejection", (e) => console.error("Unhandled promise rejection:", e));
process.on("exit", (e) => console.error("Exit:", e));

// Client.on //
client
    .on("interactionCreate", onInteractionCreate)
    .on("messageCreate", onMessage)
    // .on("channelCreate", onChannelCreate)
    // .on("channelDelete", onChannelDelete)
    .on("voiceStateUpdate", onVoiceStateUpdate);
    // .on("userUpdate", // might be useful for keeping track of user roles);

export { developer, application };