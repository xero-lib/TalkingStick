import "../prototypes/tempReply.js";
import "../prototypes/tempSend.js";
import {
  someRole,
  findRole,
  destroyRole,
  date,
} from "../barrels/functionCoagulator.js.js";
import {
  Discord,
  roles,
  defaultPrefix as prefix,
} from "../barrels/configCoagulator.js.js";

export default async function (message) {
  if (message.member.hasPermission(8) || message.member.id == developer.id) {
    //if message author has admin perms
    const tsdestroyEmbed = new Discord.MessageEmbed();
    const s = "";
    if (findRole(message.guild, "TSLeft")) {
      let tsleftArray = findRole(message.guild, "TSLeft").members.map(
        (member) => member.user.username
      );
      tsleftArray.forEach((k) => (s += k + "\n"));
    }

    try {
      for (let roleIdx in roles) {
        if (someRole(message.guild, roles[roleIdx])) {
          await destroyRole(roles[roleIdx], message).catch((err) => {
            message
              .tempReply(
                `The bot most likely doesn't have sufficient permissions to complete this action. In server settings under roles, drag the \`Talking Stick\` role to the top. For more instruction on how to do this, scroll to the bottom of \`${prefix}help\``
              )
              .catch((e) => console.error(date(), e));
          });
          tsdestroyEmbed.addField(
            `__Destroying ${roles[roleIdx]}__`,
            `${roles[roleIdx]} has been destroyed.`
          );
        } else {
          tsdestroyEmbed.addField(
            `__Creating ${roles[roleIdx]}__`,
            `${roles[roleIdx]} is not present.`
          );
        }
      }
      if (s != "") {
        tsdestroyEmbed.addField(
          "**Users still muted:**\n",
          `${s}\n**These users must be manually unmuted the next time they join a voice channel.**`
        );
      }
      tsdestroyEmbed
        .setAuthor(
          `${message.author.username}#${message.author.discriminator} executed TSDestroy`,
          message.author.avatarURL()
        )
        .setColor("RED")
        .setFooter("Done.");
      message
        .tempSend(tsdestroyEmbed)
        .then(() =>
          console.log(
            date(),
            `Successfully sent tsdestroyEmbed in ${message.channel.name} in ${message.guild.name}`
          )
        );
    } catch (err) {
      console.error(date(), err);
      message.tempReply(
        `The bot most likely doesn\'t have sufficient permissions to complete this action. In server settings under roles, drag the \`Talking Stick\` role to the top. For more instruction on how to do this, scroll to the bottom of \`${prefix}help\``
      );
    }
    //w
  } else {
    message.tempReply("You do not have permission to do this.");
  }
}
