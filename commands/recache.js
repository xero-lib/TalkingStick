import * as fs from "fs/promises";
import path from "path";
import util from "util";
import "../prototypes/tempReply.js";
import chalk from "chalk";
import { developer, client, roles } from "../barrels/configCoagulator.js.js"; //see if a server has the ts roles
import { date } from "../barrels/functionCoagulator.js.js";

export default async function (message) {
  if (message.author.id == developer.id) {
    const tscacheDir = path.join(process.cwd(), "logs", "tscache");

    await fs
      .mkdir(path.join(tscacheDir), { recursive: true })
      .then(() => console.log(date(), `Created directory at ${tscacheDir}`))
      .catch((e) =>
        console.log(date(), `Could not create directory at ${tscacheDir}:`, e)
      );

    const file = `${path.join(
      tscacheDir,
      `guildsCache${new Date().toISOString()}.txt`
    )}`;

    console.log(
      `${chalk.redBright.underline.red(
        "===================="
      )}\n${chalk.redBright("User Cache")}`
    );
    client.users.cache.map((u) => {
      console.log(date(), chalk.redBright(`User object for ${u.username}: `));
      console.log(util.inspect(u));
    });
    console.log(
      date(),
      `\n${chalk.redBright.underline.red(
        "===================="
      )}\n${chalk.redBright("Guild Cache")}`
    );
    client.guilds.cache.map((g) => {
      // fs.appendFile(file,`${util.inspect(g)}\nRoles for ${g.name}: {\n`).catch(e => console.log('bp1',e));
      console.log(util.inspect(g));
      console.log(
        `${chalk.redBright.underline.red(
          "===================="
        )}\n${chalk.redBright("Channel Cache")}`
      );
      g.channels.cache.map((c) => {
        console.log(
          chalk.redBright(`Channel object for ${c.name}:`, util.inspect(c))
        );
      });

      console.log(date(), chalk.redBright(`Roles for ${g.name}:\n`));
      g.roles.cache.map((r) => {
        // fs.appendFile(file,`\t${r.name} {\n${util.inspect(r)}`).catch(e => console.log('bp2',e));
        console.log(
          chalk.redBright(`\tRole object for ${r.name}:`, util.inspect(r))
        );
      });
    });

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

    client.users?.cache.map((u) => console.log(u));
    console.log(
      date(),
      `--v--\n${chalk.redBright.underline.red(
        "===================="
      )}\n${chalk.redBright("Recaching...")}`
    );

    for (const g of client?.guilds?.cache?.values()) {
      await g.members
        .fetch()
        .then((s) => {
          console.log(
            date(),
            chalk.greenBright(`"${g.name}" has been recached`)
          );
        })
        .catch((e) => {
          console.log(
            date(),
            chalk.redBright(`Error recaching "${g.name}"\n`) +
              chalk.redBright(e)
          );
        });
    }
  } else {
    message.tempReply(
      "You do not have permission to execute this command. This incident has been reported."
    );
    console.log(
      date(),
      chalk.redBright(
        `${message.author.username}#${message.author.discriminator} (${message.author.id}) attempted to execute RECACHE without permission.`
      )
    );
    developer.send(
      `${message.author.username}#${message.author.discriminator} (${message.author.id}) attempted to execute RECACHE without permission in ${message.guild.name}.`
    );
  }
}
