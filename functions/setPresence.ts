import { ActivityType, Client } from "discord.js";
// import { client as globalClient} from "../exports/configExports.js";
// import { logger } from "../index.js";

/**
 * Handles the setPresence functionality for interval and manual presence updates.
 * @param client The {@link Client} object to set presence of.
 */
export default async function setPresence(client: Client<true>) {
  client.user.setPresence({
    status: "online",
    activities: [{
      name: `DM for questions or concerns.`,
      type: ActivityType.Listening
    }]
  });
}

/* Let's see if Discord fixed their "let's randomly clear the bot status" issue. */
// setInterval(() => {
//   if (globalClient.isReady()) {
//     logger.debug("setPresence due to interval...");
//     setPresence(globalClient);
//   } else logger.error("Non-ready client was encountered during attempted setPresence...");
// }, 3600000);

