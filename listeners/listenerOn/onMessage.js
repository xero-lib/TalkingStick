import chalk from "chalk";
import { Message, EmbedBuilder} from "discord.js"
import { date } from "../../exports/functionExports.js";
import { CommandMap, datedErr } from "../../exports/functionExports.js";
import { client, botPfp, botName, developer, defaultPrefix as prefix, helpMap } from "../../exports/configExports.js";

import "../../prototypes/tempSend.js";
import "../../prototypes/tempReply.js";

/**
 * @param {Message} message 
 * @returns {string}
 */

// const resolveCommand = (message) => message.content.substring(prefix.length).split(/ +/,1)[0].split(' ')[0]; 

/**
 * @param {Message} message
 * @returns {void}
 */

export default async function (message) {
    if (message.guild) return;
    // if (message.guild) {
    //     if (message.mentions.members.first()?.id == client.user.id) message.tempReply(`Please use \`/help\` for help`); else
        
    //     if (message.content.startsWith(prefix)) {
    //         let command = resolveCommand(message);
    //         if (command in CommandMap) CommandMap[command](message, message.content.split(/ +/)[1]);
    //         else message.tempReply(`**\`${message.content}\` is not a valid command.**`).catch(datedErr);
    //     }
    // } else 
    if (!message.author.bot) {
        // if (message.content.startsWith(prefix)) {
        //     let command = resolveCommand(message);
        //     if(command == "help") {
        //         let args = message.content.substring(prefix.length + command.length).split(/ +/,1)[1];
        //         if (args) {
        //             if (helpMap.has(args)) {
        //                 const cmd = helpMap.get(args);
                        
        //                 const helpEmbed = new EmbedBuilder()
        //                     .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
        //                     .setTitle(`**Help: \`/${args}\`**`)
        //                     .setDescription(cmd.description)
        //                     .addFields([
        //                         { name: cmd.argCount, value: cmd.arguments  },
        //                         { name: "**Exmple**", value: cmd.example    }
        //                     ])
        //                     .setFooter({ text: `Minimum role of ${cmd.minRole} required to execute this command` });
                        
        //                 message.channel.send(helpEmbed).catch((e) => {
        //                     datedErr(e);
        //                     message.author.send(`Could not send help for \`${args}\` in ${message.channel?.name ? message.channel.name : message.author.username}, sending help message here.\n` + helpEmbed).catch(datedErr);
        //                 });
        //             } else message.tempReply(`${args} is not a valid command. For a list of commands, run \`/help\``).catch(datedErr);
        //         } else if(!args) {
        //             const genHelpEmbed = new EmbedBuilder()
        //                 .setTitle("**Help**")
        //                 .setAuthor({ name: botName, iconURL: botPfp })
        //                 .setColor("GREEN")
        //                 .setDescription(`**The basic Talking Stick commands are \`/tsjoin\` which will allow you to start the Talking Stick, and \`/tspass\` to pass the talking stick.**\n\nTo get help on a specific command, run \`/help <command>\`.`)
        //                 .addFields([
        //                     { name: "Example", value: `\`/help tsjoin\`.` },
        //                     { name: "Available help pages", value: `\`${helpArr.map((e) => e[0]).join('\n')}\`` }
        //                 ]);

        //             message.channel.send(genHelpEmbed).catch((e) => console.error(date(),`Could not send Help Embed to ${message.author.tag} (${message.author.id}) in DMs:`,e));
        //         }
        //     } else if (command in CommandMap) {
        //         message.channel.send(`The command \`${message.content}\` must be ran in a server.`)
        //             .catch((e) => datedErr(`Could not send "Must use command in server" notification to ${message.author.tag} (${message.author.id}):`,e));
        //     } else message.channel.send(`\`${message.content}\` is not a valid command.`).catch(console.err);
        // } else {
        let relatedServers = [];
        
        client.guilds.cache.map((g) => g.members.cache.map((m) => { if(m.id == message.author.id) relatedServers.push(g.name) }));
        let related = relatedServers.join('\n');
        
        const dmEmbed = new EmbedBuilder()
            .setAuthor({ name: `${message.author.tag} (${message.author.id})`, iconURL: message.author.avatarURL() })// .setFooter({ text: `${Date.prototype.getHours()}:${Date.prototype.getMinutes()}:${Date.prototype.getSeconds()}` })
            .setDescription(message.content);

        if (message.attachments) {
            message.attachments.forEach(a => dmEmbed.attachFiles(a));
            message.attachments.forEach(a => (a.height || a.width) && (!dmEmbed.image) ? dmEmbed.setImage(a.url) : {});
        } else if (relatedServers.length > 0) {
            dmEmbed.addFields([{ name: "Servers", value: related }]);
        } else dmEmbed.addFields([{ name: "Servers", value: "None found." }]);

        developer.send({ embeds: [dmEmbed] })
            .then(() => message.react("✅"))
            .catch((e) => {
                console.error(date(),`Error sending message from ${message.author.username}#${message.author.discriminator} (${message.author.id}):`,e)
                message.channel.send("There was an error sending the message, try again in a little while, add Thoth#6134, or join the support server: https://discord.gg/Jxe7mK2dHT");
            });  
        
    }
}