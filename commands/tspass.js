import { EmbedBuilder, ChatInputCommandInteraction, GuildMember, PermissionsBitField } from "discord.js";
import { datedErr } from "../exports/functionExports.js";
import { defaultPrefix as prefix, developer } from "../exports/configExports.js";
import { findRole, someRole, hasRoles } from "../exports/functionExports.js";

// import "../prototypes/tempSend.js";
// import "../prototypes/tempReply.js";

/**
 * @param {ChatInputCommandInteraction} interaction
 */

export default async function (interaction) {
    if(hasRoles(interaction.guild)) {
        if(
            someRole(interaction.member, "Stick Controller") ||
            someRole(interaction.member, "Stick Holder") ||
            interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) ||
            interaction.member.id === developer.id
        ) {
            /** @type {GuildMember} */ let member = interaction.options.getMember("recipient");
            /** @type {String} */ let type = interaction.options.get("channel-type").value;

            //todo: check if user is passing to self, say cannot pass to self
            const tspassEmbed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() });

            let listener_role = findRole(interaction.guild, "Stick Listener"); 
            let holder_role = findRole(interaction.guild, "Stick Holder");
            
            if (!listener_role || !holder_role) {
                interaction.reply({ ephemeral: false, content: "Unable to find all Talking Stick roles, please run `/tsinit`." }).catch(datedErr);
                datedErr(`Unable to find all roles in ${interaction.guild.name}(${interaction.guildId}): Listener: ${!!listener_role}, Holder: ${!!holder_role}`);
                return;
            }

            if (type == "voice") { //ignore the pyramid of death, I'll be implementing SCE in the next commit
                if (member.voice.channel && member.voice.channelId === interaction.member.voice.channelId) {
                    if(interaction.member.id != member.id) {

                        member.voice.setMute(false).catch(datedErr);
                        interaction.member.voice.setMute(true).catch((e) => 
                            datedErr("TSPass Error in interaction.member.voice.setMute:", e)
                        );
                        interaction.member.roles.add(listener_role).catch((e) => 
                            datedErr("TSPass Error in interaction.member.roles.add:", e)
                        );
                        interaction.member.roles.remove(holder_role).catch((e) => {
                            datedErr("TSPass Error in interaction.member.roles.remove:", e);
                            interaction.reply({ content: "In order for Talking Stick to work properly, you must drag the \`Talking Stick\` role to the top of the list in server settings.", ephemeral: false }).catch(datedErr);
                        });

                        member.roles.add(holder_role).catch(datedErr);
                        tspassEmbed
                            .addFields([{ name: "TSPass", value: `Passed stick to ${member.user.username} in ${member.voice.channel.name}` }])
                            .setColor("Green");
                        interaction.reply({ embeds: [tspassEmbed] }).catch(datedErr);
                    } else {
                        interaction.reply({ ephemeral: true, content: "You cannot pass the stick to yourself!" }).catch(datedErr);
                    }

                } else if(!member.voice.channel && !interaction.member.voice.channel) {
                    tspassEmbed
                        .addFields([{ name: "Failed to pass stick", value: "Both users must be in the same voice channel."}])
                        .setColor("Red");
                    interaction.reply({ embeds: [tspassEmbed] }).catch(datedErr);
                } else if(member.voice.channel && member.voice.channel != interaction.member.voice.channel)
                    tspassEmbed.addFields([{ name: "TSPass", value: `**${member.user.username} is not in ${interaction.member.voice.channel.name}.**` }]);
            } else if(type == "text") {
                interaction.member.roles.remove(holder_role).catch((err) => {
                    datedErr("TSPass Error in interaction.member.roles.remove:",err);
                    interaction.reply({ content: "In order for Talking Stick to work properly, you must drag the \`Talking Stick\` role to the top of the list in server settings.", ephemeral: false });
                });

                member.roles.add(holder_role).then(() => 
                    tspassEmbed.addFields([{ name: "TSPass", value: `Passed stick to ${member.user.username} in ${interaction.channel.name}` }])
                ).catch((e) =>
                    datedErr(`Unable to add stick holder to ${interaction.user.tag}:`,e)
                );
                    
                interaction.member.roles.remove(holder_role).catch(datedErr);

                tspassEmbed
                        .addFields([{ name: "TSPass", value: `Passed stick to ${member.user.username} in ${interaction.channel.name}` }])
                        .setColor("Green");
                interaction.reply({ embeds: [tspassEmbed] }).catch(datedErr);
            } else interaction.reply({ content: "**This command takes two arguments: `voice` or `text` and <ping a user>**", ephemeral: true }).catch(datedErr);
        } else interaction.reply({ content: "You do not have permission to do this.", ephemeral: false }).catch(datedErr);
    } else interaction.reply({ content: `You must run \`/tsinit\` to initialize all required roles for Talking Stick to work properly.`, ephemeral: false }).catch(datedErr);
}
