import { EmbedBuilder, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import { someRole, findRole, datedErr, hasRoles } from "../exports/functionExports.js";
import { developer } from "../exports/configExports.js";

import "../prototypes/tempSend.js";
import "../prototypes/tempReply.js";

/**
 * 
 * @param {ChatInputCommandInteraction} interaction
 * @returns {void}
 */

export default async function (interaction) {
    const tsEmbed = new EmbedBuilder();
    let type = interaction.options.get("channel-type").value;
    if (hasRoles(interaction.guild)) {
        if (//if interaction author is in Stick Controller group, an admin, or the developer for prod debugging reasons
            someRole(interaction.member, "Stick Controller") ||
            interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) ||
            interaction.member.id === developer.id
        ) {
            if (interaction.member.voice.channel && type == "voice") {//if  the user is in a voice channel and also passed the "voice" argument
                interaction.member.roles.add(findRole(interaction.guild, "Stick Holder")).catch(() =>
                    datedErr("Could not add Stick holder to", `${interaction.user.username} (${interaction.user.id}) in ${interaction.guild.name}`)
                ); //Add interaction author to Stick Holder

                interaction.member.voice.channel.permissionOverwrites.edit(findRole(interaction.guild, "Stick Holder"), { Speak: true }).catch((err) => {
                    datedErr(`Error in permissionOverwrites.edit for role Stick Holder in ${interaction.guild.name}:`,err);
                    interaction.reply("The bot has encountered a problem. Please contact the developer by joining the development server: https://discord.gg/cJ77STQ").catch(datedErr);
                }); //Add Stick Holder permissions to the channel
                
                interaction.member.voice.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Speak: false }).catch((e) => {
                    interaction.reply({content: "Unable to update permissions for the everyone role. Please ensure the Talking Stick role is placed at the top of the role list in the server settings.", ephemeral: false });
                    datedErr("Error in tsjoin: voice: permissionOverwrites.edit @everyone:", e);
                }); //Disable @everyones' ability to speak. This prevents users joining from being able to speak for a moment before the bot mutes them
                
                tsEmbed //create the tsEmbed
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
                    .setColor("Green")
                    .setTitle("Talking Stick:")
                    .addFields([{ name: `${interaction.user.username} has the Talking Stick!`, value: `Currently in ${interaction.member.voice.channel.name}` }])
                    .setFooter({ text: `To pass the Talking Stick, use /tspass <ping a user in the same channel as you>` });

                for (const [_, member] of interaction.member.voice.channel.members) { //mute everyone in the channel except for the member who called ts
                    if (member != interaction.member) {
                        member.voice.setMute(true).catch((e) => {
                            datedErr(`Unable to mute voice in ${interaction.guild.name}:`,e);
                            interaction.reply(`**Unable to mute members in ${interaction.member.voice.channel.name}. Please report this incident in the support server (https://discord.gg/cJ77STQ).**`).catch(datedErr);
                        });
                        member.roles.add(findRole(member.guild, "Stick Listener")).catch((e) => {
                            datedErr(`Unable to update role for ${member.user.tag} (${member.id}):`,e)
                            interaction.reply(`**Unable to update role for ${member.user.tag}. Please report this incident in the support server (https://discord.gg/cJ77STQ). A possible solution is to move the Talking Stick role above all others under Server Settings > Roles and by ensuring that the Talking Stick role has the Manage Roles permission.**`).catch(datedErr);
                        });
                    }
                }
                
                interaction.reply({ embeds: [tsEmbed], ephemeral: false }).catch(datedErr); //send the embed

            } else if (type == "text") {//if the user passed the argument "text"
                interaction.guild.roles.cache.forEach((r) => {
                    if(!["muted", "timeout"].includes(r.name.toLowerCase())) interaction.channel.permissionOverwrites.edit(r, { SendMessages: false }).catch((e) =>
                        datedErr(`Could not update permissions for ${r.name} in ${interaction.channel.name} in ${interaction.guild.name} requested by ${interaction.user.tag} (${interaction.member.id}) :`, e)
                    );
                    
                });

                interaction.channel.permissionOverwrites.edit(findRole(interaction.guild, "Talking Stick"), { SendMessages: true }).catch(datedErr);
                interaction.member.roles.add(findRole(interaction.guild, "Stick Holder")).catch(datedErr);
                interaction.channel.permissionOverwrites.edit(findRole(interaction.guild, "Stick Holder"), { SendMessages: true }).catch(datedErr);
                interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false }).catch((e) => {
                    interaction.reply({content: "Unable to update permissions for the everyone role. Please ensure the Talking Stick role is placed at the top of the role list in the server settings.", ephemeral: false });
                    datedErr(e);
                });
                    
                tsEmbed
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
                    .setColor("Green")
                    .setTitle("Talking Stick:")
                    .addFields([{ name: `${interaction.user.tag} has the Talking Stick!`, value: `Currently in ${interaction.channel.name}` }])
                    .setFooter({ text: `To pass the Talking Stick, use /tspass <ping a user>` });

                interaction.reply({ embeds: [tsEmbed] , ephemeral: false }).catch((e) =>
                    datedErr(e, `\nStill could not send tsEmbed in ${interaction.channel.name} in ${interaction.guild.name}, requested by ${interaction.user.tag} (${interaction.user.id}), even after attempting to override.`)
                );
            }
            else if(!interaction.member.voice.channelId && type == "voice")  {
                interaction.reply({ content: "You need to join a voice channel first!", ephemeral: true });
                console.log(JSON.stringify(interaction.member)); // debugging
            }
        } else interaction.reply({ content: "You do not have permission to do this.", ephemeral: false }); 
    } else interaction.reply({ content: `Please run \`/tsinit\` to create the required roles`, ephemeral: false });
}
