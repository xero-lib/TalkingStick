import { EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { createRole, someRole, datedErr } from "../exports/functionExports.js";
import { roles, developer, defaultPrefix as prefix } from "../exports/configExports.js";

import "../prototypes/tempSend.js";
import "../prototypes/tempReply.js";

/**
 * @param {ChatInputCommandInteraction} interaction 
 * @returns {void}
 */

export default async function (interaction) {
    if (interaction.member.permissions.has(8) || interaction.member.id == developer.id) {
        const tsinitEmbed = new EmbedBuilder()
        
        for(let role of roles){
            if(!someRole(interaction.guild, role)) {
                if (role == "Stick Holder") {
                    await createRole(role, interaction, "#c79638")
                        .then(() => tsinitEmbed.addFields([{ name: `__**Creating ${role}**__`, value: `${role} has been created.` }]))
                        .catch(() => interaction.reply({ content: `**Unable to create ${role}. Please ensure that the \`Talking Stick\` role is at the top of the roles list, and has sufficient permissions to create and manage roles.**`, ephemeral: true }).catch(datedErr));
                } else {
                    await createRole(role, interaction)
                        .then(() => tsinitEmbed.addFields([{ name: `__**Creating ${role}**__`, value: `${role} has been created.` }]))
                        .catch(datedErr);
                }
            } else tsinitEmbed.addFields([{ name: `__**Creating ${role}**__`, value: `${role} is present.` }]);
        }

        tsinitEmbed.setFooter({ text: "Done." })
            .setColor("Green")
            .setAuthor({ name: `${interaction.user.tag} executed TSInit`, iconURL: interaction.user.avatarURL() });
        
        interaction.reply({ embeds: [tsinitEmbed], ephemeral: false }).catch(datedErr);

        interaction.guild.fetch()
            .catch(async (e) => {
                datedErr(`Unable to cache ${interaction.guild.name} (ID: ${interaction.guild.id}) (owner: ${(await interaction.guild.fetchOwner()).tag} (${interaction.guild.ownerID}`, e);
                interaction.channel.send({ content: `Unable to cache all users! The bot might not work properly. To try again, rerun \`/tsinit\``, ephemeral: true }).catch(datedErr);
            })          
        

    } else interaction.reply({ content: "You do not have permission to do this.", ephemeral: true }).catch(datedErr);        
}