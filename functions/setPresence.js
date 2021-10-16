import { date, datedErr } from "../exports/functionExports.js";
import { client, defaultPrefix } from "../exports/configExports.js";

setInterval(() => {
  console.log(date(), "SetPresence due to interval...")
  client.user.setPresence({
    status: "online",
    activity: {
      name: `${defaultPrefix}help`,
      type: "LISTENING"  
    }
  }).catch(datedErr)
}, 3600000);

export default async function () {
  client.user.setPresence({
    status: "online",
    activity: {
      name: `${defaultPrefix}help`,
      type: "LISTENING"  
    }
  }).catch(datedErr)
}
