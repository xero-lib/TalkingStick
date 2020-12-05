import '../../prototypes/tempReply.js';
import '../../prototypes/tempSend.js';
import chalk from 'chalk';
import { Discord, client, botPfp, botName, developer, defaultPrefix as prefix } from '../../coagulators/configCoagulator.js';
import CommandMap from '../../functions/CommandMap.js';
import { date } from '../../coagulators/functionCoagulator.js';

const helpArr = [
    ['help'      , `DMs the user help for a given command.`                                                                                                                                                                   , 'Takes one argument:', '<command>'                        , `\`${prefix}help tsjoin\``              , 'everyone'        ], 
    ['tsinit'    , `Creates all necessary roles for Talking Stick.`                                                                                                                                                           , 'Takes no argument'  , 'N/A'                              , `\`${prefix}tsinit\``                   , 'Administrator'   ],
    ['tsjoin'    , `Activates Talking Stick in either a voice or a text channel depending on the passed argument. This will mute everyone except the member who sent the command, and assign the special Talking Stick roles.`, 'Takes one argument' , '<`voice` or `text`>'              , `\`${prefix}tsjoin text\``              , 'Stick Controller'],
    ['tsleave'   , `Deactivates Talking Stick in either a voice or a text channel depending on the passed argument. This will allow everyone to talk again, and return them to their original roles.`                         , 'Takes one argument' , '<`voice` or `text`>'              , `\`${prefix}tsleave text\``             , 'Stick Controller'],
    ['tspass'    , `If you have the talking stick, you can pass it to someone else.`                                                                                                                                          , 'Takes two arguments', '<`voice` or `text`> <ping a user>', `\`${prefix}tspass text @Silence#6134\``, 'Stick Holder'    ],
    ['tsdestroy' , `Deletes all roles created by the bot. **Warning**: any users still muted due to Talking Stick will remain muted until unmuted by a moderator.`                                                            , 'Takes no argument'  , 'N/A'                              , `\`${prefix}tsdestroy`                  , 'Administrator'   ],
    ['tsgivecon' , `Allows you to give another user the \`Stick Controller\` role.`                                                                                                                                           , 'Takes one argument' , '<ping a user>'                    , `\`${prefix}tsgivecon @Silence#6134\``  , 'Stick Controller'],
    ['tsremcon'  , `Allows you to remove another user from the \`Stick Controller\` role.`                                                                                                                                    , 'Takes one argument' , '<ping a user>'                    , `\`${prefix}tsremcon @Silence#6134\``   , 'Stick Controller'],
    ['tsaddstick', `Allows you to give another user in the voice channel a talking stick, while keeping your own.`                                                                                                            , 'Takes one argument' , '<ping a usre>'                    , `\`${prefix}tsaddstick @Silence#6134\`` , 'Stick Controller'],
    ['tsremstick', `Allows you to take a stick from a mentioned user.`                                                                                                                                                        , 'Takes one argument' , '<ping a user>'                    , `\`${prefix}tsremstick @Silence#6134\`` , 'Stick Controller'],
    // ['getstarted', `**CURRENTLY NOT IMPLEMENTED** Sets you on your way towards using Talking Stick!`                                                                                                                       , 'Takes no argument'  , 'N/A'                              , `\`${prefix}getstarted`                 , 'User'            ],
    // ['dnw'       , `This segment is currently under construction`,'User','Takes undefined argument/s', `\`prefix}dnw\``] 
]

export default async function (message) {
    if (message.guild) {
        // if (message.mentions.members.first() == client.member){
        //     message.tempReply(`Please use \`${prefix}help\` for help`);
        // }
        if (message.mentions.members.first()?.id == client.user.id && message.content.toLowerCase().startsWith('welcome')) {
            message.channel.send('Hello!');
        }
        if (message.content.startsWith(prefix)) {
            let string = message.content.substring(prefix.length).split(/ +/,1)[0];
            let command = string.split(' ');
            // Check to see if command is defined in CommandMap
            if (command[0] in CommandMap) {
                console.log(date(),`${chalk.green(command)} command issued by ${chalk.yellow(message.author.username)}#${chalk.yellow(message.author.discriminator)} (${message.member.id}) in ${message.guild.name} (${message.guild.id}): \n\t${message.content}`);
                let args = message.content.substring(prefix.length+command.length+1).split(/ +/)[1];
                CommandMap[command[0]](message, args, command[0]);
            } else {
                console.log(date(),`Invalid command issued by ${message.author.username}#${message.author.discriminator} (${message.author.id}) in ${message.guild.name}: ${message.content}`);
                message.tempReply(`**\`${prefix}${command}\` not a valid command.**`)
                    .then(s => console.log(date(),`Successfully sent invalid command notification to ${message.author.username}#${message.author.discriminator} (${message.author.id}) in ${message.guild.name}`));
            }
        }
    }
    else if (!message.author.bot) {
        console.log(date(),`DM from ${message.author.username}#${message.author.discriminator}\n\t${message.content}`);
        if (message.content.startsWith(prefix)) {
            const genHelpEmbed = new Discord.MessageEmbed();
            let string = message.content.substring(prefix.length).split(/ +/,1)[0];
            let command = string.split(' ');
            if(command[0] == "help") {
                let args = message.content.substring(prefix.length+command.length+3).split(/ +/)[1];
                if(args){
                    const helpEmbed = new Discord.MessageEmbed();
                    var contains = 0;
                    helpArr.forEach((e) => {
                        if(e[0] == args) {
                            helpEmbed
                                .setTitle(`**Help: \`${prefix}${e[0]}\`**`)
                                .setAuthor("Talking Stick", botPfp)
                                .setColor("GREEN")
                                .setDescription(e[1])
                                .addField(e[2], e[3])
                                .addField('**Exmple**', e[4])
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
                        .setTitle('**Help**')
                        .setAuthor(botName, botPfp)
                        .setColor('GREEN')
                        .setDescription(`**The basic Talking Stick commands are \`${prefix}tsjoin\` which will allow you to start the Talking Stick, and \`${prefix}tspass\` to pass the talking stick.**\n\nTo get help on a specific command, run \`${prefix}help <command>\`.`)
                        .addField('Example',  `\`${prefix}help tsjoin\`.`)
                        .addField('Available help pages', `\`${helpArr.map((e) => e[0]).join('\n')}\``)
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
                    .catch(e => console.error(date(), `Could not send "Must use command in server" notification to ${message.author.username}#${message.author.discriminator} (${message.author.id}):`,e));
            } else {
                message.channel.send(`\`${message.content}\` is not a valid command.`).catch(console.err);
            }
        } else {
            var relatedServers = [];
            client.guilds.cache.map((g) => {
                g.members.cache.map((m) => {
                    if(m.id == message.author.id) {
                        relatedServers.push(g.name);          
                    }
                })
            })
            console.log(date(), chalk.green('Related Servers to bot:\n') + relatedServers.join(chalk.redBright('\n')));
            var related = relatedServers.join('\n');
            const dmEmbed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}#${message.author.discriminator} (${message.author.id})`, message.author.avatarURL())
                // .setFooter(`${Date.prototype.getHours()}:${Date.prototype.getMinutes()}:${Date.prototype.getSeconds()}`)
                .setDescription(message.content);
            if(message.attachments) {
                message.attachments.forEach(a => {
                    dmEmbed.attachFiles(a);
                })
                message.attachments.forEach(a => {
                    if(a.height || a.width) {
                        if(!dmEmbed.image)
                            dmEmbed.setImage(a.url);
                    }
                })      
            }
            if(related){
                dmEmbed.addField('Servers', related);
            } else {
                dmEmbed.addField('Servers', 'Unable to cache.');
            }
            developer.send(dmEmbed)
                .then(s => {
                    message.react("✅");
                })
                .catch(e => {
                    console.error(date(),`Error sending message from ${message.author.username}#${message.author.discriminator} (${message.author.id}):`,e)
                    message.channel.send('There was an error sending the message, try again in a little while, add Silence#6134, or join the support server: https://discord.gg/Jxe7mK2dHT');
                });  
        }       
    }
}