import "../prototypes/tempSend.js";
import Discord from "discord.js";
import { developer, botPfp, client } from "../barrels/configCoagulator.js.js";
import { date } from "../barrels/functionCoagulator.js.js";

export default async function (message) {
  if (message.author.id == developer.id) {
    const statusEmbed = new Discord.MessageEmbed()
      .setAuthor("Talking Stick", botPfp)
      .setTitle("**STATUS**")
      .addField("Online Status", "Online")
      .addField("Server Count", client.guilds.cache.array().length)
      .addField("User Count", client.users.cache.array().length)
      .addField("Uptime", `${client.uptime / 1000 / 60} minutes`);

    message.tempSend(statusEmbed);
    console.log(
      date(),
      `Server Count: ${client.guilds.cache.array().length}\nUser Count: ${
        client.users.cache.array().length
      }\nUptime: ${client.uptime}`
    );
  }
}
