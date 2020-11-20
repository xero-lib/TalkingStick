
import {client, defaultPrefix as prefix} from '../../coagulators/configCoagulator.js';
import chalk from 'chalk';

export default async function () {
    // await client.fetchAllMembers(m => {
    //     console.log(m, 'cached')
    // })
    // .then(console.log)
    // .catch(console.error)

    // for (const g of client.guilds.cache.values()) {
    //     await g.members.fetch()
    //         .then((s) => {
    //             console.log(chalk.green(`"${g.name}" has been cached`));
    //         })
    //         .catch((e) => {
    //             console.log(`Error caching ${g.name}`)
    //         });
    // }

    console.log(`Currently in ${chalk.yellow(client.guilds.cache.map(guild => guild.name).length)} servers:\n`);
    console.log(chalk.greenBright('Ready!'));

    client.user.setPresence({
        status: 'online',
        activity: {
          name: `${prefix}help`,
          type: 'LISTENING'  
        }
    });
}