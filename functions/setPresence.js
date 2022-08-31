import { date } from "../exports/functionExports.js";
import { client } from "../exports/configExports.js";
import { ActivityType, Client } from "discord.js";

setInterval(() => {
  console.log(date(), "SetPresence due to interval...")
  client.user.setPresence({
    status: "online",
    activity: {
      name: `/help`,
      type: "LISTENING"  
    }
  })
}, 3600000);

/**
 * 
 * @param {Client<true>} client 
 * @returns {void}
 */

export default async function (client) {
  client.user.setPresence({
    status: "online",
    activities: [{
      name: `/help`,
      type: ActivityType.Listening
    }]
  })
}
