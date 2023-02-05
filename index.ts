import { ServerPlayer } from "bdsx/bds/player";
import { send, sendMessage } from "./src/utils/message";
import { Permission, Ranks } from "./src";
import { PlayerRank } from "./src/player";
import { events } from "bdsx/event";
import { commandPerm } from "./src/command";

export namespace RankPerms {
    export function createRank(rank: string, display?: string, actor?: ServerPlayer): boolean {
        const send = new sendMessage(actor);
        if (Ranks.has(rank)) {
            send.error(`Rank already!`);
            return false;
        }
        if (rank === ""||rank.includes(" ")||rank.includes("§")||rank.includes("&")) {
            send.error(`Invalid rank.`);
            return false;
        }
        if (rank.length > 16) {
            send.error(`Rank rank too long.`);
            return false;
        }

        send.success(`Success to create ${rank} in ranks`);
        return Ranks.add(rank, display);
    }

    export function deleteRank(rank: string, actor?: ServerPlayer): boolean {
        const send = new sendMessage(actor);
        if (!Ranks.has(rank)) {
            send.error(`Rank not found!`);
            return false;
        }
        if (Ranks.getRanks().length === 1) {
            send.error(`You can't delete last rank`);
            return false;
        }

        send.success(`Success to delete ${rank} in ranks`);
        return Ranks.remove(rank);
    }

    export const permissions = Permissions;

    export function getRanks(): string[] {
        return Ranks.getRanks();
    }

    export function has(rank: string): boolean {
        return Ranks.has(rank);
    }
}

export namespace Permissions {
    export function check(perm: string, player: ServerPlayer): boolean {
        const rank = PlayerRank.getRank(player.getXuid());
        if (!rank) return Permission.has(Ranks.getRanks()[0], perm);
        return Permission.has(rank, perm);
    }

    export function registerCommand(name: string, perm: string): boolean {
        if (commandPerm.find(name)) return false;
        else return commandPerm.setPermission(name, perm);
    }

    export function setRank(rank: string, player: ServerPlayer, actor?: ServerPlayer): boolean {
        const xuid = player.getXuid();
        const send = new sendMessage(actor);
        if (xuid === ""||xuid.includes(" ")) {
            send.error(`Xuid not found!`);
            return false;
        }
        if (!Ranks.has(rank)) {
            send.error(`Rank not found!`);
            return false;
        }

        send.success(`Success to set ${player.getNameTag()} in ${rank} rank`);
        return PlayerRank.setRank(rank, xuid);
    }

    export function getRank(player: ServerPlayer): string {
        return PlayerRank.getRank(player.getXuid()) ?? Ranks.getRanks()[0];
    }

    export function addPermission(rank: string, permission: string, actor?: ServerPlayer): boolean {
        const send = new sendMessage(actor);
        if (!Ranks.has(rank)) {
            send.error(`Rank not found!`);
            return false;
        }
        if (Permission.has(rank, permission)) {
            send.error(`Permission already!`);
            return false;
        }
        if (permission === ""||permission.includes(" ")) {
            send.error(`Invalid permission.`);
            return false;
        }

        send.success(`Success to add ${permission}&r in ${rank} permissions`);
        return Permission.add(rank, permission);
    }

    export function removePermission(rank: string, permission: string, actor?: ServerPlayer): boolean {
        const send = new sendMessage(actor);
        if (!Ranks.has(rank)) {
            send.error(`Rank not found!`);
            return false;
        }
        if (!Permission.has(rank, permission)) {
            send.error(`Permission not found!`);
            return false;
        }

        send.success(`Success to remove ${permission}&r in ${rank} permissions`);
        return Permission.remove(rank, permission);
    }

    export function setPermission(rank: string, permission: string, newPermission: string, actor?: ServerPlayer): boolean {
        const send = new sendMessage(actor);
        if (!Ranks.has(rank)) {
            send.error(`Rank not found!`);
            return false;
        }
        if (!Permission.has(rank, permission)) {
            send.error(`Permission not found!`);
            return false;
        }
        if (Permission.has(rank, newPermission)) {
            send.error(`Permission already!`);
            return false;
        }

        send.success(`Success to change ${permission}&r to ${newPermission}&r in ${rank} permissions`);
        return Permission.set(rank, permission, newPermission);
    }

    export function has(rank: string, permission: string): boolean {
        return Permission.has(rank, permission);
    }

    export function getPermissions(rank: string): string[] {
        return Permission.getPermissions(rank);
    }
}

events.playerJoin.on((ev) => { PlayerRank.addPlayer(ev.player.getXuid()) });

events.serverOpen.on(() => {
    require("./src");
    require("./src/commands");
    send.success("Started!");
});

events.serverClose.on(() => {
    Ranks.save(true);
    PlayerRank.save(true);
});