import { EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { datedErr } from "../exports/functionExports.js";
import { /* defaultPrefix as prefix, */ botPfp } from "../config/botConfig.js";

// import "../prototypes/tempSend.js";
// import "../prototypes/tempReply.js";

// I apologize for me horrendous formatting here, my OCD took over.
export const helpMap = new Map()
    .set(
        "help",
        {
            description: "Sends the user help for a given command.",
            shortDesc: "Sends the user help for a given command",
            argCount: "Takes one argument",
            args: "command",
            argDesc: "Which command to get help for",
            arguments: "<command you want help for>",
            example: `\`/help tsjoin\``,
            minRole: "everyone"
        }
    ).set(
        "tsinit",
        {
            description: "Creates all necessary roles for Talking Stick.",
            shortDesc: "Creates all necessary roles for Talking Stick",
            argCount: "Takes no argument",
            arguments: "N/A",
            example: `\`/tsinit\``,
            minRole: "Administrator"
        }
    ).set(
        "tsjoin",
        {
            description: "Activates Talking Stick in either a voice or a text channel depending on the passed argument. This will mute everyone except the member who sent the command, and assign the special Talking Stick roles.",
            shortDesc: "Activates Talking Stick in either current text or current voice channel",
            argCount: "Takes one argument",
            args: "type",
            argDesc: "Whether to apply to `voice` or `text`",
            arguments: "<`voice` or `text`>",
            example: `\`/tsjoin text\``,
            minRole: "Stick Controller",
        }
    ).set(
        "tsleave",
        {
            description: "Deactivates Talking Stick in either a voice or a text channel depending on the passed argument. This will allow everyone to talk again, and return them to their original roles.",
            shortDesc: "Allows everyone to talk again in either text or voice",
            argCount: "Takes one argument",
            args: "type",
            argDesc: "Whether to remove from `voice` or `text`",
            arguments: "<`voice` or `text`>",
            example: `\`/tsleave text\``,
            minRole: "Stick Controller"
        }
    ).set(
        "tspass",
        {
            description: "If you have the talking stick, you can pass it to someone else.",
            shortDesc: "Pass Talking Stick to someone else",
            argCount: "Takes two arguments",
            args: ["type", "user"],
            argDesc: ["Whether to pass in `voice` or `text", "Ping user to pass stick to"],
            arguments: "<`voice` or `text`> <ping a user>",
            example: `\`/tspass text @Thoth\``,
            minRole: "Stick Holder"
        }
    ).set(
        "tsdestroy",
        {
            description: "Deletes all roles created by the bot. **Warning**: any users still muted due to Talking Stick will remain muted until unmuted by a moderator.",
            shortDesc: "Deletes all roles created by the bot",
            argCount: "Takes no argument",
            example: "N/A",
            arguments: `\`/tsdestroy\``,
            minRole: "Administrator"
        }
    ).set(
        "tsgivecon",
        {
            description: "Allows you to give another user the `Stick Controller`.",
            shortDesc: "Allows you to give another user the `Stick Controller`",
            argCount: "Takes one argument",
            args: "user",
            argDesc: "Which user to give controller role to",
            arguments: "<ping a user>",
            example: `\`/tsgivecon @Thoth\``,
            minRole: "Stick Controller"
        }
    ).set(
        "tsremcon",
        {
            description: "Allows you to remove another user from the `Stick Controller` role.",
            shortDesc: "Allows you to remove another user from the `Stick Controller` role",
            argCount: "Takes one argument",
            args: "user",
            argDesc: "Which user to remove controller role from",
            arguments: "<ping a user>",
            example: `\`/tsremcon @Thoth\``,
            minRole: "Stick Controller"
        }
    ).set(
        "tsaddstick",
        {
            description: "Allows you to give another user in the voice or text a Talking Stick, while keeping the current holders.",
            shortDesc: "Give another user in a Talking Stick",
            argCount: "Takes one argument",
            args: "user",
            argDesc: "Which user to add a stick to",
            arguments: "<ping a usre>",
            example: `\`/tsaddstick @Thoth\``,
            minRole: "Stick Controller"
        }
    ).set(
        "tsremstick",
        {
            description: "Allows you to take a stick from a given user.",
            shortDesc: "Take a stick from a given user",
            argCount: "Takes one argument",
            args: "user",
            argDesc: "Which user to take a stick from",
            arguments: "<ping a user>",
            example: `\`/tsremstick @Thoth\``,
            minRole: "Stick Controller"
        }
    );

helpMap.set("getstarted", ["**CURRENTLY NOT IMPLEMENTED** Sets you on your way towards using Talking Stick!", "Takes no argument", "N/A", `\`/getstarted`, "User"])
helpMap.set("dnw", ["This segment is currently under construction","User","Takes undefined argument/s", `\`/dnw\``]);

const genHelpEmbed = new EmbedBuilder()
    .setTitle("**Help**")
    .setURL()
    .setColor("Green")
    .setDescription(`**The basic Talking Stick commands are \`/tsjoin\` which will allow you to start the Talking Stick, and \`/tspass\` to pass the talking stick.**\n\nTo get help on a specific command, run \`/help <command>\`.`)
    .addFields([
        { name: "Example", value: `\`/help tsjoin\`.` },
        { name: "Available help pages", value: `\`\`\`\n${[...helpMap.keys()].join('\n')}\`\`\`` }
    ])
    .setFooter({text: "Join the support server: https://discord.gg/cJ77STQ" });

/**
 * @param {ChatInputCommandInteraction} interaction
 */

export default async function (interaction) {
    
    // let cmd = interaction.options.get("command").value;
    const helpEmbed = new EmbedBuilder()
    .setColor("Green")
    .setThumbnail(botPfp);
    
    let cmd = interaction.options.get("command")?.value;
    if (cmd) {
        const helpCommand = helpMap.get(cmd);

        helpEmbed
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .setTitle(`**Help: \`/${cmd}\`**`)
            .setDescription(helpCommand.description)
            .addFields([
                { name: helpCommand.argCount, value: helpCommand.arguments },
                { name: "**Exmple**", value: helpCommand.example }
            ])
            .setFooter({ text: `Minimum role of ${helpCommand.minRole} required to execute this command` });

        interaction.reply({embeds: [helpEmbed], ephemeral: true}).catch((e) => {
            datedErr(e);
            interaction.user.send(`Could not send help for \`${cmd}\` in ${interaction.channel.name}, sending help message here.\n` + helpEmbed).catch(datedErr);
        });
    } else {
        helpEmbed.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() });
        interaction.reply({embeds: [genHelpEmbed], ephemeral: true}).catch(datedErr);
    }
}

// const helpEmbed = new EmbedBuilder();
// if (helpMap.has(args)) {
//     const cmd = helpMap.get(interaction.options.get("command").value);

//     helpEmbed
//         .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
//         .setTitle(`**Help: \`/${interaction.options.get("command").value}\`**`)
//         .setDescription(cmd.description)
//         .addFields([
//             { name: cmd.argCount, value: cmd.arguments },
//             { name: "**Exmple**", value: cmd.example }
//         ])
//         .setFooter({ text: `Minimum role of ${cmd.minRole} required to execute this command` });

//     interaction.channel.send(helpEmbed).catch((e) => {
//         datedErr(e);
//         interaction.user.send(`Could not send help for \`${args}\` in ${interaction.channel?.name ? interaction.channel.name : interaction.user.username}, sending help message here.\n` + helpEmbed).catch(datedErr);
//     });
// } else interaction.reply({ content: `${args} is not a valid command. For a list of commands, run \`/help\``, ephemeral: true }).catch(datedErr);
