import { Player } from "bdsx/bds/player";
import { PlayerRank } from "./src";
import { send } from "./src/utils/message";
import { events } from "bdsx/event";
import { commandPerm } from "./src/command";
import * as path from "path";
import * as fs from "fs";

export interface Rank {
    display: string;
    permissions: string[];
}

let ranks: Record<string, Rank> = {
    Guest: {
        display: "§l§aGuest",
        permissions: [
            "rank-perms.command.myrank",
        ],
    },
    Admin: {
        display: "§l§cAdmin",
        permissions: [
            "rank-perms.command.myrank",
            "rank-perms.command.rankadm",
        ],
    },
    Owner: {
        display: "§l§dOwner",
        permissions: [
            "rank-perms.command.myrank",
            "rank-perms.command.rankadm",
            "rank-perms.command.setrank",
            "rank-perms.command.rankreload",
        ],
    },
};

const rankPath = path.join(__dirname, "ranks.json");

try { ranks = require(rankPath) } catch(err) {
    if (err) send.error(err);
}

/**RankPermissions */
export namespace RankPerms {

    /**Create new rank */
    export async function createRank(rank: string, display: string = rank): Promise<void> {
        return new Promise((resolve, reject) => {
            const textPattern = /^[A-Za-z0-9]+$/;
            if (hasRank(rank)) {
                reject(`Rank already!`);
                return;
            }
            if (!textPattern.test(rank)||rank === "") {
                reject(`Invalid rank!`);
                return;
            }
            if (rank.length > 16) {
                reject(`Rank rank too long`);
                return;
            }

            ranks[rank] = {
                display: display,
                permissions: [],
            }
            resolve();
        });
    }

    /**Delete rank */
    export function deleteRank(rank: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!hasRank(rank)) {
                reject(`Rank not found!`);
                return;
            }
            if (getRanks().length === 1) {
                reject(`You can't delete last rank`);
                return;
            }

            delete ranks[rank];
            resolve();
        });
    }

    /**Get rank */
    export function getRank(rank: string): Rank|null {
        return ranks[rank] ?? null;
    }

    /**Get rank display */
    export function getDisplay(rank: string): string|null {
        return getRank(rank)?.display ?? null;
    }

    /**Get all rank permissions */
    export function getPermissions(rank: string): string[] {
        return Permissions.getPermissions(rank);
    }

    /**Get rank permissions */
    export function permissions(rank: string): Permissions|null {
        if (!hasRank(rank)) return null;
        return new Permissions(rank);
    }

    /**Get player rank */
    export function playerRank(player: Player): PlayerRank {
        return PlayerRank.rank(player);
    }

    /**Check rank */
    export function hasRank(rank: string): boolean {
        return ranks.hasOwnProperty(rank);
    }

    /**Get all ranks */
    export function getRanks(): string[] {
        return Object.keys(ranks);
    }

    /**Save */
    export function save(message: boolean = false) {
        fs.writeFile(rankPath, JSON.stringify(ranks, null, 4), "utf8", (err) => {
            if (message) {
                if (err) send.error(`ranks.json ${err}`);
                else send.success(`ranks.json Saved!`);
            }
        });
    }
}

/**Permissions */
export class Permissions {
    constructor(private rank: string) {}

    /**Check player permission */
    static check(perm: string, player: Player): boolean {
        const rank = PlayerRank.getRank(player);
        if (!rank) return Permissions.hasPermission(RankPerms.getRanks()[0], perm);
        return Permissions.hasPermission(rank, perm);
    }

    /**Register permission Command */
    static registerCommand(name: string, perm: string): boolean {
        if (commandPerm.find(name)) return false;
        else return commandPerm.setPermission(name, perm);
    }

    /**Check permission in rank */
    static hasPermission(rank: string, permission: string): boolean {
        if (!RankPerms.hasRank(rank)) return false;
        return ranks[rank].permissions.includes(permission);
    }

    /**Get all permissions in rank */
    static getPermissions(rank: string): string[] {
        const data = RankPerms.getRank(rank);
        if (!data) return [];
        else return data.permissions;
    }

    /**Add permission */
    static async addPermission(rank: string, permission: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const textPattern = /^[a-z.]+$/;
            const data = RankPerms.getRank(rank);
            if (!data) {
                reject(`Rank not found!`);
                return;
            }
            if (!textPattern.test(permission)||permission === "") {
                reject(`Invalid permission!`);
                return;
            }
            if (data.permissions.includes(rank)) {
                reject(`Permission already!`);
                return;
            };

            ranks[rank].permissions.push(permission);
            commandPerm.reload();
            resolve();
        });
    }

    /**Remove permission */
    static async removePermission(rank: string, permission: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const data = RankPerms.getRank(rank);
            if (!data) {
                reject(`Rank not found!`);
                return;
            }
            if (!data.permissions.includes(permission)) {
                reject(`Permission not found!`);
                return;
            };

            ranks[rank].permissions=ranks[rank].permissions.filter((perm) => perm !== permission);
            commandPerm.reload();
            resolve();
        });
    }

    /**Set permission */
    static async setPermission(rank: string, permission: string, newPermission: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const data = RankPerms.getRank(rank);
            if (!data) {
                reject(`Rank not found!`);
                return;
            }
            if (!data.permissions.includes(permission)) {
                reject(`Permission not found!`);
                return;
            }
            if (data.permissions.includes(newPermission)) {
                reject(`New permission already!`);
                return;
            }

            ranks[rank].permissions[data.permissions.indexOf(permission)]=newPermission;
            commandPerm.reload();
            resolve();
        });
    }

    /**Check permission in rank */
    hasPermission(permission: string): boolean {
        return Permissions.hasPermission(this.rank, permission);
    }

    /**Get all permissions in rank */
    getPermissions(): string[] {
        return Permissions.getPermissions(this.rank);
    }

    /**Add permission */
    async addPermission(permission: string): Promise<void> {
        return Permissions.addPermission(this.rank, permission);
    }

    /**Remove permission */
    async removePermission(permission: string): Promise<void> {
        return Permissions.removePermission(this.rank, permission);
    }

    /**Set permission */
    async setPermission(permission: string, newPermission: string): Promise<void> {
        return Permissions.setPermission(this.rank, permission, newPermission);
    }
}

events.playerJoin.on((ev) => {
    PlayerRank.addPlayer(ev.player);
});

events.serverOpen.on(() => {
    require("./src");
    require("./src/commands");
    send.success("Started!");
});

events.serverClose.on(() => {
    RankPerms.save(true);
    PlayerRank.save(true);
});