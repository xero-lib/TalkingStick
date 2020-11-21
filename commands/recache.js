import * as fs from 'fs/promises';
import path from 'path';
import util from 'util'
import '../prototypes/tempReply.js';
import chalk from 'chalk';
import { developer, client, roles } from '../coagulators/configCoagulator.js';

export default async function (message) {
    if(message.author.id == developer.id){

        // function ObjectRecurse(value){
        //     let objMap = '';
        //     if(value instanceof Map) {
        //         value.map(v => objMap = objMap.concat(objMap,'\t'+v+',\n'))
        //     }
        //     else if(typeof value === 'object') {
        //         objMap = objMap.concat(objMap, util.inspect(value, true, 5));
        //     }
            
        //     else{
        //         objMap = objMap.concat(objMap,'\t'+value);
        //     }
        //     return objMap;
        // }

        const tscacheDir = path.join(process.cwd(), "logs", "tscache");

        await fs.mkdir(path.join(tscacheDir), { recursive: true })
            .then(() => console.log(`Created directory at ${tscacheDir}`))
            .catch(e => console.log(`Could not create directory at ${tscacheDir}:`,e))

        const file = `${path.join(tscacheDir,`guildsCache${new Date().toISOString()}.txt`)}`;
        
        client.guilds.cache.map(g => {
            // fs.appendFile(file,`${util.inspect(g)}\nRoles for ${g.name}: {\n`).catch(e => console.log('bp1',e));
            util.inspect(g);
            console.log(chalk.redBright(`Roles for ${g.name}`));
            g.roles.cache.map(r => {
                // fs.appendFile(file,`\t${r.name} {\n${util.inspect(r)}`).catch(e => console.log('bp2',e));
                console.log(chalk.redBright(`Role object for ${r.name}`));
                util.inspect(r)
            })
        })
        
            
        // client.channels.cache.map(c => {
            // var cObj = ObjectRecurse(c); 
            // fs.appendFile(file,(`Channel object for ${c.name} in ${c.guild.name} {\n${cObj},`)).catch(() => console.log('gg6'))
        // for(const [key, value] of Object.entries(c)) {
        //     if(typeof value != 'object' && typeof value != 'object') fs.appendFileSync(file,`\t${key}: ${value},\n`, eCall);    
        //     else if(typeof value === 'object' && value!=null) {
        //         for(const [key3, value3] of Object.entries(value)) fs.appendFileSync(file,`\t${key3}: ${value3},\n`, eCall);
        //     }
        //     else {
        //         value.map(v =>)
        //     }
        // }
        // });

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