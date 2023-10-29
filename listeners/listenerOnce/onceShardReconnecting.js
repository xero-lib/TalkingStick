import { setPresence, date } from '../../exports/functionExports.js';

export default async function (args) {
  console.log(date(),`Reconnecting...\n\t`,args);
  setPresence();
}