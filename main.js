// Imports //
import { token, Discord } from './coagulators/configCoagulator.js';
import { onMessage, onVoiceStateUpdate, onceReady, onChannelCreate, onChannelDelete, onMessageUpdate, onceShardReconnecting } from './coagulators/listenerCoagulator.js';

export const client = new Discord.Client({fetchAllMembers: true});
console.log(client.options);

client
  .on("debug", d => {if(!(d.startsWith('[WS => Shard 0] [HeartbeatTimer]') || d.startsWith('[WS => Shard 0] Heartbeat acknowledged'))) console.log(d)})
  .on("warn", e => console.log('Warn:',e))
  .on("shardError", console.log)
  .on("shardResume", console.log)
  .on("webhookUpdate", console.log);

// Login //
client.login(token);

export const
    developer = (client.fetchApplication()).owner,
    application = (client.fetchApplication());

// Listener.once //
client
    .once('ready'            , onceReady            )
    .once('shardReconnecting', onceShardReconnecting);

// Listener.on //
    // Process.on //
        process.on("unhandledRejection", error => console.error("Unhandled promise rejection:", error));
        process.on('exit'              , e     => console.error('Exit:'                       , e    ));
        // process.on('SIGINT'            , n     => console.error('SIGINT recieved:'            , n    ));

    // Client.on //
        client
            .on('message'         , onMessage         )
            .on('channelCreate'   , onChannelCreate   )
            .on('channelDelete'   , onChannelDelete   )
            .on("voiceStateUpdate", onVoiceStateUpdate)
            .on('messageUpdate'   , onMessageUpdate   );



