import '../prototypes/tempSend.js';
import Discord from 'discord.js';
import { developer, botPfp, client } from '../coagulators/configCoagulator.js';


export default async function (message) {
    if(message.author.id == developer.id){
        const statusEmbed = new Discord.MessageEmbed()
            .setAuthor('Talking Stick', botPfp)
            .setTitle('**STATUS**')
            .addField('Online Status', 'Online')
            .addField('Server Count', client.guilds.cache.array().length)
            .addField('User Count', client.users.cache.array().length)
            .addField('Uptime', (`${client.uptime/1000/60} minutes`));

        message.tempSend(statusEmbed);
        console.log(`Server Count: ${client.guilds.cache.array().length}\nUser Count: ${client.users.cache.array().length}\nUptime: ${client.uptime}`);
    }
}