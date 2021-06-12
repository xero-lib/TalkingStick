import { client } from "../../coagulators/configCoagulator.js";
import { date, setPresence } from "../../coagulators/functionCoagulator.js";
import chalk from "chalk";

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

  console.log(
    date(),
    `Currently in ${chalk.yellow(
      client.guilds.cache.map((guild) => guild.name).length
    )} servers`
  );
  console.log(date(), chalk.greenBright("Ready!"));
  setPresence();
}
