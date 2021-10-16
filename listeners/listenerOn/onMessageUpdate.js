import chalk from "chalk";
import { MessageEmbed, Message } from "discord.js";
import { date, CommandMap, datedErr } from "../../exports/functionExports.js";
import { client, botPfp, botName, developer, defaultPrefix as prefix } from "../../exports/configExports.js";

import "../../prototypes/tempSend.js";
import "../../prototypes/tempReply.js";

/**
 * @param {Message} message 
 * @returns {void}
 */

export default async function (_, message) {
    if (message.guild) {
        if (message.mentions.members.first()?.id === client.user.id){
            message.tempReply(`Please use \`${prefix}help\` for help`).catch(datedErr);
        }
        if (message.content.startsWith(prefix)) {
            let string = message.content.substring(prefix.length).split(/ +/,1)[0];
            let command = string.split(' ');
            if (command[0] in CommandMap) { // Check to see if command is defined in CommandMap
                CommandMap[command[0]](message, message.content.substring(prefix.length+command.length+1).split(/ +/)[1]);
            } else message.tempReply(`**\`${prefix}${command}\` is not a valid command.**`).catch(datedErr);
        }
    } else if (!message.author.bot) {
        console.log(date(),`DM from ${message.author.username}#${message.author.discriminator}\n\t${message.content}`);
        if (message.content.startsWith(prefix)) {
            const genHelpEmbed = new MessageEmbed();
            let string = message.content.substring(prefix.length).split(/ +/,1)[0];
            let command = string.split(' ');
            if(command[0] == "help") {
                let args = message.content.substring(prefix.length+command.length+3).split(/ +/)[1];
                if(args){
                    const helpEmbed = new MessageEmbed();
                    let contains = 0;
                    helpArr.forEach((e) => {
                        if(e[0] == args) {
                            helpEmbed
                                .setTitle(`**Help: \`${prefix}${e[0]}\`**`)
                                .setAuthor("Talking Stick", botPfp)
                                .setColor("GREEN")
                                .setDescription(e[1])
                                .addField(e[2], e[3])
                                .addField("**Exmple**", e[4])
                                .setFooter(`Minimum role of ${e[5]} required to execute this command`);
                            contains++;
                        } //^fix this with indexOf
                    });
            
                    if(contains == 0) {
                        message.channel.send(`${args} is not a valid command. For a list of commands, run \`${prefix}help\``)
                            .then(() => console.log(date(),`Successfully sent invalid command notification to ${message.author.username}#${message.author.discriminator} (${message.author.id}) in DMs`))
                            .catch(e => console.error(date(),`Could not send invalid command notification to ${message.author.username}#${message.author.discriminator} (${message.author.id}) in DMs:`,e));
                    }
                    if(contains != 0){
                        message.author.send(helpEmbed)
                            .then(() => {
                                console.log(date(),`Help has been sent to ${message.author.username} in DMs`);
                            })
                            .catch(e => {
                                console.error(date(),`Could not send Help Embed to ${message.author.username}#${message.author.discriminator} (${message.author.id}) in DMs:`,e);
                        });
                    }
                }
                else if(!args) {
                    genHelpEmbed
                        .setTitle("**Help**")
                        .setAuthor(botName, botPfp)
                        .setColor("GREEN")
                        .setDescription(`**The basic Talking Stick commands are \`${prefix}tsjoin\` which will allow you to start the Talking Stick, and \`${prefix}tspass\` to pass the talking stick.**\n\nTo get help on a specific command, run \`${prefix}help <command>\`.`)
                        .addField("Example",  `\`${prefix}help tsjoin\`.`)
                        .addField("Available help pages", `\`${helpArr.map((e) => e[0]).join('\n')}\``)
                    message.channel.send(genHelpEmbed)
                        .then(() => {
                            console.log(date(),`Help has been sent to ${message.author.username} in DMs`);
                        })
                        .catch(e => {
                            console.error(date(),`Could not send Help Embed to ${message.author.username}#${message.author.discriminator} (${message.author.id}) in DMs:`,e);
                        });
                }
            } else if(command[0] in CommandMap) {
                message.channel.send(`The command \`${message.content}\` must be ran in a server.`)
                    .catch(e => console.error(date(),`Could not send "Must use command in server" notification to ${message.author.username}#${message.author.discriminator} (${message.author.id}):`,e));
            } else {
                message.channel.send(`\`${message.content}\` is not a valid command.`).catch(console.err);
            }
        } else {
            let relatedServers = [];
            client.guilds.cache.map((g) => g.members.cache.map((m) => {
                if(m.id == message.author.id) {
                    relatedServers.push(g.name);          
                }
            }));
            console.log(date(), chalk.green("Related Servers to bot:\n") + relatedServers.join('\n'));
            let related = relatedServers.join('\n');
            const dmEmbed = new MessageEmbed()
                .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.avatarURL())
                // .setFooter(`${Date.prototype.getHours()}:${Date.prototype.getMinutes()}:${Date.prototype.getSeconds()}`)
                .setDescription(message.content);
            if (related){
                dmEmbed.addField("Servers", related);
            } else {
                dmEmbed.addField("Servers", "Unable to cache.");
            }
            developer.send(dmEmbed).catch(datedErr);
        }       
    }
}