import { EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { someRole, findRole, datedErr } from "../exports/functionExports.js";

import "../prototypes/tempSend.js";
import "../prototypes/tempReply.js";

/**
 * @param {ChatInputCommandInteraction} interaction
 * @returns {void}
 */

export default async function (interaction) {
    const tsLeaveEmbed = new EmbedBuilder();
    let type = interaction.options.get("channel-type").value;
    if ((someRole(interaction.member, "Stick Controller") || interaction.member.permissions.has(8))) {
        if (someRole(interaction.guild, "Stick Holder")) {
            if (!args)
                interaction.tempReply(`You must supply one argument. If you are in a voice channel, use \`/tsleave voice\`. If you are in a text channel, use \`/tsleave text.\``);
            if (interaction.member.voice.channel && args?.toLowerCase() === "voice") {
                for (const [_, member] of interaction.guild.members.cache) 
                    if (member.voice.channelId && member.voice.channelId === interaction.member.voice.channelId) {
                        member.voice.setMute(false).catch(datedErr);
                        member.roles.remove(findRole(interaction.guild, "Stick Holder")).catch(datedErr);
                        member.roles.remove(findRole(interaction.guild, "Stick Listener")).catch(datedErr);
                    }
                    
                tsLeaveEmbed
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
                    .setColor("Green")
                    .setTitle("Talking Stick:")
                    .addFields({ name: `${interaction.member.displayName} removed the Talking Stick.\n\tYou may now talk freely.`, value: `Removed from ${interaction.member.voice.channel.name}` });

                interaction.member.voice.channel.permissionOverwrites.edit(findRole(interaction.guild, "Stick Holder"), { Speak: null }).catch(datedErr);
                interaction.member.voice.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Speak: null }).catch(datedErr);
                interaction.reply({ embeds: [tsLeaveEmbed] }).catch(datedErr);
            } else if (args?.toLowerCase() === "text") {
                interaction.guild.roles.cache.array().forEach((r) => {
                    if(r.name?.toLowerCase() !== "muted")
                        interaction.channel.permissionOverwrites.edit(r, { SendMessageS: null }).catch((e) => 
                            datedErr(`Could not update permissions for ${r.name} for ${interaction.channel.name} in ${interaction.guild.name} requested by ${interaction.user.tag} (${interaction.member.id}) :`, e)
                        );
                });
                
                interaction.channel.permissionOverwrites.edit(findRole(interaction.guild, "Stick Holder"), { SendMessageS: null }).catch(datedErr);
                interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessageS: null }).catch(datedErr);
                for (const [_, member] of interaction.guild.members.cache) {
                    if(!member.voice.channelId && someRole(member, "Stick Holder")) {
                        member.roles.remove(findRole(interaction.guild, "Stick Holder")).catch(console.err);
                    }
                }
                
                tsLeaveEmbed
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
                    .setColor("Green")
                    .setTitle("Talking Stick")
                    .addFields({ name: `${interaction.member.displayName} removed the Talking Stick.\nYou may now type freely.`, value: `Removed from ${interaction.channel.name}` });

                interaction.reply({ embeds: [tsLeaveEmbed], ephemeral: false }).catch(datedErr);
            }
        } else interaction.reply({ content: `Please run \`/tsinit\` to create all requried roles.`, ephemeral: false }).catch(datedErr);
    } else interaction.reply({ content: "You do not have permission to do this.", ephemeral: false }).catch(datedErr);
}