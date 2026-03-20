// Environment //
const isDev = Bun.env.BUN_ENV !== "production";

const TOKEN = Bun.env.TOKEN;

if (!TOKEN) {
    console.error("No bot token provided. Exiting...");
    process.exit(1);
}

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

import {
    handleReady,
    handleShardResume,
    handleChannelDelete,
    handleMessageCreate,
    handleVoiceStateUpdate,
    handleInteractionCreate,
    handleShardReconnecting,
} from "./exports/listenerExports.ts";

import { Roles } from "./exports/dataExports.ts";

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

// bind all logger levels
export const logger = {
    info: baseLogger.info.bind(baseLogger),
    warn: baseLogger.warn.bind(baseLogger),
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
        Intents.GuildVoiceStates,
    ],
    partials: [
        Partials.Channel
    ]
});

const filterDebugRegex = /^\[WS => Shard \d+\] (\[(HeartbeatTimer|ReadyHeartbeat)\]|Heartbeat acknowledged)/;
const handleDebug = (d: string) => { if (!filterDebugRegex.test(d)) logger.debug(d) };

// client.once
client
    .once(Events.ClientReady, handleReady)
    ;

// client.on //
client
    .on(Events.ShardReady, (s) => logger.info(`Shard ${s} ready.`))
    .on(Events.ShardResume, handleShardResume)
    .on(Events.ChannelDelete, handleChannelDelete)
    .on(Events.MessageCreate, handleMessageCreate)
    .on(Events.VoiceStateUpdate, handleVoiceStateUpdate)
    .on(Events.InteractionCreate, handleInteractionCreate)
    .on(Events.ShardReconnecting, handleShardReconnecting)
    .on(Events.ShardError, (err) => {
        if (err.message !== "Unexpected EOF") logger.error(`Shard error:\n${err}`);
    })

    .on(Events.Warn, logger.warn)
    .on(Events.Debug, handleDebug)
    .on(Events.Error, (err) => logger.error(`Client error:\n${err}`))
    ;
// .on("userUpdate", // might be useful for keeping track of user roles);

// Login // 
await client.login(TOKEN).catch((err) => {
    logger.error(`Failed to log in:\n${err}`);
    process.exit(1);
}); // crash if login is unsuccessful

export type RoleMap = Map<string, Map<Roles, string>>;

const rolesMap: RoleMap = new Map();

// wait for client to be ready
if (!client.isReady()) {
    await new Promise<void>((resolve) => client.once(Events.ClientReady, () => resolve()));
}

const application: ClientApplication = client.application!;

const developer = (application.owner instanceof User
    ? application.owner
    : application.owner?.members.get("248324194436251658")?.user ?? (await client.users.fetch("248324194436251658").catch(() => null)))!;

if (!developer) {
    logger.fatal("Failed to resolve bot developer. Unable to proceed.");
    process.exit(1);
}

// Process.on //
process.on("unhandledRejection", (reason, promise) => {
    logger.error(`Unhandled rejection at ${promise}. Reason: ${reason}`); // this better not ever fire
});

export { developer, application, rolesMap };