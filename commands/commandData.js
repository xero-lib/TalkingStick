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

export default commands;