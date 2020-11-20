import '../prototypes/tempReply.js';
import chalk from 'chalk';
import { developer, client } from '../coagulators/configCoagulator.js';

export default async function (message) {
    if(message.author.id == developer.id){
        client.guilds.cache.map(console.log);
        console.log(`\n${chalk.redBright.underline.red('====================')}`);
        client.channels.cache.map(console.log);
        console.log(`\n${chalk.redBright.underline.red('====================')}`);
        client.users.cache.map(console.log);
        console.log(`\n${chalk.redBright.underline.red('====================')}`);
        console.log(chalk.bold('Recaching...'));
        for (const g of client.guilds.cache.values()) {
            await g.fetch()
                .then((s) => {
                    console.log(chalk.greenBright(`"${g.name}" has been hard recached`));
                })
                .catch((e) => {
                    console.log(chalk.redBright(`Error hard recaching "${g.name}"\n`) + chalk.redBright(e))
                });
        }}
        else {
            message.tempReply('You do not have permission to execute this command. This incident has been reported.');
            console.log(chalk.redBright(`${message.author.username}#${message.author.discriminator} (${message.author.id}) attempted to execute HARDRECACHE without permission.`));
            developer.send(`${message.author.username}#${message.author.discriminator} (${message.author.id}) attempted to execute HARDRECACHE without permission in ${message.guild.name}.`);
        }
}