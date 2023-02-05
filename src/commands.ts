import { CommandPermissionLevel, PlayerCommandSelector } from "bdsx/bds/command";
import { command } from "bdsx/command";
import { CxxString } from "bdsx/nativetype";
import { commandPerm } from "./command";
import { send } from "./utils/message";
import { Permissions, RankPerms } from "..";
import { Ranks } from ".";

const myrank = commandPerm.register("myrank", "Check your rank.", "rank-perms.command.myrank");

myrank.overload((p, o) => {
    const player = o.getEntity();
    if (!player) {
        send.error(`You are console.`);
        return;
    }
    if (player.isPlayer()) {
        send.msg(`&aYour rank is &r${Ranks.getDisplay(Permissions.getRank(player)) ?? Permissions.getRank(player)}`, player);
    }
}, {});

const rankadm = commandPerm.register("rankadm", "Command rank-perms for admin.", "rank-perms.command.rankadm", CommandPermissionLevel.Operator);

rankadm.overload((p, o) => {
    const actor = o.getEntity()?.getNetworkIdentifier().getActor();
    if (actor === null) return;
    RankPerms.createRank(p.rank, undefined, actor);
}, {
    create: command.enum("Rank_create", "create"),
    rank: CxxString,
});

rankadm.overload((p, o) => {
    const actor = o.getEntity()?.getNetworkIdentifier().getActor();
    if (actor === null) return;
    RankPerms.createRank(p.rank, p.display, actor);
}, {
    create: command.enum("Rank_create", "create"),
    rank: CxxString,
    display: CxxString,
});

rankadm.overload((p, o) => {
    const actor = o.getEntity()?.getNetworkIdentifier().getActor();
    if (actor === null) return;
    RankPerms.deleteRank(p.rank, actor);
}, {
    delete: command.enum("Rank_delete", "delete"),
    rank: CxxString,
});

rankadm.overload((p, o) => {
    const actor = o.getEntity()?.getNetworkIdentifier().getActor();
    if (actor === null) return;
    send.msg(`&aRanks: &e${RankPerms.getRanks()}`.replace("[", "").replace("]", "").replace(/,/g, "&a, &e"), actor);
}, {
    list: command.enum("Rank_list", "list"),
});

const setrank = commandPerm.register("setrank", "Change player rank.", "rank-perms.command.setrank", CommandPermissionLevel.Operator);

setrank.overload((p, o) => {
    const actor = o.getEntity()?.getNetworkIdentifier().getActor();
    if (actor === null) return;
    for (const target of p.target.newResults(o)) {
        if (target.isPlayer()) {
            Permissions.setRank(p.rank, target, actor);
        }
    }
}, {
    target: PlayerCommandSelector,
    rank: CxxString,
});

const rankreload = commandPerm.register("rankreload", "Reload all permission command.", "rank-perms.command.rankreload", CommandPermissionLevel.Operator);

rankreload.overload((p, o) => {
    const actor = o.getEntity()?.getNetworkIdentifier().getActor();
    if (actor === null) return;
    commandPerm.reload();
}, {});