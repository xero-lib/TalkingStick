import "../prototypes/tempReply.js";
import { defaultPrefix as prefix } from "../coagulators/configCoagulator.js";
import { date } from "../coagulators/functionCoagulator.js";

export default async function (roleName, message, roleColor) {
  try {
    message.guild.roles.create({
      data: {
        name: roleName,
        color: roleColor,
      },
      reason: `Created ${roleName}`,
    });
    console.log(
      date(),
      `Created ${roleName} in ${message.guild} (${message.guild.id})`
    );
  } catch (err) {
    console.error(
      date(),
      `Error in ${message.guild} (${message.guild.id}), Create Role command failed. Command issued by ${message.member.displayName} (${message.member.id}):`,
      err
    );
    message.tempReply(
      `Unable to create role. Check the bottom of \`${prefix}help\``
    );
    return;
  }
}
