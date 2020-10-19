/*TODO
        Create embeds
        if ts is destroyed, check for users with TSLeft and message.reply them, informing moderators they are still muted
        implememnt ts sub functions
*/

const Discord = require('discord.js');
const chalk = require('chalk');

const client = new Discord.Client();

const defaultPrefix = "//";
let prefix = defaultPrefix;
let roles = ['Stick Controller', 'Stick Holder', 'Stick Listener', 'TSLeft'];
let CommandMap = {};
/**
* @param {!string} name
* @param {(msg: Discord.Message, ...args: string)=>Promise.<void>} action
*/
function RegisterCommand(name,action) {
   CommandMap[name] = action;
}


process.on("unhandledRejection", error => {
    console.error("Unhandled promise rejection:", error);
});

client.once('ready', () => {
    console.log(client.guilds.cache.map(guild => guild.name));
    console.log(`Currently in ${chalk.yellow(client.guilds.cache.map(guild => guild.name).length)} servers.`);
    console.log(chalk.greenBright('Ready!'));
    client.user.setPresence({
        status: 'online',
        activity: {
          name: `${prefix}help`,
          type: 'LISTENING'  
        }
    });
});

client.login('NjA5MjMzNjc2NDcxMTA3NTg0.XUzvEw.ZvLhjChr3DRa2RoPe_E5GJD8TEY');

client.on("voiceStateUpdate", (oldState, newState) => {
    if(!oldState.member.voice.channel){
        if(findRole(oldState.member, 'Stick Listener')) {
            oldState.member.roles.add(findRole(oldState.guild, 'TSLeft')).catch(console.error);
            if(findRole(oldState.member, 'Stick Listener')) {
                oldState.member.roles.remove(findRole(oldState.guild, 'Stick Listener')).catch(console.error);
            }
            
        }
        if(findRole(oldState.member, 'Stick Holder')) {
            oldState.member.roles.remove(findRole(oldState.guild, 'Stick Holder')).catch(console.error);
        }
    }
    if(newState.member.voice.channel) {
        if(findRole(newState.member, 'TSLeft') && !newState.member.voice.channel.members.some(r => findRole(r, 'Stick Holder'))) //potential problem
        {
            newState.member.voice.setMute(false).catch(console.error);
            newState.member.roles.remove(findRole(newState.member, 'TSLeft')).catch(console.error);
        }
    }
});

client.on('message', async message => {
    // Voice only works in guilds, if the message does not come from a guild, then ignore
    if (message.guild) {
        // if (message.mentions.users.first() == client.member){
        //     message.reply(`Please use \`${prefix}help\` for help`);
        // }
        if (message.content.startsWith(prefix)) {
            let string = message.content.substring(prefix.length).split(/ +/,1)[0];
            let command = string.split(' ');
            
            // if(message.guild.roles.cache.find(r => r.name == 'Talking Stick').position == message.guild.roles.highest) {
                // Check to see if command is defined
                if (command[0] in CommandMap) {
                    console.log(`${chalk.green(message.content)} command issued by ${chalk.yellow(message.author.username)}#${chalk.yellow(message.author.discriminator)} in ${message.guild.name}()`);
                    let args = message.content.substring(prefix.length+command.length+1).split(/ +/)[1];
                    CommandMap[command[0]](message, args);
                } else {
                    console.log(`Invalid command issued by ${message.member.displayName}: ${command}`);
                    message.reply(` \`${prefix}${command}\` is an invalid command.`);
                }
            }
            
    }
});

RegisterCommand("commands", async (message, _) => {
    let s="**Commands:**\n";
    Object.keys(CommandMap).forEach(k=>s+='\t'+k+'\n');
    message.channel.send(s)
});


RegisterCommand("help", async (message, _) => { message.author.send(
    "__**HELP:**__\n" +
    `\t\`${prefix}help\` :\n\t\tDM the user help\n\n` +
    `\t\`${prefix}tsinit\` :\n\t\tCreates all necesarry roles\n\n` +
    `\t\`${prefix}ts {voice, text}\` :\n\t\tTakes one argument: \`voice\` or \`text\`. \n\t\tIf you have sufficient permissions, you will get the "Talking Stick". Only you will be able to speak or type (depending on which argument you passed) until you either pass the talking stick, or tell Talking Stick to stop\n\n` +
    `\t\`${prefix}tspass\` :\n\t\t If you have the talking stick, you can pass it to someone else. For example:  \`${prefix}tspass @Silence#8808\`\n\n` +
    `\t\`${prefix}tsleave {voice, text}\` :\n\t\tTakes one argument: \`voice\` or \`text\`. \n\t\tIf you have sufficient privilages, this will unmute everyone or allow everyone to type (depending on which argument you passed) and return them to their original roles.\n\n` +
    `\t\`${prefix}tsdestroy\` :\n\t\t If you have sufficient privilages, this will delete all roles created by the bot. Warning: any users still muted due to Talking Stick will remain muted until unmuted by a moderator.\n\n` +
    `\t\`${prefix}tsgivecon\` :\n\t\t If you have sufficient privilages, this will allow you to give another user the \`Stick Controller\` role.\n\n` +
    `\t\`${prefix}tsremcon\` :\n\t\t If you have sufficient privilages, this will allow you to remove another user from the \`Stick Controller\` role.\n\n` +
    `\t\`${prefix}tsaddstick\` :\n\t\t If you have sufficient privilages, this will allow you to give another user in the voice channel a talking stick, while keeping your own.\n\n` +
    `\t\`${prefix}tsremstick\` :\n\t\t If you have sufficient privilages, this will allow you to take a stick from a mentioned user.\n\n\n` +
    "\n\n\n" +
    "__**IF THE BOT IS TELLING YOU TO MOVE THE \"Talking Stick\" ROLE**__\n\n" +
    `**1:**\n\tIn your server, go to server settings.\n**2:**\n\tDrag the \`Talking Stick\` role above all of the others.\n\t(Note: This will not display it as being above all other roles in the member viewer)\n\n` +
    `\n**Contact the bot developer directly: Silence#8808 (<@248324194436251658>)**`
        );

    message.reply('Check you DMs. A help page has been sent to you.');
});

RegisterCommand( "tsinit", async (message, _) => {
    if(message.member.permissions.has(8) || message.member.id == '248324194436251658') {
        const tsinitEmbed = new Discord.MessageEmbed;

        try{
            for(roleIdx in roles){
                if(!someRole(message.guild, roles[roleIdx])) {
                    if(roles[roleIdx] == 'Stick Holder'){
                        await createRole(roles[roleIdx], message, '#c79638');
                        tsinitEmbed.addField(`__**Creating ${roles[roleIdx]}**__`,`${roles[roleIdx]} has been created.`);
                        
                    } else{
                        await createRole(roles[roleIdx], message);
                        tsinitEmbed.addField(`__**Creating ${roles[roleIdx]}**__`,`${roles[roleIdx]} has been created.`);
                    } 
                } else {
                    tsinitEmbed.addField(`__**Creating ${roles[roleIdx]}**__`,`${roles[roleIdx]} is present.`);
                }
            }
            tsinitEmbed.setFooter('Done.');
            tsinitEmbed.setColor('GREEN');
            tsinitEmbed.setAuthor(`${message.author.username}#${message.author.discriminator} executed TSInit`, message.author.avatarURL());
            message.channel.send(tsinitEmbed)
                .then(sentMessage => {
                    sentMessage.delete({ timeout: 30000 });
                    message.delete({timeout: 30000});
            }).catch(console.error);

        } catch (err) {
            console.error(err);
            message.reply(`The bot most likely doesn\'t have sufficient permissions to complete this action. In server settings under roles, drag the \`Talking Stick\` role to the top. For more instruction on how to do this, type \`${prefix}help\`, and scroll to the bottom of the page.`);            
        }

    } else {
            message.reply('You do not have permission to do this.');
    }
        
});

RegisterCommand( "tsdestroy", async (message, _) => {
    if(message.member.permissions.has(8) || message.member.id == '248324194436251658') { //if message author has admin perms
        // message.channel.send('__**Warning:**__\n\t\tIf there are still users muted due to TS they will remain muted until manually unmuted by a moderator with server mute permissions.');
        const tsdestroyEmbed = new Discord.MessageEmbed;
        const s = "";
        if(findRole(message.guild, 'TSLeft')){
            let tsleftArray = findRole(message.guild, 'TSLeft').members.map(member => member.user.username);
            tsleftArray.forEach(k=>s+=k+'\n');
        }
        
        try{
            for(roleIdx in roles){
                if(someRole(message.guild, roles[roleIdx])) {
                    await destroyRole(roles[roleIdx], message);
                    tsdestroyEmbed.addField(`__Destroying ${roles[roleIdx]}__`,`${roles[roleIdx]} has been destroyed.`); 
                } else {
                    tsdestroyEmbed.addField(`__Creating ${roles[roleIdx]}__`,`${roles[roleIdx]} is not present.`);
                }
            }
            if(s != ""){
                tsdestroyEmbed.addField('**Users still muted:**\n', `${s}\n**These users must be manually unmuted the next time they join a voice channel.**`);
            }
            tsdestroyEmbed.setAuthor(`${message.author.username}#${message.author.discriminator} executed TSDestroy`, message.author.avatarURL())
                        .setColor('RED')
                        .setFooter('Done.');
            message.channel.send(tsdestroyEmbed)
                .then(sentMessage => {
                    sentMessage.delete({ timeout: 30000 });
                    message.delete({timeout: 30000});
                }).catch(console.error);
        } catch (err) {
            console.error(err);
            message.reply('The bot most likely doesn\'t have sufficient permissions to complete this action. In server settings under roles, drag the `Talking Stick` role to the top.');            
        }
        // try{
        //     for(roleIdx in roles) {
        //         await destroyRole(roles[roleIdx], message);
        //     }
        // } 
        // catch (err) {
        //     console.error(err);
        //     message.reply('The bot most likely doesn\'t have sufficient permissions to complete this action. In server settings under roles, drag the `Talking Stick` role to the top.');
        // }
        //w
    } else {
        message.reply('You do not have permission to do this.');
    }
});

RegisterCommand("ts", async (message, args) => {
    let string = message.content.substring(prefix.length).split(/ +/,1)[0];
    let command = string.split(' ');
    if (someRole(message.member, 'Stick Controller') || message.member.permissions.has(8) || message.member.id == '248324194436251658') { //if message author is in Stick Controller group or an admin
        if(someRole(message.guild, 'Stick Controller') || someRole(message.guild, 'Stick Holder')){
            if (message.member.voice.channel && args == "voice") { 
                message.member.roles.add(findRole(message.guild, 'Stick Holder')).catch(console.error); //add message author to Stick Holder
                message.member.voice.channel.updateOverwrite(findRole(message.guild, 'Stick Holder'), {
                    SPEAK: true
                })
                .then(/*channel => console.log(channel.permissionOverwrites.get(message.author.id))*/)
                .catch((err) => {
                    console.error(err);
                    message.channel.send('In order for Talking Stick to work properly, you must drag the \`Talking Stick\` role to the top of the list in server settings. Talking Stick will attempt to run without this, but will not be able to function properly, and is strongly disadvized.');
                });
                
                message.member.voice.channel.updateOverwrite(message.guild.roles.everyone, {
                    SPEAK: false
                })
                .then(/*channel => console.log(channel.permissionOverwrites.get(message.author.id))*/)
                .catch(console.error);
                
                for (const [_, member] of message.member.voice.channel.members) {
                    if (member != message.member){
                        member.voice.setMute(true);
                        member.roles.add(findRole(member.guild, 'Stick Listener')).catch(console.error);
                    }
                }
                message.channel.send(`${message.member.displayName} has the Talking Stick`);
            } else if(args == "text")  {
                // let stickHolders = (message.guild.roles.cache.find(r => r.name == 'Stick Holder')).members.array();
                // for(var i=0; i<stickHolders.length; i++) {
                //     stickHolders[i].roles.remove((message.guild.roles.cache.find(r => r.name == 'Stick Holder')));
                //     // console.log(stickHolders[i]);
                // }
                message.member.roles.add(findRole(message.guild, 'Stick Holder')).catch(console.error); //add message author to Stick Holder
                message.channel.updateOverwrite(findRole(message.guild, 'Stick Holder'), {
                    SEND_MESSAGES: true
                  })
                    .then(/*channel => console.log(channel.permissionOverwrites.get(message.author.id))*/)
                    .catch(console.error);
                
                message.channel.updateOverwrite(message.guild.roles.everyone, {
                    SEND_MESSAGES: false
                    })
                    .then(/*channel => console.log(channel.permissionOverwrites.get(message.author.id))*/)
                    .catch(console.error);
            }
            else if (!args) {
                message.reply(`You must supply one argument. If you are in a voice channel, use \`${prefix}ts voice\`. If you are in a text channel, use \`${prefix}ts text\`.`);
            }
            else if (message.member.voice.channel && args == 'voice') {
                message.reply('You need to join a voice channel first!');
            } else if(args) {
                message.reply(`"\`${args}\`" is not a valid option for ${prefix}${command}`).catch(console.error);
            } 
        }
      else {
            message.reply(`Please run \`${prefix}tsinit\` to create the required roles`);
        }
    } else {
        message.reply('You do not have permission to do this.');
    }
});

RegisterCommand( "tsgivecon", async (message, _) => {
    if(message.member.hasPermission(8) || message.member.id == '248324194436251658') {
        if(findRole(message.guild, 'Stick Controller')){
            const memberMentioned = message.mentions.users.first();
            if(memberMentioned){
                memberMentioned.roles.add(findRole(message.guild, 'Stick Controller'));
            }
            else {
                message.reply('**You must mention someone to give Stick Controller.**');
            }
        } else {
            message.reply(`Please run \`${prefix}tsinit\` to create all required roles.`);
        }
    } else {
        message.reply('You do not have permission to do this.');
    }
});

RegisterCommand( "tsremcon", async (message, _) => {
    if(message.member.hasPermission(8) || message.member.id == '248324194436251658' ) {
        if(someRole(message.guild, 'Stick Controller')){
            const memberMentioned = message.mentions.users.first();
            if(someRole(message.mentions.users.first(), 'Stick Controller')){
                memberMentioned.roles.remove(findRole(message.guild, 'Stick Controller')).catch(console.error);
            }
        } else {
            message.reply(`Stick Controller not found. Please run \`${prefix}tsinit\` to create all required roles before attempting to use Talking Stick.`);
        }
    } else {
        message.reply('You do not have permission to do this.');
    }
});

RegisterCommand( "tsaddstick", async (message, _) => {
    if(message.member.hasPermission(8) || someRole(message.member, 'Stick Controller') || message.member.id == '248324194436251658') {
        if(someRole(message.guild, 'Stick Holder')) {
            const memberMentioned = message.mentions.users.first();
            if(!memberMentioned.voice.channelID) {
                message.reply(`${memberMentioned.name} is not in a voice channel.`)
            }
            if(memberMentioned.voice.channelID == message.member.voice.channelID) {
                memberMentioned.roles.add(findRole(message.guild, 'Stick Holder')).catch(console.error);
                memberMentioned.voice.setMute(false);
            } else {
                message.reply(`${memberMentioned.name} is not in your voice channel.`)
            }
        } else {
            message.reply(`Please run \`${prefix}tsinit\` to create all required roles.`);
            }
    } else {
        message.reply('You do not have permission to do this.');
    }
});

//ts text and voice must have dif roles
RegisterCommand( "tsremstick", async (message, _) => {
    if(message.member.hasPermission(8) || findRole(message.member, 'Stick Controller') || message.member.id == '248324194436251658') {
        if(findRole(message.guild, 'Stick Holder')) {
            const memberMentioned = message.mentions.users.first();
            if(message.member.voice.channelID && message.member.voice.channelID != memberMentioned.voice.channelID) {
                message.reply(`${memberMentioned.name} is not in the voice channel.`)
            } else if (!message.member.voice.channelID && !memberMentioned.voice.channelID) {
                if(findRole(memberMentioned, 'Stick Holder')) {
                    memberMentioned.roles.remove(findRole(memberMentioned, 'Stick Holder')).catch(console.error);
            } else {
                    message.reply(`${memberMentioned.name} is not a Stick Holder`);
                }
            if(memberMentioned.voice.channelID == message.member.voice.channelID) {
                memberMentioned.roles.add(findRole(message.guild, 'Stick Holder')).catch(console.error);
                memberMentioned.voice.setMute(true).catch(console.error);
            } else {
                message.reply(`${memberMentioned.name} is not in your voice channel.`)
            }
        } else {
            message.reply(`Please run \`${prefix}tsinit\` to create all required roles.`);
            }
    } else {
        message.reply('You do not have permission to do this.');
        }
    }
});

RegisterCommand( "tspass", async (message, args) => {
    if(someRole(message.member, 'Stick Controller') || message.member.permissions.has(8) || message.member.id == '248324194436251658') {
        if(findRole(message.guild, 'Stick Holder')) {
            let member;
            if(message.mentions.members.first()) {
                memberMentioned = message.mentions.members.first();
                if(memberMentioned.voice.channelID && memberMentioned.voice.channelID == message.member.voice.channelID) {
                    memberMentioned.voice.setMute(false).catch(console.error);
                    if(message.member.id != memberMentioned.id){
                            message.member.voice.setMute(true).catch(console.error);
                            message.member.roles.add(findRole(message.guild, 'Stick Listener')).catch(console.error);
                            message.member.roles.remove(findRole(message.guild, 'Stick Holder')).catch(console.error);
                        }
                    memberMentioned.roles.add(findRole(message.guild, 'Stick Holder')).catch(console.error);
                    message.reply(`Passed stick to ${message.mentions.users.first().username}`);
                } else if(!memberMentioned.voice.channelID && !message.member.voice.channelID) {
                    memberMentioned.roles.add(findRole(message.guild, 'Stick Holder')).catch(console.error);
                    message.member.roles.remove(findRole(message.guild, 'Stick Holder')).catch(console.error);
                } else if(memberMentioned.voice.channelID && memberMentioned.voice.channelID != message.member.voice.channelID) {
                    message.reply(`**${memberMentioned.displayName} is not in ${message.member.voice.channel.name}.**`)
                }
            } else if(message.guild.members.cache.has(args)) { 
                member = message.guild.members.cache.get(args);
                member.roles.add(findeRole(message.guild, 'Stick Holder')).catch(console.error);
            } else {
                message.reply('you must mention someone to pass the Stick to.');
            }
        } else {
            message.reply(`You must run \`${prefix}tsinit\` to initialize all required roles for Talking Stick to work properly.`);
        }
    } else {
        message.reply('You do not have permission to do this.');
    }            
});

RegisterCommand("tsleave", async (message, args) => {
    let string = message.content.substring(prefix.length).split(/ +/,1)[0];
    let command = string.split(' ');
    if ((someRole(message.member, 'Stick Controller') || message.member.hasPermission(8))) {
        if (message.member.voice.channel && args == "voice") {
            for (const [_, member] of message.guild.members.cache) {
                if(member.voice.channelID) {
                    member.voice.setMute(false).catch(console.error);
                    member.roles.remove(findRole(message.guild, 'Stick Holder')).catch(console.error);
                    member.roles.remove(findRole(message.guild, 'Stick Listener')).catch(console.error);
                }
            }

            message.member.voice.channel.updateOverwrite(findRole(message.guild, 'Stick Holder'), {
                SPEAK: null
            })
            .then(/*channel => console.log(channel.permissionOverwrites.get(message.author.id))*/)
            .catch(console.error);
            
            message.member.voice.channel.updateOverwrite(message.guild.roles.everyone, {
                SPEAK: null
            })
            .catch(console.error);
        } 
        else if (args == "text") {
                message.channel.updateOverwrite(findRole(message.guild, 'Stick Holder'), {
                    SEND_MESSAGES: null
                })
                .then(/*channel => console.log(channel.permissionOverwrites.get(message.author.id))*/)
                .catch(console.error);
                   
                message.channel.updateOverwrite(message.guild.roles.everyone, {
                    SEND_MESSAGES: null
                })
                .then(/*channel => console.log(channel.permissionOverwrites.get(message.author.id))*/)
                .catch(console.error);

                for (const [memberID, member] of message.guild.members.cache) {
                    if(!member.voice.channelID) {
                        member.roles.remove(findRole(message.guild, 'Stick Holder')).catch((err) => {
                            console.error(err);
                            message.channel.send('In order for Talking Stick to work properly, you must drag the \`Talking Stick\` role to the top of the list in server settings. Talking Stick will attempt to run without this, but will not be able to function properly, and is strongly disadvized.');
                        });

                        member.roles.remove(findRole(message.guild, 'Stick Listener')).catch(console.error);
                       }
                }
        }
        else if(!args) {
            message.reply(`You must supply one argument. If you are in a voice channel, use \`${prefix}tsleave voice\`. If you are in a text channel, use \`${prefix}tsleave text.\``)
        } else {
                message.reply(`${args} is not understood with ${command}`);
            }
        }
    else {
        message.reply('You do not have permission to do this.');
    }
});


RegisterCommand( "invite", async (message, _) => {
    message.channel.send('https://discord.com/oauth2/authorize?client_id=609233676471107584&scope=bot&permissions=309406902');
});

RegisterCommand("description", async (message, _) => {
    message.channel.send(
        "Talking Stick\n" +
        "\tA bot that can act as a talking stick! If one person has the talking stick, no one else can speak/type (depending on if you tell it to join a voice channel or a text channel). However, if you have the talking stick (or the special stick controller role) you can pass the talking stick to someone else so that they can talk!\n" + 
        "\tYou can even have multiple talking sticks so that several people can talk at the same time, but everyone else is muted in that channel."
    );
});

RegisterCommand("leave", async (message, _) => {
    if (someRole(message.member,'Stick Controller')){ 
      if(message.member.permissions.has(8)) {
        if(message.guild.me.voice.channel) {
            message.guild.me.voice.channel.leave();
        }
      } else {
            message.reply('You do not have permission to do this.');
        }
    } else {
        message.channel.send(`Please run ${prefix}tsinit to create all required roles.`);
    }
});

function someRole(messagemorg, roleName) {
    return (messagemorg).roles.cache.some(r => r.name == roleName);
}

function findRole(messagemorg, roleName) {
    return (messagemorg).roles.cache.find(r => r.name == roleName);
}

async function destroyRole(roleName, message) {
        try {
            await findRole(message.guild, roleName).delete(`TSDestroyed by ${message.author.name} (${message.author.id})`); //delete Stick Controller
            console.log(`Deleted role ${roleName} in ${message.guild.name} (${message.guild.id})`);
        }
        catch (err) {
            console.error(err, `\n Error in ${message.guild} (${message.guild.id}) by ${message.member.displayName} (${message.member.id})`);
            return;
        }

    // } else {
    //     message.channel.send(`**${roleName} is not present.**`);
    // }
}

async function createRole(roleName, message, roleColor) {
    try{
        message.guild.roles.create({
            data: {
                name: roleName,
                color: roleColor
            }, reason: `Created ${roleName}`
        });
        console.log(`Created ${roleName} in ${message.guild} (${message.guild.id})`);
    }
    catch (err) {
        console.error(err, `\n Error in ${message.guild} (${message.guild.id}), Create Role command failed. Command issued by ${message.member.displayName} (${message.member.id})`);
        message.reply(`Unable to create role. Check the bottom of \`${prefix}help\``)
        return;
    }
}