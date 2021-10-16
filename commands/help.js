import { MessageEmbed, Message } from "discord.js";
import { datedErr } from "../exports/functionExports.js";
import { defaultPrefix as prefix, botPfp } from "../exports/configExports.js";

import "../prototypes/tempSend.js";
import "../prototypes/tempReply.js";

// I apologize for me horrendous formatting here, my OCD took over.
export const helpMap = new Map().set(
    "help",
    {
        description: "DMs the user help for a given command.",
        argCount: "Takes one argument" ,
        arguments: "<command you want help for>",
        example: `\`${prefix}help tsjoin\``,
        minRole: "everyone"
    }
).set(
    "tsinit",
    {
        description: "Creates all necessary roles for Talking Stick.",
        argCount: "Takes no argument",
        argument: "N/A",
        example: `\`${prefix}tsinit\``,
        minRole: "Administrator"
    }
).set(
    "tsjoin",
    {
        description: "Activates Talking Stick in either a voice or a text channel depending on the passed argument. This will mute everyone except the member who sent the command, and assign the special Talking Stick roles.",
        argCount: "Takes one argument",
        arguments: "<`voice` or `text`>",
        example: `\`${prefix}tsjoin text\``,
        minRole: "Stick Controller"
    }
).set(
    "tsleave",
    {
        description: "Deactivates Talking Stick in either a voice or a text channel depending on the passed argument. This will allow everyone to talk again, and return them to their original roles.",
        argCount: "Takes one argument",
        arguments: "<`voice` or `text`>",
        example: `\`${prefix}tsleave text\``,
        minRole: "Stick Controller"
    }
).set(
    "tspass",
    {
        description: "If you have the talking stick, you can pass it to someone else.",
        argCount: "Takes two arguments",
        arguments: "<`voice` or `text`> <ping a user>",
        example: `\`${prefix}tspass text @Thoth#6134\``,
        minRole: "Stick Holder"
    }
).set(
    "tsdestroy",
    {
        description: "Deletes all roles created by the bot. **Warning**: any users still muted due to Talking Stick will remain muted until unmuted by a moderator.",
        argCount: "Takes no argument",
        example: "N/A",
        arguments: `\`${prefix}tsdestroy\``,
        minRole: "Administrator"
    }
).set(
    "tsgivecon",
    {
        description: "Allows you to give another user the \`Stick Controller\` role.",
        argCount: "Takes one argument",
        arguments: "<ping a user>",
        example: `\`${prefix}tsgivecon @Thoth#6134\``,
        minRole: "Stick Controller"
    }
).set(
    "tsremcon",
    {
        description: "Allows you to remove another user from the \`Stick Controller\` role.",
        argCount: "Takes one argument",
        arguments: "<ping a user>",
        example: `\`${prefix}tsremcon @Thoth#6134\``,
        minRole: "Stick Controller"
    }
).set(
    "tsaddstick",
    {
        description: "Allows you to give another user in the voice channel a talking stick, while keeping your own.",
        argCount: "Takes one argument",
        arguments: "<ping a usre>",
        example: `\`${prefix}tsaddstick @Thoth#6134\``,
        minRole: "Stick Controller"
    }
).set(
    "tsremstick",
    {
        description: "Allows you to take a stick from a mentioned user.",
        argCount: "Takes one argument",
        arguments: "<ping a user>",
        example: `\`${prefix}tsremstick @Thoth#6134\``,
        minRole: "Stick Controller"
    }
);
// helpMap.set("getstarted", ["**CURRENTLY NOT IMPLEMENTED** Sets you on your way towards using Talking Stick!", "Takes no argument", "N/A", `\`${prefix}getstarted`, "User"])
// helpMap.set("dnw", ["This segment is currently under construction","User","Takes undefined argument/s", `\`${prefix}dnw\``]);

const genHelpEmbed = new MessageEmbed()
    .setTitle("**Help**")
    .setColor("GREEN")
    .setDescription(`**The basic Talking Stick commands are \`${prefix}tsjoin\` which will allow you to start the Talking Stick, and \`${prefix}tspass\` to pass the talking stick.**\n\nTo get help on a specific command, run \`${prefix}help <command>\`.`)
    .addField("Example", `\`${prefix}help tsjoin\`.`)
    .addField("Available help pages", `\`\`\`\n${[...helpMap.keys()].join('\n')}\`\`\``);

/**
 * @param {Message} message 
 * @param {string} args 
 */

export default async function (message, args) {
    const helpEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(botPfp);

    if (args) {
        let helpCmd = "";
        if (helpMap.has(args)) {
            const cmd = helpMap.get(args);

            helpEmbed
                .setAuthor(message.author.username, message.author.avatarURL())
                .setTitle(`**Help: \`${prefix}${args}\`**`)
                .setDescription(cmd.description)
                .addField(cmd.argCount, cmd.arguments)
                .addField("**Exmple**", cmd.example)
                .setFooter(`Minimum role of ${cmd.minRole} required to execute this command`);
            helpCmd = args;
            message.channel.send(helpEmbed).catch((e) => {
                datedErr(e);
                message.author.send(`Could not send help for \`${helpCmd}\` in ${message.channel.name}, sending help message here.\n` + helpEmbed).catch(datedErr);
            });
        } else message.tempReply(`${args} is not a valid command. For a list of commands, run \`${prefix}help\``).catch(datedErr);        
    } else if (!args) {
        helpEmbed.setAuthor(message.author.username, message.author.avatarURL());
        message.tempSend(genHelpEmbed).catch(datedErr);
    }
}
