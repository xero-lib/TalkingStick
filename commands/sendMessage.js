import '../prototypes/tempReply.js';
import { defaultPrefix as prefix, client, developer } from '../coagulators/configCoagulator.js';
import Discord from 'discord.js';
import { date } from '../coagulators/functionCoagulator.js';
3
export default async function (message, args, command) {
    let msgSend = message.content.replace(`${prefix+command} ${args}`, "");
    let sentUser = client.users.cache.get(args);
    const sendMessageEmbed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL())
        .setDescription(msgSend);
    
    if(sentUser) sentUser.send(sendMessageEmbed)
        .then(s => {
            console.log(date,`Successfully sent message to ${sentUser.username}#${sentUser.discriminator} (${args})`);
            sendMessageEmbed
                .setAuthor(`From ${message.author.username}#${message.author.discriminator} to ${sentUser.username}#${sentUser.discriminator} (${sentUser.id})`, developer.avatarURL())
                .setTitle(`Sent to ${sentUser.username}#${sentUser.discriminator} (${sentUser.id})`)
                .setThumbnail(sentUser.avatarURL());
            message.tempReply(`Successfully sent message to ${sentUser.username}#${sentUser.discriminator} (${args})`);
            developer.send(sendMessageEmbed);
        })
        .catch(e => {
            console.log(date,`There was an error sending the message to ${sentUser.username}#${sentUser.discriminator} (${args})\n` + e);
            message.author.send(`There was an error sending the message to ${sentUser.username}#${sentUser.discriminator} (${args})\n \`\`\`js\n${e}\n\`\`\``);
        });
    else{
        console.log(date,`Could not send message to ${args} as they are most likely not in the cache.`);
        message.tempReply(`Unable to send message to ${args}`);
    }
}