/** Enum to assist in the resolution and consistency of roles and their names. */
export enum Roles {
    // TSLeft          = "TSLeft",
    // TSText          = "TSText",
    // TSVoice         = "TSVoice",
    // TSRevert        = "TSRevert",
    TSActive        = "TSActive",
    TSIgnore        = "TSIgnore", // potentially out of scope
    // StickHolder     = "Stick Holder",
    // StickListener   = "Stick Listener",
    StickController = "Stick Controller",
}

export type RoleNames = keyof typeof Roles;