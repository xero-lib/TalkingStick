import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import { developer, } from "../exports/configExports.js";
import { someRole, findRole, hasRoles, datedErr } from "../exports/functionExports.js";

/**
 * @param {ChatInputCommandInteraction} interaction
 * @returns {void}
 */

export default async function (interaction) {
    let member = interaction.options.getMember("recipient");
    if(!hasRoles(interaction.guild)) {
        interaction.reply("Server does not have Talking Stick roles. Please run `/tsinit`.").catch(datedErr); 
        return;
    }

    if (
        interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) ||
        someRole(interaction.member, "Stick Controller") ||
        interaction.member.id == developer.id
    ) {
        if (interaction.member.voice.channel && !member.voice.channel) {
            /*if the executor is in a voice channel but the mentioned member is not */
            interaction.reply({ content: `${member.displayName} is not in your voice channel.`, ephemeral: true }).catch(datedErr);
        } else if (interaction.member.voice.channel && member.voice.channelId === interaction.member.voice.channelId) {
            member.roles.add(findRole(interaction.guild, "Stick Holder")).catch(datedErr);
            member.voice.setMute(false).catch(datedErr);
        } else {
            interaction.reply({ content: "You must be in a voice channel! <EC20045>" }).catch(datedErr);
            datedErr("Infailable condition failed?", interaction);
        }
    } else { 
        interaction.reply({ content: "You do not have permission to do this.", ephemeral: true }).catch(datedErr);
    }
}