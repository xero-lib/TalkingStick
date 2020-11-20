import { botInv } from "../config/botConfig.js";

export default async function (message) {
    message.channel.send(botInv)
        .then(s => console.log(`Successfully sent invite to ${message.author.username}#${message.author.discriminator} (${message.author.id}) in ${message.guild.name}`))
        .catch(e => console.error(`Could not send invite requested by ${message.author.username}#${message.author.discriminator} (${message.author.id}) in ${message.guild.name}`));
}