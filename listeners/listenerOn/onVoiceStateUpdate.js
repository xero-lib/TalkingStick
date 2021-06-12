import {
  guildHasRoles,
  findRole,
  someRole,
  date,
} from "../../coagulators/functionCoagulator.js";

export default async function onVoiceStateUpdate(oldState, newState) {
  if (guildHasRoles(oldState.guild) || guildHasRoles(newState.guild)) {
    if (!oldState.member.voice.channel) {
      if (findRole(oldState.member, "Stick Listener")) {
        oldState.member.roles
          .add(findRole(oldState.guild, "TSLeft"))
          .then(() =>
            console.log(
              date(),
              `Added role TSLeft from ${oldState.member.user.username}#${oldState.member.user.discriminator} (${oldState.member.id})`
            )
          )
          .catch((e) =>
            console.error(
              date(),
              `Could not add TSLeft to ${oldState.member.user.username}#${
                oldState.member.user.discriminator
              } (${oldState.member.id})\nTSLeft Present?: ${someRole(
                oldState.guild,
                "TSLeft"
              )}: voiceStateUpdate1:`,
              e
            )
          );

        if (findRole(oldState.member, "Stick Listener")) {
          oldState.member.roles
            .remove(findRole(oldState.guild, "Stick Listener"))
            .then(() => console.log(date(), `Removed role Stick Listener from`))
            .catch((e) =>
              console.error(
                date(),
                `Could not remove Stick Listener from ${
                  oldState.member.user.username
                }#${oldState.member.user.discriminator} (${
                  oldState.member.id
                })\nStick Listener Present?: ${someRole(
                  oldState.guild,
                  "Stick Listener"
                )}: voiceStateUpdate2:`,
                e
              )
            );
        }
      }
      if (findRole(oldState.member, "Stick Holder")) {
        oldState.member.roles
          .remove(findRole(oldState.guild, "Stick Holder"))
          .then(() =>
            console.log(
              date(),
              `Removed role Stick Holder from ${oldState.member.user.username}#${oldState.member.user.discriminator} (${oldState.member.id}) in ${oldState.guild.name} due to leaving the voice channel.`
            )
          )
          .catch((e) =>
            console.error(
              date(),
              `Could not remove Stick Holder from ${
                oldState.member.user.username
              }#${oldState.member.user.discriminator} (${
                oldState.member.id
              })\nStick Holder Present?: ${someRole(
                oldState.guild,
                "Stick Holder"
              )}: voiceStateUpdate3:`,
              e
            )
          );
      }
    }
    if (newState.member.voice.channel) {
      if (
        findRole(newState.member, "TSLeft") &&
        !newState.member.voice.channel.members.some((r) =>
          findRole(r, "Stick Holder")
        )
      ) {
        //potential problem
        newState.member.voice
          .setMute(false)
          .then(() =>
            console.log(
              date(),
              `Successfully unmuted ${newState.member.user.username} due to TSLeft in ${newState.guild.name}.`
            )
          )
          .catch((e) =>
            console.error(
              date(),
              `Unable to unmute ${newState.member.user.username} due to TSLeft in ${newState.guild.name}: voiceStateUpdate4:`,
              e
            )
          );

        newState.member.roles
          .remove(findRole(newState.member, "TSLeft"))
          .then(() =>
            console.log(
              date(),
              `Removed role TSLeft from ${newState.member.user.username}#${newState.member.user.discriminator} (${newState.member.id}) in ${newState.guild.name} due to joining the voice channel.`
            )
          )
          .catch((e) =>
            console.error(
              date(),
              `Unable to remove role TSLeft from ${newState.member.user.username} in ${newState.guild.name}:`,
              e
            )
          );
      }
    }
  }
}
