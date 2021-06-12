// Imports //
import { token, Discord } from "./coagulators/configCoagulator.js";
import {
  onMessage,
  onVoiceStateUpdate,
  onceReady,
  onChannelCreate,
  onChannelDelete,
  onMessageUpdate,
  onceShardReconnecting,
} from "./coagulators/listenerCoagulator.js";
import { date } from "./coagulators/functionCoagulator.js";

export const client = new Discord.Client({ fetchAllMembers: true });
console.log(client.options);

client
  .on("debug", (d) => {
    if (
      !(
        d.startsWith("[WS => Shard 0] [HeartbeatTimer]") ||
        d.startsWith(
          "[WS => Shard 0] Heartbeat acknowledged" ||
            d.startsWith(
              "[WS => Shard 0] [ReadyHeartbeat] Sending a heartbeat."
            )
        )
      )
    )
      console.log(date(), "Debug:", d);
  })
  .on("warn", (e) => console.log(date(), "Warn:", e))
  .on("shardError", (e) => console.log(date(), "Shard Error:", e))
  .on("shardResume", (r) => console.log(date(), "Shard Resume:", r))
  .on("webhookUpdate", console.log);

// Login //
client.login(token);

export const developer = (await client.fetchApplication()).owner,
  application = await client.fetchApplication();

// Listener.once //
client
  .once("ready", onceReady)
  .once("shardReconnecting", onceShardReconnecting);

// Listener.on //
// Process.on //
process.on("unhandledRejection", (error) =>
  console.error("Unhandled promise rejection:", error)
);
process.on("exit", (e) => console.error("Exit:", e));
// process.on('SIGINT'            , n     => {console.error('SIGINT recieved:'            , n    ); process.exit});

// Client.on //
client
  .on("message", onMessage)
  .on("channelCreate", onChannelCreate)
  .on("channelDelete", onChannelDelete)
  .on("voiceStateUpdate", onVoiceStateUpdate)
  .on("messageUpdate", onMessageUpdate);
