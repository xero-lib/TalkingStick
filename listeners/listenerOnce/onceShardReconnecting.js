import { setPresence, date } from "../../coagulators/functionCoagulator.js";

export default async function (args) {
  console.log(date(), `Recconnecting...\n\t`, args);
  try {
    setPresence();
  } catch (err) {
    console.error(
      date(),
      "An error was encountered while running setPresence during reconnect:",
      err
    );
  }
}
