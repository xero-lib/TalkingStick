import { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits } from "discord.js";

// import CommandMap from "../functions/commandMap.js";
import { helpMap } from "./help.ts";

const helpChoices = [...helpMap.keys()].map((cmd) => ({ name: cmd, value: cmd }));

export const commands = [
    // help //
    new SlashCommandBuilder()
        .setName("help")
        .setDescription(helpMap.get("help")?.shortDesc ?? "Missing")
        .addStringOption((option) => 
            option
                .setName("command")
                .addChoices(...helpChoices)
                .setDescription(helpMap.get("help")?.argDesc?.at(0) ?? "Missing")
                .setRequired(false)
        ),

    // dnw //
    new SlashCommandBuilder()
        .setName("dnw")
        .setDescription("Bot not working? Use /dnw to submit a bug report to the developer.")
        .setContexts(InteractionContextType.Guild)
        .addStringOption((option) => 
            option
                .setName("message")
                .setMaxLength(2000)
                .setMinLength(10)
                .setDescription("Message to send with bug report")
                .setRequired(true)
        ),
    // tsinit //
    new SlashCommandBuilder()
        .setName("tsinit")
        .setContexts(InteractionContextType.Guild)
        .setDescription(helpMap.get("tsinit")?.shortDesc ?? "Missing")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    // tsjoin //
    new SlashCommandBuilder()
        .setName("tsjoin")
        .setContexts(InteractionContextType.Guild)
        .setDescription(helpMap.get("tsjoin")?.shortDesc ?? "Missing")
        .addStringOption((option) => 
            option
                .setName("channel-type")
                .addChoices(...[
                    { name: "Voice Channel", value: "voice" },
                    { name: "Text Channel",  value: "text"  }
                ])
                .setDescription(helpMap.get("tsjoin")?.argDesc?.at(0) ?? "Missing")
                .setRequired(true)
        ),

    // tsleave //
    new SlashCommandBuilder()
        .setName("tsleave")
        .setContexts(InteractionContextType.Guild)
        .setDescription(helpMap.get("tsleave")?.shortDesc ?? "Missing")
        .addStringOption((option) => 
            option
                .setName("channel-type")
                .addChoices(...[
                    { name: "Voice Channel", value: "voice" },
                    { name: "Text Channel",  value: "text"  }
                ])
                .setDescription(helpMap.get("tsleave")?.argDesc?.at(0) ?? "Missing")
                .setRequired(true)
        ),

    // tspass //
    new SlashCommandBuilder()
        .setName("tspass")
        .setContexts(InteractionContextType.Guild)
        .setDescription(helpMap.get("tspass")?.shortDesc ?? "Missing")
        .addStringOption((option) => 
            option
                .setName("channel-type")
                .addChoices(...[
                    { name: "Voice Channel", value: "voice" },
                    { name: "Text Channel",  value: "text"  }
                ])
                .setDescription(helpMap.get("tspass")?.argDesc?.at(0) ?? "Missing")
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("recipient")
                .setDescription(helpMap.get("tspass")?.argDesc?.at(1) ?? "Missing")
                .setRequired(true)
        ),

    // tsdestroy //
    new SlashCommandBuilder()
        .setName("tsdestroy")
        .setContexts(InteractionContextType.Guild)
        .setDescription(helpMap.get("tsdestroy")?.shortDesc ?? "Missing")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    // tsgivecon //
    new SlashCommandBuilder()
        .setName("tsgivecon")
        .setDescription(helpMap.get("tsgivecon")?.shortDesc ?? "Missing")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption((option) =>
            option
                .setName("recipient")
                .setDescription(helpMap.get("tsgivecon")?.argDesc?.at(0) ?? "Missing")
                .setRequired(true)
        ),
    
    // tsremcon //
    new SlashCommandBuilder()
        .setName("tsremcon")
        .setDescription(helpMap.get("tsremcon")?.shortDesc ?? "Missing")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption((option) =>
            option
                .setName("stick-controller")
                .setDescription(helpMap.get("tsremcon")?.argDesc?.at(0) ?? "Missing")
                .setRequired(true)
        ),

    // tsaddstick //
    new SlashCommandBuilder()
        .setName("tsaddstick")
        .setDescription(helpMap.get("tsaddstick")?.shortDesc ?? "Missing")
        .addStringOption((option) => 
            option
                .setName("channel-type")
                .addChoices(...[
                    { name: "Voice Channel", value: "voice" },
                    { name: "Text Channel",  value: "text"  }
                ])
                .setDescription(helpMap.get("tsaddstick")?.argDesc?.at(0) ?? "Missing")
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("recipient")
                .setDescription(helpMap.get("tsaddstick")?.argDesc?.at(1) ?? "Missing")
                .setRequired(true)
        ),

    // tsremstick //
    new SlashCommandBuilder()
        .setName("tsremstick")
        .setDescription(helpMap.get("tsremstick")?.shortDesc ?? "Missing")
        .addStringOption((option) => 
            option
                .setName("channel-type")
                .addChoices(...[
                    { name: "Voice Channel", value: "voice" },
                    { name: "Text Channel",  value: "text"  }
                ])
                .setDescription(helpMap.get("tsremstick")?.argDesc?.at(0) ?? "Missing")
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("stick-holder")
                .setDescription(helpMap.get("tsremstick")?.argDesc?.at(1) ?? "Missing")
                .setRequired(true)
        )
];

export const devCommands = [
    //send_message
    new SlashCommandBuilder()
        .setName("send_message")
        .setDescription("Send a message")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
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
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    // resolve_user
    new SlashCommandBuilder()
        .setName("resolve_user")
        .setDescription("Gets information about a user given a username")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) => 
            option
                .setName("username")
                .setDescription("Username (_thoth) of user to search")
                .setRequired(true)
        ),

    // recache
    new SlashCommandBuilder()
        .setName("recache")
        .setDescription("Force recaches users and servers in event of API outage")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    // resolve_user_id 
    new SlashCommandBuilder()
        .setName("resolve_user_id")
        .setDescription("Resolves user by ID")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
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
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    // invite
    new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Sends bot invite to send to users")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    // description 
    new SlashCommandBuilder()
        .setName("description")
        .setDescription("Sends description of the bot to the chat")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    // review
     new SlashCommandBuilder()
        .setName("review")
        .setDescription("Oh lawd be careful (sends review request to every server)")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    
];