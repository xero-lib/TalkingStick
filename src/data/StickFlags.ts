import { PermissionFlagsBits } from "discord.js"

export const StickFlags = {
    TEXT_MAGIC  : PermissionFlagsBits.Connect,
    TEXT_REVERT : PermissionFlagsBits.PrioritySpeaker, // revert member to their original allow overwrite state

    VOICE_MAGIC : PermissionFlagsBits.SendMessagesInThreads,
    VOICE_REVERT: PermissionFlagsBits.CreatePrivateThreads, // revert member to their original allow overwrite state

    ACTIVE_MAGIC: PermissionFlagsBits.Speak // applied to the TSActive role in a given channel to indicate a stick session is active
}