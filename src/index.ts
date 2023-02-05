import { ServerPlayer } from "bdsx/bds/player";
import { sendMessage } from "./utils/message";
import * as path from "path";
import * as fs from "fs";
import "./player";
import "./command";

export interface Rank {
    display: string;
    permissions: string[];
}

let ranks: Record<string, Rank> = {
    Guest: {
        display: "&l&aGuest",
        permissions: [
            "rank-perms.command.myrank",
        ],
    },
    Admin: {
        display: "&l&cAdmin",
        permissions: [
            "rank-perms.command.myrank",
            "rank-perms.command.rankadm",
        ],
    },
    Owner: {
        display: "&l&dOwner",
        permissions: [
            "rank-perms.command.myrank",
            "rank-perms.command.rankadm",
            "rank-perms.command.setrank",
            "rank-perms.command.rankreload",
        ],
    },
};

const rankPath = path.join(__dirname, "..", "ranks.json");

try { ranks = require(rankPath) } catch(err) {
    if (err) fs.writeFileSync(rankPath, JSON.stringify(ranks), "utf8");
}

export namespace Ranks {
    export function add(name: string, display?: string): boolean {
        if (ranks.hasOwnProperty(name)) return false;
        if (name === ""||name.includes(" ")) return false;

        ranks[name] = {
            display: display ?? name,
            permissions: [],
        };
        return true;
    }

    export function remove(rank: string): boolean {
        if (!ranks.hasOwnProperty(rank)) return false;
        if (getRanks().length === 1) return false;

        delete ranks[rank];
        return true;
    }

    export function getRank(index: number): string {
        if (getRanks().length-1 < index||0 > index) return "";
        else return getRanks()[index];
    }

    export function getRanks(): string[] {
        return Object.keys(ranks);
    }

    export function has(rank: string): boolean {
        return ranks.hasOwnProperty(rank);
    }

    export function setDisplay(rank: string, display: string): boolean {
        if (!ranks.hasOwnProperty(rank)) return false;

        ranks[rank].display=display.replace(/&/g, "§");
        return true;
    }

    export function getDisplay(rank: string): string|null {
        if (!ranks.hasOwnProperty(rank)) return null;
        else return ranks[rank].display.replace(/&/g, "§");
    }

    export function save(message: boolean = false, actor?: ServerPlayer): void {
        const send = new sendMessage(actor);
        fs.writeFile(rankPath, JSON.stringify(ranks, null, 2), "utf8", (err) => {
            if (message) {
                if (err) {
                    send.error(`ranks.json ${err}`);
                    throw err;
                }
                else send.success(`ranks.json Saved!`);
            }
        });
    }
}

export namespace Permission {
    export function add(rank: string, permission: string): boolean {
        if (!ranks.hasOwnProperty(rank)) return false;
        if (permission === ""||permission.includes(" ")) return false;
        if (ranks[rank].permissions.includes(rank)) return false;

        ranks[rank].permissions.push(permission);
        return true;
    }

    export function remove(rank: string, permission: string): boolean {
        if (!ranks.hasOwnProperty(rank)) return false;
        if (!ranks[rank].permissions.includes(permission)) return false;

        ranks[rank].permissions=ranks[rank].permissions.filter((perm) => perm !== permission);
        return true;
    }

    export function set(rank: string, permission: string, newPermission: string): boolean {
        if (!ranks.hasOwnProperty(rank)) return false;
        if (!ranks[rank].permissions.includes(permission)) return false;
        if (ranks[rank].permissions.includes(newPermission)) return false;

        ranks[rank].permissions[ranks[rank].permissions.indexOf(permission)]=newPermission;
        return true;
    }

    export function has(rank: string, permission: string): boolean {
        if (!ranks.hasOwnProperty(rank)) return false;
        return ranks[rank].permissions.includes(permission);
    }

    export function getPermissions(rank: string): string[] {
        if (!ranks.hasOwnProperty(rank)) return [];
        else return ranks[rank].permissions;
    }
}