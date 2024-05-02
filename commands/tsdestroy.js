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
        let tsleft_role = findRole(interaction.guild, "TSLeft");
        
        if (!tsleft_role) {
            interaction.reply("Server does not appear to have Talking Stick roles. `/tsdestroy` would do nothing. Attempting to remove roles anyway...").catch(datedErr); 
        } else {
            tsleft_role.members.map((member) => member.user.username).forEach((member) => str += member + '\n');
        }
        
        for (let role of roles) {
            if (someRole(interaction.guild, role)) {
                destroyRole(role, interaction);
                tsdestroyEmbed.addFields([{ name: `__Destroying ${role}__`, value: `${role} has been destroyed.` }]); 
            } else {
                tsdestroyEmbed.addFields([{ name: `__Destroying ${role}__`, value: `${role} is not present.` }]);
            }
        }
        
        if (str != "") tsdestroyEmbed.addFields([{ name: "**Users still muted:**\n", value: `${str}\n**These users must be manually unmuted the next time they join a voice channel.**` }]);
        tsdestroyEmbed.setAuthor({ name: `${interaction.user.tag} executed TSDestroy`, value: interaction.user.avatarURL() })
            .setColor("Red")
            .setFooter({ text: "Done." });
        interaction.reply({ embeds: [tsdestroyEmbed], ephemeral: false }).catch(datedErr);
    } else {
        interaction.reply({ content: "You do not have permission to do this.", ephemeral: true }).catch(datedErr);
    }
}
