import { developer } from "../barrels/configCoagulator.js.js";
import { setPresence } from "../barrels/functionCoagulator.js.js";
import { date } from "../barrels/functionCoagulator.js.js";

export default async function (message) {
  console.log(
    date(),
    `Refresh Presence requested by ${message.author.username}#${message.author.discriminator}`
  );
  if (message.member.id == (developer.id || "178973249500217344")) {
    setPresence().then(() => console.log(date(), "Presence set."));
  }
}
