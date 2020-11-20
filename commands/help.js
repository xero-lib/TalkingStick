import '../prototypes/tempSend.js';
import '../prototypes/tempReply.js';
import chalk from 'chalk';
import Discord from 'discord.js';
import {defaultPrefix as prefix, botPfp} from '../coagulators/configCoagulator.js'

const helpArr = [
    ['help'      , `DMs the user help for a given command.`                                                                                                                                                                   , 'Takes one argument:', '<command>'                        , `\`${prefix}help tsjoin\``              , 'everyone'        ], 
    ['tsinit'    , `Creates all necessary roles for Talking Stick.`                                                                                                                                                           , 'Takes no argument'  , 'N/A'                              , `\`${prefix}tsinit\``                   , 'Administrator'   ],
    ['tsjoin'    , `Activates Talking Stick in either a voice or a text channel depending on the passed argument. This will mute everyone except the member who sent the command, and assign the special Talking Stick roles.`, 'Takes one argument' , '<`voice` or `text`>'              , `\`${prefix}tsjoin text\``              , 'Stick Controller'],
    ['tsleave'   , `Deactivates Talking Stick in either a voice or a text channel depending on the passed argument. This will allow everyone to talk again, and return them to their original roles.`                         , 'Takes one argument' , '<`voice` or `text`>'              , `\`${prefix}tsleave text\``             , 'Stick Controller'],
    ['tspass'    , `If you have the talking stick, you can pass it to someone else.`                                                                                                                                          , 'Takes two arguments', '<`voice` or `text`> <ping a user>', `\`${prefix}tspass text @Silence#6134\``, 'Stick Holder'    ],
    ['tsdestroy' , `Deletes all roles created by the bot. **Warning**: any users still muted due to Talking Stick will remain muted until unmuted by a moderator.`                                                            , 'Takes no argument'  , 'N/A'                              , `\`${prefix}tsdestroy\``                , 'Administrator'   ],
    ['tsgivecon' , `Allows you to give another user the \`Stick Controller\` role.`                                                                                                                                           , 'Takes one argument' , '<ping a user>'                    , `\`${prefix}tsgivecon @Silence#6134\``  , 'Stick Controller'],
    ['tsremcon'  , `Allows you to remove another user from the \`Stick Controller\` role.`                                                                                                                                    , 'Takes one argument' , '<ping a user>'                    , `\`${prefix}tsremcon @Silence#6134\``   , 'Stick Controller'],
    ['tsaddstick', `Allows you to give another user in the voice channel a talking stick, while keeping your own.`                                                                                                            , 'Takes one argument' , '<ping a usre>'                    , `\`${prefix}tsaddstick @Silence#6134\`` , 'Stick Controller'],
    ['tsremstick', `Allows you to take a stick from a mentioned user.`                                                                                                                                                        , 'Takes one argument' , '<ping a user>'                    , `\`${prefix}tsremstick @Silence#6134\`` , 'Stick Controller'],
    // ['getstarted', `**CURRENTLY NOT IMPLEMENTED** Sets you on your way towards using Talking Stick!`                                                                                                                       , 'Takes no argument'  , 'N/A'                              , `\`${prefix}getstarted`                 , 'User'            ],
    // ['dnw'       , `This segment is currently under construction`,'User','Takes undefined argument/s', `\`prefix}dnw\``] 
]

// help = "__**HELP:**__\n" +
// `\t\`${prefix}help\` :\n\t\tDM the user help\n\n` +
// `\t\`${prefix}tsinit\` :\n\t\tCreates all necessary roles\n\n` +
// `\t\`${prefix}tsjoin {voice, text}\` :\n\t\tTakes one argument: \`voice\` or \`text\`. \n\t\tIf you have sufficient permissions, you will get the "Talking Stick". Only you will be able to speak or type (depending on which argument you passed) until you either pass the talking stick, or tell Talking Stick to stop. (Example: \`${prefix}tsjoin text\` will activate talking stick in the current text channel\n\n` +
// `\t\`${prefix}tspass\` :\n\t\t If you have the talking stick, you can pass it to someone else. For example:  \`${prefix}tspass @Silence#6134\`\n\n` +
// `\t\`${prefix}tsleave {voice, text}\` :\n\t\tTakes one argument: \`voice\` or \`text\`. \n\t\tIf you have sufficient privilages, this will unmute everyone or allow everyone to type (depending on which argument you passed) and return them to their original roles.\n\n` +
// `\t\`${prefix}tsdestroy\` :\n\t\t If you have sufficient privilages, this will delete all roles created by the bot. Warning: any users still muted due to Talking Stick will remain muted until unmuted by a moderator.\n\n` +
// `\t\`${prefix}tsgivecon\` :\n\t\t If you have sufficient privilages, this will allow you to give another user the \`Stick Controller\` role.\n\n` +
// `\t\`${prefix}tsremcon\` :\n\t\t If you have sufficient privilages, this will allow you to remove another user from the \`Stick Controller\` role.\n\n` +
// `\t\`${prefix}tsaddstick\` :\n\t\t If you have sufficient privilages, this will allow you to give another user in the voice channel a talking stick, while keeping your own.\n\n` +
// `\t\`${prefix}tsremstick\` :\n\t\t If you have sufficient privilages, this will allow you to take a stick from a mentioned user.\n\n\n` +
// "\n\n\n" +
// "__**IF THE BOT IS TELLING YOU TO MOVE THE \"Talking Stick\" ROLE OR NOT WORKING** __\n\n" +
// `**1:**\n\tIn your server, go to server settings.\n**2:**\n\tDrag the \`Talking Stick\` role above all of the Talking Stick created roles (Stick Controller, Stick Holder, Stick Listener, TSLeft).\n\t(Note: This will not display it as being above all other roles in the member viewer)\n\n` +
// `\n**Contact the bot developer directly: Silence#6134 (<@248324194436251658>)**`

export default async function (message, args) {
    //help reference: 0-command name, 1-Description, 2-Arg count, 3-Argument, 4-Command example, 5-Role requirement
    const helpEmbed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setThumbnail(botPfp);

    if(args){
        var contains = 0;
        var helpCmd = '';
        helpArr.forEach((e) => {
            if(e[0] == args) {
                helpEmbed
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .setTitle(`**Help: \`${prefix}${e[0]}\`**`)
                    .setDescription(e[1])
                    .addField(e[2], e[3])
                    .addField('**Exmple**', e[4])
                    .setFooter(`Minimum role of ${e[5]} required to execute this command`);
                helpCmd = e[0];
                contains++;
            }
        });

        if(contains == 0) {
            message.tempReply(`${args} is not a valid command. For a list of commands, run \`${prefix}help\``)
                .then(s => {
                    console.log(`Successfully sent invalid command reply to ${message.author.username}#${message.author.discriminator} (${message.author.id}) in ${message.channel.name} in server "${message.guild.name}".`);
                })
                .catch(e => {
                    message.author.send(`${args} is not a valid command. For a list of commands, run \`${prefix}help\``)
                        .then(s => {
                            console.log(`Sent invalid command response to  ${chalk.yellow(message.author.username)}#${chalk.yellow(message.author.discriminator)} (${message.author.id}) from ${message.guild.name} (${message.guild.id})`)
                        })
                        .catch(e1 => {
                            console.log(`\nCannot send invalid command response to ${chalk.yellow(message.author.username)}#${chalk.yellow(message.author.discriminator)} (${message.author.id}) from ${message.guild.name} (${message.guild.id}) through DMs:`,e1);
                        });
                });
        }
        if(contains != 0){
            if(t){};
            message.author.send(helpEmbed)
                .then(s => {
                    message.tempSend(`A help page for \`${helpCmd}\` has been sent to ${message.author.username}`)
                        .then(s => console.log(`${chalk.green('help')} has been sent to ${message.author.username}#${message.author.discriminator} (${message.author.id}) in ${message.channel.name} from "${message.guild.name}"`));
                })
                .catch(e => {
                    console.error(e);
                    message.tempSend(`Could not send DM to ${message.author.username}, sending temporary help message here.`, helpEmbed);
            });
        }
    }
    else if(!args) {
        const genHelpEmbed = new Discord.MessageEmbed()
            .setTitle('**Help**')
            .setAuthor(message.author.username, message.author.avatarURL())
            .setColor('GREEN')
            .setDescription(`**The basic Talking Stick commands are \`${prefix}tsjoin\` which will allow you to start the Talking Stick, and \`${prefix}tspass\` to pass the talking stick.**\n\nTo get help on a specific command, run \`${prefix}help <command>\`.`)
            .addField('Example',  `\`${prefix}help tsjoin\`.`)
            .addField('Available help pages', `\`${helpArr.map((e) => e[0]).join('\n')}\``);

        message.tempSend(genHelpEmbed)
            .then(s => console.log(`Successfully sent genHelpEmbed in ${message.channel.name} in ${message.guild.name} in response to ${message.author.username}#${message.author.discriminator} (${message.author.id})`))
    }
}