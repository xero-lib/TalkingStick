import * as fs from 'fs';
import moment from 'moment';
import '../prototypes/tempReply.js';
import chalk from 'chalk';
import { developer, client, roles } from '../coagulators/configCoagulator.js';

export default async function (message) {
    if(message.author.id == developer.id){

        function eCall(e){if(e){throw e;}};

        if(!fs.existsSync('./logs/')) {fs.mkdir('./logs/', eCall)}
        if(!fs.existsSync('./logs/tscache')) {fs.mkdir('./logs/tscache', eCall)}
        
        var file = `./logs/tscache/guildsCache_${moment().format("YYYY[-]MM[-]DD_HH:mm:ss")}.txt`;

        client?.guilds?.cache?.map(g => {
            fs.appendFile(file,('Guild object:',g.toString()), eCall);
            fs.appendFile(file,`Roles for ${g.name}`, eCall);
            g.roles.cache.map(r => {
                fs.appendFile(file,r.name,e => eCall);
                fs.appendFile(file,r.toString(), eCall);
            })
            client?.channels?.cache?.map(c => {
                fs.appendFile(file,(`Channel object for ${c.name} in ${c.guild.name}:`,c.toString()),eCall)
            });
        })

        client?.guilds?.cache?.map(g => {
            console.log('Guild object:'.big,g.toString());
            console.log(`Roles for ${g.name}`.big);
            g.roles.cache.map(r => {
                console.log((r.name in roles.values) ? chalk.greenBright(r.name) : r.name);
                console.log(r);
            })
        })
        console.log(`\n${chalk.redBright.underline.red('====================')}\n${chalk.redBright('Channel Cache')}`);
        client?.channels?.cache?.map(c => console.log(c));
        console.log(`\n${chalk.redBright.underline.red('====================')}\n${chalk.redBright('User Cache')}`);
        client.users?.cache.map(u => console.log(u));
        console.log(`\n${chalk.redBright.underline.red('====================')}\n${chalk.redBright('Emoji Cache')}`);
        client?.emojis?.cache?.map(e => console.log(e));
        console.log(`\n${chalk.redBright.underline.red('====================')}\n${chalk.redBright('Recaching...')}`);

        for (const g of client?.guilds?.cache?.values()) {
            await g.members.fetch()
                .then((s) => {
                    console.log(chalk.greenBright(`"${g.name}" has been recached`));
                })
                .catch((e) => {
                    console.log(chalk.redBright(`Error recaching "${g.name}"\n`) + chalk.redBright(e))
                });
        }
    }
    else {
        message.tempReply('You do not have permission to execute this command. This incident has been reported.');
        console.log(chalk.redBright(`${message.author.username}#${message.author.discriminator} (${message.author.id}) attempted to execute RECACHE without permission.`));
        developer.send(`${message.author.username}#${message.author.discriminator} (${message.author.id}) attempted to execute RECACHE without permission in ${message.guild.name}.`);
    }
}