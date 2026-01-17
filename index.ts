// Environment //
const isDev = process.env.NODE_ENV !== "production";

// Package Imports //
import {
    Client,
    GatewayIntentBits as Intents,
    Partials,
    Events,
    ClientApplication,
    User
} from "discord.js";

import pino, { pino as Logger } from "pino";
import pretty from "pino-pretty";

// Local Imports //
import { token } from "./config/botConfig";

import {
    handleReady,
    handleShardResume,
    handleMessageCreate,
    handleVoiceStateUpdate,
    handleInteractionCreate,
    handleShardReconnecting,
} from "./exports/listenerExports";

import { Roles } from "./exports/dataExports";

const stream = pretty({
    colorize: true,
    levelFirst: true,
    customPrettifiers: {
        time: () => `[${new Date().toISOString()}]`
    },
    ignore: "pid,hostname", // filter output
    sync: true
});

const baseLogger = Logger(
    {
        timestamp: pino.stdTimeFunctions.isoTime,
        level: isDev ? "trace" : "info",
    },
    stream
);

// initialize logger instance
// const baseLogger = Logger({
//     level: isDev ? "trace" : "info",
//     transport: { // not logging too terribly much so pretty should be fine
//         target: "pino-pretty",
//         options: {
//             destination: {
//                 dest: 1,
//                 sync: true
//             },
//             colorize: true,
//             colorizeObjects: true,
//             levelFirst: true,
//             translateTimestamp: "SYS:yyyy-mm-dd HH:MM:ss.l",
//             timestamp: "SYS:yyyy-mm-dd HH:MM:ss.l"
//         }
//     }
// });

// bind all logger levels
export const logger = {
    info:  baseLogger.info .bind(baseLogger),
    warn:  baseLogger.warn .bind(baseLogger),
    trace: baseLogger.trace.bind(baseLogger),
    error: baseLogger.error.bind(baseLogger),
    debug: baseLogger.debug.bind(baseLogger),
    fatal: baseLogger.fatal.bind(baseLogger),
};

const client = new Client({
    intents: [
        Intents.Guilds,
        Intents.DirectMessages,
        Intents.GuildMembers,
    ],
    partials: [
        Partials.Channel
    ]
});

const filterDebugRegex = /^\[WS => Shard \d+\] (\[(HeartbeatTimer|ReadyHeartbeat)\]|Heartbeat acknowledged)/;
const handleDebug = (d: string) => { if (!filterDebugRegex.test(d)) logger.debug(d) };

// client.once
client
    .once(Events.ClientReady , handleReady)
;

// client.on //
client
    .on(Events.ShardReady, (s) => logger.info(`Shard ${s} ready.`))
    .on(Events.ShardResume      , handleShardResume      )
    .on(Events.MessageCreate    , handleMessageCreate    )
    .on(Events.VoiceStateUpdate , handleVoiceStateUpdate )
    .on(Events.InteractionCreate, handleInteractionCreate)
    .on(Events.ShardReconnecting, handleShardReconnecting)

    .on(Events.Warn      , logger.warn)
    .on(Events.Debug     , handleDebug)
    .on(Events.Error     , (err) => { if (err.message !== "Unexpected EOF") logger.error(err); }) // suppress Deno's seemingly harmless ws hickups
    .on(Events.ShardError, logger.error)
;
    // .on("userUpdate", // might be useful for keeping track of user roles);

// Login // 
await client.login(token); // crash if login is unsuccessful

export type RoleMap = Map<string, Map<Roles, string>>;

const rolesMap: RoleMap = new Map();

const application: ClientApplication = await client.application!.fetch();

if (!application.owner) {
    logger.fatal("Unable to resolve owner.");
    process.exit("Unable to proceed without owner");
}

const developer = application.owner instanceof User ? application.owner : application.owner.members.first()!.user;


// Process.on //
process.on("unhandledRejection", logger.fatal); // this better not ever fire

export { client, developer, application, rolesMap };