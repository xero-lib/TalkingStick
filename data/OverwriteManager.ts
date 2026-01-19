import { OverwriteData, OverwriteType, PermissionFlagsBits, PermissionOverwrites, PermissionResolvable } from "discord.js";

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

    canTalk(this: StickFlagManager<"allow">): boolean {
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

    needsRevert(): boolean {
        return this.flags.has(this.REVERT_MAGIC);
    }

    revert() {
        if (this.needsRevert()) {
            this.flags.add(this.CommunicatePermission);
        } else {
            this.flags.remove(this.CommunicatePermission);
        }

        this.flags.remove(this.BOT_MAGIC | this.REVERT_MAGIC);
    }

    getBitfield(): bigint {
        return this.flags.getBitfield();
    }

    initListener(this: StickFlagManager<"allow">) {
        const wasAllowed = this.fromBot()
            ? this.flags.has(this.REVERT_MAGIC)
            : this.flags.has(this.CommunicatePermission)
        ;

        this.flags.remove(this.BOT_MAGIC);
        this.flags.remove(this.CommunicatePermission);
        
        if (wasAllowed) this.flags.add(this.REVERT_MAGIC)
    }

    isManaged(): boolean {
        return this.flags.has(this.BOT_MAGIC);
    }

    isActiveSession(): boolean {
        return this.flags.has(StickFlags.ACTIVE_MAGIC);
    }
}

export default class OverwriteManager {
    private allow: StickFlagManager<"allow">;
    private deny: StickFlagManager<"deny">;
    private id: string;
    private type: OverwriteType | undefined = undefined;

    static fromMember(id: string, isVoice: boolean) {
        return new OverwriteManager(
            isVoice,
            {
                id,
                type: OverwriteType.Member,
                allow: 0n,
                deny: 0n
            }
        )
    } 

    constructor(isVoice:boolean, data: (OverwriteData | PermissionOverwrites) & { id: string, type: OverwriteType }) {
        const resolveBits = (perm: PermissionResolvable | undefined): bigint => {
            if (!perm) return 0n;
            if (typeof perm === "bigint") return perm;
            if (typeof perm === "object" && "bitfield" in perm) return BigInt(perm.bitfield);
            return BigInt(perm as string | number);
        }

        this.id    = data.id as string;
        this.type  = data.type;
        this.deny  = new StickFlagManager<"deny">(isVoice, resolveBits(data.deny));
        this.allow = new StickFlagManager<"allow">(isVoice, resolveBits(data.allow));
    }

    hasStick() {
        // don't include canCommunicate since they might have been muted
        return this.allow.fromBot();
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

    toOverwriteData(): OverwriteData {
        return {
            id: this.id,
            type: this.type ?? OverwriteType.Member,
            allow: this.allow.getBitfield(),
            deny: this.deny.getBitfield()
        }
    }

    initListener() {
        this.allow.initListener();
        this.deny.addMute();
    }

    needsRevert(): boolean {
        return this.allow.needsRevert() || this.deny.needsRevert();
    }

    isEmpty(): boolean {
        return (this.allow.getBitfield() | this.deny.getBitfield()) === 0n;
    }

    isManaged(): boolean {
        return (this.allow.isManaged() || this.deny.isManaged());
    }

    isActiveSession(): boolean {
        return this.allow.isActiveSession();
    }
}