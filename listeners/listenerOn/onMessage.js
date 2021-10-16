import chalk from "chalk";
import { Message, MessageEmbed} from "discord.js"
import { date } from "../../exports/functionExports.js";
import { CommandMap, datedErr } from "../../exports/functionExports.js";
import { client, botPfp, botName, developer, defaultPrefix as prefix, helpMap } from "../../exports/configExports.js";

import "../../prototypes/tempSend.js";
import "../../prototypes/tempReply.js";

/**
 * @param {Message} message 
 * @returns {string}
 */

const resolveCommand = (message) => message.content.substring(prefix.length).split(/ +/,1)[0].split(' ')[0]; 

/**
 * @param {Message} message
 * @returns {void}
 */

export default async function (message) {
    if (message.guild) {
        if (message.mentions.members.first()?.id == client.user.id) message.tempReply(`Please use \`${prefix}help\` for help`); else
        
        if (message.content.startsWith(prefix)) {
            let command = resolveCommand(message);
            if (command in CommandMap) CommandMap[command](message, message.content.split(/ +/)[1]);
            else message.tempReply(`**\`${message.content}\` is not a valid command.**`).catch(datedErr);
        }
    } else if (!message.author.bot) {
        console.log(date(),`DM from ${message.author.tag}\n\t${message.content}`);
        if (message.content.startsWith(prefix)) {
            let command = resolveCommand(message);
            if(command == "help") {
                let args = message.content.substring(prefix.length + command.length).split(/ +/,1)[1];
                if (args) {
                    const helpEmbed = new MessageEmbed();
                    if (helpMap.has(args)) {
                        const cmd = helpMap.get(args);

                        helpEmbed
                            .setAuthor(message.author.username, message.author.avatarURL())
                            .setTitle(`**Help: \`${prefix}${args}\`**`)
                            .setDescription(cmd.description)
                            .addField(cmd.argCount, cmd.arguments)
                            .addField("**Exmple**", cmd.example)
                            .setFooter(`Minimum role of ${cmd.minRole} required to execute this command`);
                        
                        message.channel.send(helpEmbed).catch((e) => {
                            datedErr(e);
                            message.author.send(`Could not send help for \`${args}\` in ${message.channel?.name ? message.channel.name : message.author.username}, sending help message here.\n` + helpEmbed).catch(datedErr);
                        });
                    } else message.tempReply(`${args} is not a valid command. For a list of commands, run \`${prefix}help\``).catch(datedErr);
                } else if(!args) {
                    const genHelpEmbed = new MessageEmbed()
                        .setTitle("**Help**")
                        .setAuthor(botName, botPfp)
                        .setColor("GREEN")
                        .setDescription(`**The basic Talking Stick commands are \`${prefix}tsjoin\` which will allow you to start the Talking Stick, and \`${prefix}tspass\` to pass the talking stick.**\n\nTo get help on a specific command, run \`${prefix}help <command>\`.`)
                        .addField("Example",  `\`${prefix}help tsjoin\`.`)
                        .addField("Available help pages", `\`${helpArr.map((e) => e[0]).join('\n')}\``)

                    message.channel.send(genHelpEmbed).catch((e) => console.error(date(),`Could not send Help Embed to ${message.author.tag} (${message.author.id}) in DMs:`,e));
                }
            } else if (command in CommandMap) {
                message.channel.send(`The command \`${message.content}\` must be ran in a server.`)
                    .catch((e) => datedErr(`Could not send "Must use command in server" notification to ${message.author.tag} (${message.author.id}):`,e));
            } else message.channel.send(`\`${message.content}\` is not a valid command.`).catch(console.err);
        } else {
            let relatedServers = [];
            
            client.guilds.cache.map((g) => g.members.cache.map((m) => { if(m.id == message.author.id) relatedServers.push(g.name) }));
            console.log(date(), chalk.green("Related Servers to bot:\n") + relatedServers.join('\n'));
            let related = relatedServers.join('\n');
            
            const dmEmbed = new MessageEmbed()
                .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.avatarURL())// .setFooter(`${Date.prototype.getHours()}:${Date.prototype.getMinutes()}:${Date.prototype.getSeconds()}`)
                .setDescription(message.content);

            if (message.attachments) {
                message.attachments.forEach(a => dmEmbed.attachFiles(a));
                message.attachments.forEach(a => (a.height || a.width) && (!dmEmbed.image) ? dmEmbed.setImage(a.url) : {});
            } else if (related) {
                dmEmbed.addField("Servers", related);
            } else dmEmbed.addField("Servers", "None found.");

            developer.send(dmEmbed)
                .then(() => message.react("✅"))
                .catch((e) => {
                    console.error(date(),`Error sending message from ${message.author.username}#${message.author.discriminator} (${message.author.id}):`,e)
                    message.channel.send("There was an error sending the message, try again in a little while, add Silence#6134, or join the support server: https://discord.gg/Jxe7mK2dHT");
                });  
        }       
    }
}