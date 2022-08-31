import { EmbedBuilder, ChatInputCommandInteraction, GuildMember } from "discord.js";
import { datedErr } from "../exports/functionExports.js";
import { defaultPrefix as prefix, developer } from "../exports/configExports.js";
import { findRole, someRole, hasRoles } from "../exports/functionExports.js";

import "../prototypes/tempSend.js";
import "../prototypes/tempReply.js";

/**
 * @param {ChatInputCommandInteraction} interaction
 */

export default async function (interaction) {
    if(hasRoles(interaction.guild)) {
        if(
            someRole(interaction.member, "Stick Controller") ||
            someRole(interaction.member, "Stick Holder") ||
            interaction.member.permissions.has(8) ||
            interaction.member.id === developer.id
        ) {
            /** @type {GuildMember} */ let member = interaction.options.getMember("recipient");
            /** @type {String} */ let type = interaction.options.get("channel-type").value;

            const tspassEmbed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
                .setColor("Green");
            if (type == "voice") { //ignore the pyramid of death, I'll be implementing SCE in the next commit
                if (member.voice.channelId && member.voice.channelId === interaction.member.voice.channelId) {
                    member.voice.setMute(false).catch(datedErr);
                    if(interaction.member.id != member.id) {
                        interaction.member.voice.setMute(true).catch((e) => 
                            datedErr("TSPass Error in interaction.member.voice.setMute:", e)
                        );
                        interaction.member.roles.add(findRole(interaction.guild, "Stick Listener")).catch((e) => 
                            datedErr("TSPass Error in interaction.member.roles.add:", e)
                        );
                        interaction.member.roles.remove(findRole(interaction.guild, "Stick Holder")).catch((e) => {
                            datedErr("TSPass Error in interaction.member.roles.remove:", e);
                            interaction.reply({ content: "In order for Talking Stick to work properly, you must drag the \`Talking Stick\` role to the top of the list in server settings.", ephemeral: false }).catch(datedErr);
                        });
                    }

                    member.roles.add(findRole(interaction.guild, "Stick Holder")).catch(datedErr);
                    tspassEmbed.addFields({ name: "TSPass", value: `Passed stick to ${member.displayName} in ${member.voice.channel.name}` });
                    interaction.reply({ embeds: [tspassEmbed] }).catch(datedErr);
                } else if(!member.voice.channelId && !interaction.member.voice.channelId) {
                    member.roles.add(findRole(interaction.guild, "Stick Holder"))
                        .then(() => tspassEmbed.addFields({ name: "TSPass", value: `Passed stick to ${member.user.tag} in ${interaction.channel.name}` }))
                        .catch((e) => datedErr("Error in tspass:", e));
                    interaction.member.roles.remove(findRole(interaction.guild, "Stick Holder")).catch(datedErr);
                    interaction.reply({ embeds: [tspassEmbed] }).catch(datedErr);
                } else if(member.voice.channelId && member.voice.channelId != interaction.member.voice.channelId)
                    tspassEmbed.addFields({ name: "TSPass", value: `**${member.displayName} is not in ${interaction.member.voice.channel.name}.**` });
            } else if(type == "text") {
                if(member) {
                    interaction.member.roles.remove(findRole(interaction.guild, "Stick Holder")).catch((err) => {
                        datedErr("TSPass Error in interaction.member.roles.remove:",err);
                        interaction.reply({ content: "In order for Talking Stick to work properly, you must drag the \`Talking Stick\` role to the top of the list in server settings.", ephemeral: false });
                    });

                    member.roles.add(findRole(interaction.guild, "Stick Holder")).then(() => 
                        tspassEmbed.addFields({ name: "TSPass", value: `Passed stick to ${member.displayName} in ${interaction.channel.name}` })
                    ).catch((e) => datedErr(`Unable to add stick holder to ${interaction.user.tag}:`,e));
                        
                    interaction.member.roles.remove(findRole(interaction.guild, "Stick Holder")).catch(datedErr);
                    interaction.reply({ embeds: [tspassEmbed] }).catch(datedErr);
                }
            } else interaction.reply({ content: "**This command takes two arguments: `voice` or `text` and <ping a user>**", ephemeral: true }).catch(datedErr);
        } else interaction.reply({ content: "You do not have permission to do this.", ephemeral: false }).catch(datedErr);
    } else interaction.reply({ content: `You must run \`/tsinit\` to initialize all required roles for Talking Stick to work properly.`, ephemeral: false }).catch(datedErr);
}
