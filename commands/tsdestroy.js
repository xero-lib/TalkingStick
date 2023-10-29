import { EmbedBuilder, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import { roles } from "../exports/configExports.js";
import { someRole, findRole, destroyRole, datedErr } from "../exports/functionExports.js";

import "../prototypes/tempSend.js";
import "../prototypes/tempReply.js";

/**
 * @param {ChatInputCommandInteraction} interaction 
 * @returns {void}
 */

export default async function (interaction) {
    if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.member.id == developer.id) { //if message author has admin perms
        let tsdestroyEmbed = new EmbedBuilder();
        let str = "";
        if (findRole(interaction.guild, "TSLeft")) findRole(interaction.guild, "TSLeft").members.map((member) => member.user.username).forEach((member) => str += member + '\n');
        
        for (let roleIdx in roles) {
            if (someRole(interaction.guild, roles[roleIdx])) {
                destroyRole(roles[roleIdx], interaction);
                tsdestroyEmbed.addFields([{ name: `__Destroying ${roles[roleIdx]}__`, value: `${roles[roleIdx]} has been destroyed.` }]); 
            } else tsdestroyEmbed.addFields([{ name: `__Destroying ${roles[roleIdx]}__`, value: `${roles[roleIdx]} is not present.` }]);
        }
        
        if (str != "") tsdestroyEmbed.addFields([{ name: "**Users still muted:**\n", value: `${str}\n**These users must be manually unmuted the next time they join a voice channel.**` }]);
        tsdestroyEmbed.setAuthor({ name: `${interaction.user.tag} executed TSDestroy`, value: interaction.user.avatarURL() })
            .setColor("Red")
            .setFooter({ text: "Done." });
        interaction.reply({ embeds: [tsdestroyEmbed], ephemeral: false }).catch(datedErr);

     
        
    } else interaction.reply({ content: "You do not have permission to do this.", ephemeral: true }).catch(datedErr);
}
