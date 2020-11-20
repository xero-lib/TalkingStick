import {client, botPage, botPfp, developer, Discord} from '../coagulators/configCoagulator.js';

export default async function (message, args) {
    
    if(message.author.id == developer.id){
        
        const reviewEmbed = new Discord.MessageEmbed()
            .setAuthor((await client.fetchApplication()).name, botPfp)
            .setColor('BLUE')
            .setTitle('**Enjoying Talking Stick?**')
            .setDescription('If you\'re enjoying Talking Stick, please consider reviewing and voting for it on the top.gg page associated with (linked on "Enjoying Talking Stick?"), along with any feedback you have! If you\'re not enjoying Talking Stick, please DM the bot or me (Silence#6134) any feedback you have.')
            .setFooter('Rating and voting on the bot helps it reach and help more people!')
            .setThumbnail(botPfp)
            .setURL(botPage)
            
            let serverOwners = [];

            for (const g of client.guilds.cache.values()) {
                if(serverOwners.indexOf(g.owner.user) == -1) {
                    serverOwners.push(g.owner.user);
                }
                else {
                    console.log(`${g.owner.user.username} has more than one server`);
                }
            }
            
            serverOwners.forEach(e => e.send(reviewEmbed).then(b => console.log(`Sent to ${e.username}`)).catch(c => console.log(`Could not send to ${e.username}\n` + c)));
    }
}