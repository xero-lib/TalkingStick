import { SlashCommandBuilder, PermissionsBitField } from "discord.js";
// import CommandMap from "../functions/commandMap.js";
import { helpMap } from "./help.js";

let helpChoices = [];
for (let cmd of helpMap.keys()) {
    helpChoices.push({ name: cmd, value: cmd });
}

let commands = [
    // help //
    new SlashCommandBuilder()
        .setName("help")
        .setDescription(helpMap.get("help").shortDesc)
        .addStringOption((option) => 
            option
                .setName("command")
                .addChoices(...helpChoices)
                .setDescription(helpMap.get("help").argDesc)
                .setRequired(false)
        ),

    // dnw //
    new SlashCommandBuilder()
        .setName("dnw")
        .setDescription("Bot not working? Use /dnw to submit a bug report to the developer.")
        .addStringOption((option) => 
            option
                .setName("message")
                .setMaxLength(2000)
                .setMinLength(2)
                .setDescription("Message to send with bug report")
                .setRequired(true)
        ),
    // tsinit //
    new SlashCommandBuilder()
        .setName("tsinit")
        .setDescription(helpMap.get("tsinit").shortDesc)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    // tsjoin //
    new SlashCommandBuilder()
        .setName("tsjoin")
        .setDescription(helpMap.get("tsjoin").shortDesc)
        .addStringOption((option) => 
            option
                .setName("channel-type")
                .addChoices(...[
                    { name: "Voice Channel", value: "voice" },
                    { name: "Text Channel",  value: "text"  }
                ])
                .setDescription(helpMap.get("tsjoin").argDesc)
                .setRequired(true)
        ),

    // tsleave //
    new SlashCommandBuilder()
        .setName("tsleave")
        .setDescription(helpMap.get("tsleave").shortDesc)
        .addStringOption((option) => 
            option
                .setName("channel-type")
                .addChoices(...[
                    { name: "Voice Channel", value: "voice" },
                    { name: "Text Channel",  value: "text"  }
                ])
                .setDescription(helpMap.get("tsleave").argDesc)
                .setRequired(true)
        ),

    // tspass //
    new SlashCommandBuilder()
        .setName("tspass")
        .setDescription(helpMap.get("tspass").shortDesc)
        .addStringOption((option) => 
            option
                .setName("channel-type")
                .addChoices(...[
                    { name: "Voice Channel", value: "voice" },
                    { name: "Text Channel",  value: "text"  }
                ])
                .setDescription(helpMap.get("tspass").argDesc[0])
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("recipient")
                .setDescription(helpMap.get("tspass").argDesc[1])
                .setRequired(true)
        ),

    // tsdestroy //
    new SlashCommandBuilder()
        .setName("tsdestroy")
        .setDescription(helpMap.get("tsdestroy").shortDesc)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    new SlashCommandBuilder()
        .setName("tsgivecon")
        .setDescription(helpMap.get("tsgivecon").shortDesc)
        .addUserOption((option) =>
            option
                .setName("recipient")
                .setDescription(helpMap.get("tsgivecon").argDesc)
                .setRequired(true)
        ),
    
    // tsremcon //
    new SlashCommandBuilder()
        .setName("tsremcon")
        .setDescription(helpMap.get("tsremcon").shortDesc)
        .addUserOption((option) =>
            option
                .setName("stick-controller")
                .setDescription(helpMap.get("tsremcon").argDesc)
                .setRequired(true)
        ),

    // tsaddstick //
    new SlashCommandBuilder()
        .setName("tsaddstick")
        .setDescription(helpMap.get("tsaddstick").shortDesc)
        .addUserOption((option) =>
            option
                .setName("recipient")
                .setDescription(helpMap.get("tsaddstick").argDesc)
                .setRequired(true)
        ),

    // tsremstick //
    new SlashCommandBuilder()
        .setName("tsremstick")
        .setDescription(helpMap.get("tsremstick").shortDesc)
        .addUserOption((option) =>
            option
                .setName("stick-holder")
                .setDescription(helpMap.get("tsremstick").argDesc)
                .setRequired(true)
        )
];

export let devCommands = [
    //send_message
    new SlashCommandBuilder()
        .setName("send_message")
        .setDescription("Send a message")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addStringOption((option) => 
            option
                .setName("message")
                .setDescription("Message to send")
                .setRequired(true)
        )
        .addStringOption((option) => 
            option
                .setName("id")
                .setDescription("ID for which user to send message to")
                .setRequired(true)
                .setMinLength(17)
                .setMaxLength(19)
        ),
    // status
    new SlashCommandBuilder()
        .setName("status")
        .setDescription("Returns embed of bot status")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    new SlashCommandBuilder()
    // resolve_user
        .setName("resolve_user")
        .setDescription("Gets information about a user given an ID")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addStringOption((option) => 
            option
                .setName("tag")
                .setDescription("Tag (Name#1234) for user to search")
                .setRequired(true)
                .setMinLength(17)
                .setMaxLength(19)
        ),
    // recache_hard
    new SlashCommandBuilder()
        .setName("recache_hard")
        .setDescription("Force recaches users and servers in event of API outage")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    // recache
    new SlashCommandBuilder()
        .setName("recache")
        .setDescription("Attempt to recache")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    // resolve_user_id 
    new SlashCommandBuilder()
        .setName("resolve_user_id")
        .setDescription("Resolves user by ID")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addStringOption((option) => 
            option
                .setName("id")
                .setDescription("ID for user to search")
                .setRequired(true)
                .setMinLength(17)
                .setMaxLength(19)
        ),
    // refresh_presence
    new SlashCommandBuilder()
        .setName("refresh_presence")
        .setDescription("Refreshes presence in event of Discord being weird")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    // invite
    new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Sends bot invite to send to users")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    // description 
    new SlashCommandBuilder()
        .setName("description")
        .setDescription("Sends description of the bot to the chat")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    // review
     new SlashCommandBuilder()
        .setName("review")
        .setDescription("Oh lawd be careful (sends review request to every server)")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    
];

export default commands;
