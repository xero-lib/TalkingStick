// Imports //
import { token } from "./exports/configExports.js";
import { 
    onMessage,
    onVoiceStateUpdate,
    onceReady,
    onChannelCreate,
    onChannelDelete,
    onMessageUpdate,
    onceShardReconnecting
} from "./exports/listenerExports.js";
import { date } from "./exports/functionExports.js";
import { Client, User } from "discord.js";

export const /** @type {Client} */ client = new Client({fetchAllMembers: true});
console.log(client.options);

client
  .on("debug", d => {
      if(
          !(
              d.startsWith("[WS => Shard 0] [HeartbeatTimer]") ||
              d.startsWith("[WS => Shard 0] Heartbeat acknowledged") ||
              d.startsWith('[WS => Shard 0] [ReadyHeartbeat] Sending a heartbeat.')
            )
        ) console.log(date(), 'Debug:', d)})
  .on("warn", (e) => console.log(date(), 'Warn:',e))
  .on("shardError", (e) => console.log(date(), 'Shard Error:', e))
  .on("shardResume", (r) => console.log(date(), 'Shard Resume:', r))
  .on("webhookUpdate", console.log);

// Login //
client.login(token);

export const
    /** @type {User} */ developer = (await client.fetchApplication()).owner,
    application = (await client.fetchApplication());

// Listener.once //
client
    .once("ready"            , onceReady            )
    .once("shardReconnecting", onceShardReconnecting);

// Listener.on //
    // Process.on //
        process.on("unhandledRejection", (e) => console.error("Unhandled promise rejection:", e));
        process.on("exit", (e) => console.error("Exit:", e));

    // Client.on //
        client
            .on("message"         , onMessage         )
            .on("channelCreate"   , onChannelCreate   )
            .on("channelDelete"   , onChannelDelete   )
            .on("voiceStateUpdate", onVoiceStateUpdate)
            .on("messageUpdate"   , onMessageUpdate   );
