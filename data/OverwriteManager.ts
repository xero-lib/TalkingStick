import { OverwriteData, OverwriteType, PermissionFlagsBits, PermissionOverwrites } from "discord.js";

import { StickFlags } from "../exports/dataExports.ts";

type FlagState = "allow" | "deny";

class FlagManager {
    private bitfield: bigint;

    constructor(bitfield?: bigint) {
        this.bitfield = bitfield ?? 0n;
    }

    /**
     * Adds a flag to the flag manager.
     * @param flag The flag to add to the 
     */
    add(flag: bigint): void {
        this.bitfield |= flag;
    }

    /**
     * Checks if the flag manager has a given flag.
     * @param flag The flag to check the presence of.
     * @returns True if the flag is found, false if not.
     */
    has(flag: bigint): boolean {
        return (this.bitfield & flag) === flag;
    }

    /**
     * Removes a flag, if it exists.
     * @param flag The flag to remove.
     * @returns True if the flag existed and was removed, false if not.
     */
    remove(flag: bigint): boolean {
        if (!this.has(flag)) return false;
        this.bitfield &= ~flag;
        return true;
    }
    
    /**
     * Getter for the bitfield property.
     * @returns The bitfield representation of the flag state.
     */
    getBitfield(): bigint {
        return this.bitfield;
    }
}

/**
 * A class to manage PermissionOverwrite flag states using bigints.
 */
export class StickFlagManager<S extends FlagState> {
    declare readonly _state: S;
    private flags: FlagManager;
    private BOT_MAGIC: bigint;
    private CommunicatePermission: bigint;
    private REVERT_MAGIC: bigint;

    constructor(isVoice: boolean);
    constructor(isVoice: boolean, bitfield: bigint);

    constructor(isVoice: boolean, bitfield?: bigint) {
        this.flags = new FlagManager(bitfield);

        [ this.BOT_MAGIC, this.REVERT_MAGIC, this.CommunicatePermission ] = isVoice
            ? [ StickFlags.VOICE_MAGIC, StickFlags.VOICE_REVERT, PermissionFlagsBits.Speak        ]
            : [ StickFlags.TEXT_MAGIC , StickFlags.TEXT_REVERT , PermissionFlagsBits.SendMessages ]
        ;
    }

    fromBot(): boolean {
        return this.flags.has(this.BOT_MAGIC); 
    }

    canCommunicate(this: StickFlagManager<"allow">): boolean {
        return this.flags.has(this.CommunicatePermission);
    }

    addStick(this: StickFlagManager<"allow">) {
        this.flags.add(
            this.CommunicatePermission
                | this.BOT_MAGIC
                | ((this.flags.has(this.CommunicatePermission) && !this.flags.has(this.BOT_MAGIC)) ? this.REVERT_MAGIC : 0n)
        );
    }

    removeStick(this: StickFlagManager<"allow">) {
        this.flags.remove(this.CommunicatePermission | this.BOT_MAGIC);
    }

    addMute(this: StickFlagManager<"deny">) {
        this.flags.add(
            this.CommunicatePermission
                | this.BOT_MAGIC
                | ((this.flags.has(this.CommunicatePermission) && !this.flags.has(this.BOT_MAGIC)) ? this.REVERT_MAGIC : 0n)
        );
    }

    removeMute(this: StickFlagManager<"deny">) {
        this.flags.remove(this.CommunicatePermission | this.BOT_MAGIC);
    }

    shouldRevert(): boolean {
        return this.flags.has(this.REVERT_MAGIC);
    }

    revert() {
        if (this.shouldRevert()) {
            this.flags.add(this.CommunicatePermission);
        } else {
            this.flags.remove(this.CommunicatePermission);
        }

        this.flags.remove(this.BOT_MAGIC | this.REVERT_MAGIC);
    }

    getBitfield(): bigint {
        return this.flags.getBitfield();
    }
}

export default class OverwriteManager {
    private allow: StickFlagManager<"allow">;
    private deny: StickFlagManager<"deny">;
    private id: string | null = null;
    private type: OverwriteType | null = null;

    constructor(isVoice: boolean);
    constructor(isVoice: boolean, overwrites: PermissionOverwrites);

    constructor(isVoice:boolean, overwrites?: PermissionOverwrites) {
        if (!overwrites) {
            this.allow = new StickFlagManager<"allow">(isVoice);
            this.deny  = new StickFlagManager<"deny">(isVoice);
            return this;
        }
        
        this.allow = new StickFlagManager(isVoice, overwrites.allow.bitfield);
        this.deny  = new StickFlagManager(isVoice, overwrites.deny .bitfield);
        this.id = overwrites.id;
    }

    hasStick() {
        return this.allow.canCommunicate() && this.allow.fromBot();
    }

    giveStick(): boolean {
        if (this.hasStick()) return false;
        this.allow.addStick();
        this.deny.removeMute();
        return true;
    }

    takeStick(): boolean {
        if (!this.hasStick()) return false;
        this.allow.removeStick();
        this.deny.addMute();
        return true;
    }

    revert() {
        this.allow.revert();
        this.deny.revert();
    }

    toOverwriteData(id?: string): OverwriteData {
        const finalId = id || this.id;
        if (!finalId) throw new Error("OverwriteManager: Missing ID");

        return {
            id: finalId,
            type: this.type ?? OverwriteType.Member,
            allow: this.allow.getBitfield(),
            deny: this.deny.getBitfield()
        }
    }
}