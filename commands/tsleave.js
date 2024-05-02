import { EmbedBuilder, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import { someRole, findRole, datedErr, hasRoles } from "../exports/functionExports.js";
import { developer } from "../index.js";

// import "../prototypes/tempSend.js";
// import "../prototypes/tempReply.js";

/**
 * @param {ChatInputCommandInteraction} interaction
 * @returns {void}
 */

export default async function (interaction) {
    if (!hasRoles(interaction.guild)) {
        interaction.reply("Server does not have Talking Stick roles. Please run `/tsinit`.").catch(datedErr); 
        return;
    }
    
    let holder_role = findRole(interaction.guild, "Stick Holder");
    let listener_role = findRole(interaction.guild, "Stick Listener");

    let tsLeaveEmbed = new EmbedBuilder();

    let type = interaction.options.get("channel-type").value;
    if ((
        someRole(interaction.member, "Stick Controller") ||
        interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) ||
        interaction.member.id == developer.id
    )) {
        if (interaction.member.voice.channelId && type === "voice") {
            for (const [_, member] of interaction.guild.members.cache) 
                if (member.voice.channelId && member.voice.channelId === interaction.member.voice.channelId) {
                    member.voice.setMute(false).catch(datedErr);
                    member.roles.remove(holder_role).catch(datedErr);
                    member.roles.remove(listener_role).catch(datedErr);
                }
                
            tsLeaveEmbed
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
                .setColor("Green")
                .setTitle("Talking Stick:")
                .addFields([{ name: `${interaction.user.displayName} removed the Talking Stick.\n\n**You may now talk freely.**`, value: `Removed from ${interaction.member.voice.channel}` }]);

            interaction.member.voice.channel.permissionOverwrites.edit(holder_role, { Speak: null }).catch(datedErr);
            interaction.member.voice.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Speak: null }).catch((e) => {
                interaction.reply({content: "Unable to update permissions for the everyone role. Please ensure the Talking Stick role is placed at the top of the role list in the server settings.", ephemeral: false });
                datedErr(e);
            });
            interaction.reply({ embeds: [tsLeaveEmbed] }).catch(datedErr);
        } else { // Type must equal 'text' due to the interaction limitation
            interaction.guild.roles.cache.forEach((r) => {
                if(r.name?.toLowerCase() !== "muted")
                    interaction.channel.permissionOverwrites.edit(r, { SendMessages: null }).catch((e) => 
                        datedErr(`Could not update permissions for ${r.name} for ${interaction.channel.name} in ${interaction.guild.name} requested by ${interaction.user.username} (${interaction.member.id}) :`, e)
                    );
            });
            
            interaction.channel.permissionOverwrites.edit(holder_role, { SendMessages: null }).catch(datedErr);
            interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: null }).catch(datedErr);
            for (const [_, member] of interaction.guild.members.cache) {
                if (!member.voice.channel && someRole(member, "Stick Holder")) {
                    member.roles.remove(holder_role).catch(console.err);
                }
            }
            
            tsLeaveEmbed
                .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.avatarURL() })
                .setColor("Green")
                .setTitle("Talking Stick")
                .addFields([{ name: `${interaction.user.displayName} removed the Talking Stick.\nYou may now type freely.`, value: `Removed from ${interaction.channel}` }]);

            interaction.reply({ embeds: [tsLeaveEmbed], ephemeral: false }).catch(datedErr);
        }
    } else {
        interaction.reply({ content: "You do not have permission to do this.", ephemeral: false }).catch(datedErr);
    }
}