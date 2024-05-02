import { VoiceState } from "discord.js";
import { hasRoles, findRole, someRole, datedErr } from "../../exports/functionExports.js";

/**
 * @param {VoiceState} oldState 
 * @param {VoiceState} newState
 * @returns {void} 
 */

export default async function (oldState, newState) {
    if (hasRoles(newState.guild)) {
        let listener_role = findRole(newState.guild, "Stick Listener");
        let tsleft_role   = findRole(newState.guild, "TSLeft"        );
        let holder_role   = findRole(newState.guild, "Stick Holder"  );

        if (!newState.member.voice.channel) {
            if (someRole(newState.member, "Stick Listener")) {
                oldState.member.roles.remove(listener_role).catch(datedErr);
                oldState.member.roles.add(tsleft_role).catch(datedErr);
            } else if (someRole(newState.member, "Stick Holder")) {
                oldState.member.roles.remove(holder_role).catch(datedErr);
            }
        } else if (someRole(newState.member, "TSLeft")) {
            if (!newState.member.voice.channel.members.some((member) => someRole(member, "Stick Holder"))) {
                newState.member.voice.setMute(false).catch(datedErr);
            }

            newState.member.roles.remove(tsleft_role).catch(datedErr);
        }
    }
}