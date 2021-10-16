import { VoiceState } from "discord.js";
import { hasRoles, findRole, someRole } from "../../exports/functionExports.js";

/**
 * @param {VoiceState} oldState 
 * @param {VoiceState} newState
 * @returns {void} 
 */

export default async function (oldState, newState) {
    if (hasRoles(oldState.guild) || hasRoles(newState.guild)) {
        if (!oldState.member.voice.channel) {
            if(findRole(oldState.member, "Stick Listener")) {
                oldState.member.roles.add(findRole(oldState.guild, "TSLeft")).catch((e) => datedErr(`Could not add TSLeft to ${oldState.member.user.tag} (${oldState.member.id})\nTSLeft Present?: ${someRole(oldState.guild, "TSLeft")}: voiceStateUpdate1:`,e));

                if (findRole(oldState.member, "Stick Listener")) { oldState.member.roles.remove(findRole(oldState.guild, "Stick Listener")).catch((e) => catedErr(`Could not remove Stick Listener from ${oldState.member.user.tag} (${oldState.member.id})\nStick Listener Present?: ${someRole(oldState.guild, "Stick Listener")}: voiceStateUpdate2:`,e)) }
            } else if (findRole(oldState.member, "Stick Holder")) { oldState.member.roles.remove(findRole(oldState.guild, "Stick Holder")).catch((e) => datedErr(`Could not remove Stick Holder from ${oldState.member.user.tag} (${oldState.member.id})\nStick Holder Present?: ${someRole(oldState.guild, "Stick Holder")}: voiceStateUpdate3:`,e)) }
        }
        if(newState.member.voice.channel && (findRole(newState.member, "TSLeft") && !newState.member.voice.channel.members.some((r) => findRole(r, "Stick Holder")))) {
            newState.member.voice.setMute(false).catch((e) => datedErr(`Unable to unmute ${newState.member.user.tag} due to TSLeft in ${newState.guild.name}: voiceStateUpdate4:`,e));
            newState.member.roles.remove(findRole(newState.member, "TSLeft")).catch((e) => datedErr(`Unable to remove role TSLeft from ${newState.member.user.tag} in ${newState.guild.name}:`,e));
        }
    }
}