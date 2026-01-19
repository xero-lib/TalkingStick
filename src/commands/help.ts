import { Colors, EmbedBuilder } from "discord.js";

import { ValidInteraction } from "../exports/dataExports.ts";
import { replyEphemeral } from "../exports/functionExports.ts";

interface HelpInfo {
    args?: string[],
    argDesc?: string[],
    argCount?: string,
    example: string,
    minPerm: string
    shortDesc: string,
    description: string,
}

export const helpMap = new Map<string, HelpInfo>()
    .set("help", {
        args: [ "command" ],
        argDesc: [ "Which command to get help for" ],
        example: "`/help tsjoin`",
        minPerm: "everyone",
        argCount: "Takes one argument",
        shortDesc: "Sends the user help for a given command",
        description: "Sends the user help for a given command.",
    })
    .set("tsinit", {
        example: "`/tsinit`",
        minPerm: "ManageRoles",
        shortDesc: "Creates all necessary roles for Talking Stick",
        description: "Creates all necessary roles for Talking Stick.",
    })
    .set("tsjoin", {
        args: [ "type" ],
        argDesc: [ "Whether to apply to `voice` or `text`" ],
        example: "`/tsjoin text`",
        minPerm: "Stick Controller",
        argCount: "Takes one argument",
        shortDesc: "Activates Talking Stick in either current text or current voice channel",
        description: "Activates Talking Stick in either a voice or a text channel depending on the passed argument. This will mute everyone except the member who sent the command, and assign the special Talking Stick roles."
    })
    .set("tsleave", {
        args: [ "type" ],
        argDesc: [ "Whether to remove from `voice` or `text`" ],
        example: "`/tsleave text`",
        minPerm: "Stick Controller",
        argCount: "Takes one argument",
        shortDesc: "Allows everyone to talk again in either text or voice",
        description: "Deactivates Talking Stick in either a voice or a text channel depending on the passed argument. This will allow everyone to talk again, and return them to their original roles.",
    })
    .set("tspass", {
        args: [ "type", "user" ],
        argDesc: [ "Whether to pass in `voice` or `text", "Ping user to pass stick to" ],
        example: "`/tspass text @Thoth`",
        minPerm: "Stick Holder",
        argCount: "Takes two arguments",
        shortDesc: "Pass Talking Stick to someone else",
        description: "If you have the talking stick, you can pass it to someone else.",
    })
    .set("tsdestroy", {
        example: "`/tsdestroy`",
        minPerm: "ManageRoles",
        argCount: "Takes no argument",
        shortDesc: "Deletes all roles created by the bot",
        description: "Deletes all roles created by the bot. **Warning**: any users still muted due to Talking Stick will remain muted until unmuted by a moderator.",
    })
    .set("tsgivecon", {
        args: [ "user" ],
        argDesc: [ "Which user to give controller role to" ],
        example: "`/tsgivecon @Thoth`",
        minPerm: "Stick Controller",
        argCount: "Takes one argument",
        shortDesc: "Allows you to give another user the `Stick Controller`",
        description: "Allows you to give another user the `Stick Controller`.",
    })
    .set("tsremcon", {
        args: [ "user" ],
        argDesc: [ "Which user to remove controller role from" ],
        example: "`/tsremcon @Thoth`",
        minPerm: "Stick Controller",
        argCount: "Takes one argument",
        shortDesc: "Allows you to remove another user from the `Stick Controller` role",
        description: "Allows you to remove another user from the `Stick Controller` role."
    })
    .set("tsaddstick", {
        args: [ "type", "user" ],
        argDesc: [ "Whether to give a user in your `voice` or `text` channel a Talking Stick", "Which user to add a stick to" ],
        example: "`/tsaddstick @Thoth`",
        minPerm: "Stick Controller",
        argCount: "Takes two arguments",
        shortDesc: "Give another user in a Talking Stick",
        description: "Allows you to give another user in the voice or text a Talking Stick, while keeping the current holders.",
    })
    .set("tsremstick", {
        args: [ "type", "user" ],
        argDesc: [ "What type of channel (`voice` or `text`) you want to remove a Talking Stick from", "Which user to take a stick from" ],
        example: "`/tsremstick @Thoth`",
        minPerm: "Stick Controller",
        argCount: "Takes two arguments",
        shortDesc: "Take a stick from a given user",
        description: "Allows you to take a stick from a given user.",
    })
    .set("getstarted", {
        example: "`/getstarted`",
        minPerm: "everyone",
        argCount: "Takes no argument",
        shortDesc: "Get started with Talking Stick!",
        description: "**CURRENTLY NOT IMPLEMENTED** Sets you on your way towards using Talking Stick!",
    })
    .set("dnw", {
        args: [ "message" ],
        argDesc: [ "Bug report message to send to the developer." ],
        example: "`/dnw The bot won't start a new stick-session!`",
        minPerm: "everyone",
        argCount: "Takes one argument",
        shortDesc: "Bug Report",
        description: "Allows you to report a big to the developer.",
    })
;

const genHelpEmbed = new EmbedBuilder()
    .setTitle("**Help**")
    .setURL("https://github.com/xero-lib/TalkingStick/README.md")
    .setColor(Colors.Green)
    .setDescription("**The basic Talking Stick commands are `/tsjoin` which will allow you to start the Talking Stick, and `/tspass` to pass the talking stick.**\n\nTo get help on a specific command, run `/help <command>`.")
    .addFields([
        { name: "Example", value: "`/help tsjoin`." },
        { name: "Available help pages", value: `\`\`\`\n${[...helpMap.keys()].join('\n')}\n\`\`\`` }
    ])
    .setFooter({text: "Join the [support server](https://discord.gg/cJ77STQ)." });

/**
 * Shows the user helpful information about the functionality of Talking Stick.
 * @param interaction The interaction to operate on.
 * @throws If an interaction reply fails.
 */
export default async function help(interaction: ValidInteraction) {
    const cmd = interaction.options.get("command")?.value;
    const helpCommand = typeof cmd === "string" ?  helpMap.get(cmd) : undefined;

    if (!helpCommand) {
        await replyEphemeral(interaction, { embeds: [genHelpEmbed] });
        return;
    }

    await replyEphemeral(interaction, {
        embeds: [
            new EmbedBuilder()
                .setColor(Colors.Green)
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
                .setTitle(`**Help: \`/${cmd}\`**`)
                .setDescription(helpCommand.description)
                .addFields([
                    { name: helpCommand.argCount || "", value: helpCommand.argDesc?.at(0) ?? "" },
                    { name: "**Exmple**", value: helpCommand.example }
                ])
            .setFooter({ text: `Minimum permission of ${helpCommand.minPerm} required to execute this command` })
        ]
    });
}