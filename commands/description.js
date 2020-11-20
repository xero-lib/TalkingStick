import Discord from 'discord.js';
import {defaultPrefix, botPfp} from '../coagulators/configCoagulator.js';

export default async function (message) {
    const descriptionEmbed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setThumbnail(botPfp)
        .setTitle('**Talking Stick**')
        .setDescription("A bot that can act as a talking stick!\n\n If one person has the talking stick, no one else can speak/type (depending on if you tell it to join a voice channel or a text channel).\n\n However, if you have the talking stick (or the special stick controller role) you can pass the talking stick to someone else so that they can talk!\n\nYou can even have multiple talking sticks so that several people can talk at the same time, but everyone else is muted in that channel.\n")
        .setFooter(`To get an invite link, type ${defaultPrefix}invite`);
    message.channel.send(descriptionEmbed).catch(console.error);
}