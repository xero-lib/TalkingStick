import chalk from "chalk";
import { EmbedBuilder, Message } from "discord.js";
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
            message.tempReply(`Please use \`/help\` for help`).catch(datedErr);
        }
        if (message.content.startsWith(prefix)) {
            let string = message.content.substring(prefix.length).split(/ +/,1)[0];
            let command = string.split(' ');
            if (command[0] in CommandMap) { // Check to see if command is defined in CommandMap
                CommandMap[command[0]](message, message.content.substring(prefix.length+command.length+1).split(/ +/)[1]);
            } else message.tempReply(`**\`/${command}\` is not a valid command.**`).catch(datedErr);
        }
    } else if (!message.author.bot) {
        console.log(date(),`DM from ${message.author.username}#${message.author.discriminator}\n\t${message.content}`);
        if (message.content.startsWith(prefix)) {
            let string = message.content.substring(prefix.length).split(/ +/,1)[0];
            let command = string.split(' ');
            if(command[0] == "help") {
                let args = message.content.substring(prefix.length+command.length+3).split(/ +/)[1];
                if(args){
                    const helpEmbed = new EmbedBuilder();
                    let contains = 0;
                    helpArr.forEach((e) => {
                        if(e[0] == args) {
                            helpEmbed
                                .setTitle(`**Help: \`/${e[0]}\`**`)
                                .setAuthor({ name: "Talking Stick", iconURL: botPfp })
                                .setColor("Green")
                                .setDescription(e[1])
                                .addFields([
                                    { name: e[2], value: e[3] },
                                    { name: "**Exmple**", value: e[4] }
                                ])
                                .setFooter({ text: `Minimum role of ${e[5]} required to execute this command` });
                            contains++;
                        } //^fix this with indexOf
                    });
            
                    if(contains == 0) {
                        message.channel.send(`${args} is not a valid command. For a list of commands, run \`/help\``)
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
                    const genHelpEmbed = new EmbedBuilder()
                        .setTitle("**Help**")
                        .setAuthor({ name: botName, iconURL: botPfp })
                        .setColor("Green")
                        .setDescription(`**The basic Talking Stick commands are \`/tsjoin\` which will allow you to start the Talking Stick, and \`/tspass\` to pass the talking stick.**\n\nTo get help on a specific command, run \`/help <command>\`.`)
                        .addFields([
                            { name: "Example", value: `\`/help tsjoin\`.` },
                            { name: "Available help pages", value: `\`${helpArr.map((e) => e[0]).join('\n')}\`` }
                        ]);
                    message.channel.send(genHelpEmbed)
                        .then(() => {
                            console.log(date(), `Help has been sent to ${message.author.username} in DMs`);
                        })
                        .catch(e => {
                            datedErr(`Could not send Help Embed to ${message.author.username}#${message.author.discriminator} (${message.author.id}) in DMs:`,e);
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
            const dmEmbed = new EmbedBuilder()
                .setAuthor({ name: `${message.author.tag} (${message.author.id})`, iconURL: message.author.avatarURL() })
                // .setFooter({ text: `${Date.prototype.getHours()}:${Date.prototype.getMinutes()}:${Date.prototype.getSeconds()}` })
                .setDescription(message.content);
            if (related){
                dmEmbed.addFields({ name: "Servers", value: related });
            } else {
                dmEmbed.addFields({ name: "Servers", value: "Unable to cache." });
            }
            developer.send(dmEmbed).catch(datedErr);
        }       
    }
}