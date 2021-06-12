import { findRole } from "../coagulators/functionCoagulator.js";
import { date } from "../coagulators/functionCoagulator.js";

export default async function (roleName, message) {
  try {
    await findRole(message.guild, roleName).delete(
      `TSDestroyed by ${message.author.name} (${message.author.id})`
    ); //delete Stick Controller
    console.log(
      date(),
      `Deleted role ${roleName} in ${message.guild.name} (${message.guild.id})`
    );
  } catch (err) {
    console.error(
      date(),
      `\n Error in ${message.guild} (${message.guild.id}) by ${message.member.displayName} (${message.member.id}):`,
      err
    );
    return;
  }
}
