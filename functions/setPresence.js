import { client, defaultPrefix } from "../coagulators/configCoagulator.js";
import { date } from "../coagulators/functionCoagulator.js";

const intervalObj = setInterval(() => {
  console.log(date(), "SetPresence due to interval...");
  client?.user?.setPresence({
    status: "online",
    activity: {
      name: `${defaultPrefix}help`,
      type: "LISTENING",
    },
  });
}, 3600000);

export default async function () {
  client?.user?.setPresence({
    status: "online",
    activity: {
      name: `${defaultPrefix}help`,
      type: "LISTENING",
    },
  });
}
