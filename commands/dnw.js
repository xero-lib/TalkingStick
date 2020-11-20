import '../prototypes/tempReply.js';
import Discord from 'discord.js';
import {developer} from '../coagulators/configCoagulator.js';

export default async function (message) {
    const dnwEmbed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL())
        .setDescription(message.content)
        .setFooter(message.createdTimestamp);
    developer.send(dnwEmbed);
    message.delete();
    message.tempReply('Message sent. Please also send a DM with a server invite and a screenshot/description of any problems you\'re having to the bot. The developer will be with you as soon as possible.');
}