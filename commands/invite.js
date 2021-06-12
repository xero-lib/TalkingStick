import { botInv } from "../config/botConfig.js";
import { date } from "../barrels/functionCoagulator.js.js";

export default async function (message) {
  message.channel
    .send(botInv)
    .then(() =>
      console.log(
        date(),
        `Successfully sent invite to ${message.author.username}#${message.author.discriminator} (${message.author.id}) in ${message.guild.name}`
      )
    )
    .catch((e) =>
      console.error(
        date(),
        `Could not send invite requested by ${message.author.username}#${message.author.discriminator} (${message.author.id}) in ${message.guild.name}:`,
        e
      )
    );
}
