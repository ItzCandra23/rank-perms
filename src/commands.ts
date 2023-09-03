import { PlayerCommandSelector } from "bdsx/bds/command";
import { command } from "bdsx/command";
import { CxxString } from "bdsx/nativetype";
import { commandPerm } from "./command";
import { send } from "./utils/message";
import { Permissions, RankPerms } from "..";
import { PlayerRank } from ".";

/**command: /myrank */
const myrank = commandPerm.register("myrank", "Check your rank.", "rank-perms.command.myrank");

myrank.overload((p, o) => {
    const player = o.getEntity();
    if (!player) {
        send.error(`You are console.`);
        return;
    }
    if (player.isPlayer()) {
        send.msg(`§aYour rank is §r${RankPerms.getDisplay(PlayerRank.getRank(player)) ?? PlayerRank.getRank(player)}`, player);
    }
}, {});

/**command: /rankadm */
const rankadm = commandPerm.register("rankadm", "Command rank-perms for admin.", "rank-perms.command.rankadm");

//  - create
rankadm.overload((p, o) => {
    const player = o.getEntity()?.getNetworkIdentifier().getActor() ?? undefined;

    RankPerms.createRank(p.rank)
    .then(() => {
        send.success(`Success to create §r${p.rank}§a rank`, player);
    })
    .catch((err) => {
        if (err) send.error(err, player);
    });
}, {
    create: command.enum("Rank_create", "create"),
    rank: CxxString,
});

rankadm.overload((p, o) => {
    const player = o.getEntity()?.getNetworkIdentifier().getActor() ?? undefined;

    RankPerms.createRank(p.rank, p.display)
    .then(() => {
        send.success(`Success to create §r${p.rank}§a rank`, player);
    })
    .catch((err) => {
        if (err) send.error(err, player);
    });
}, {
    create: command.enum("Rank_create", "create"),
    rank: CxxString,
    display: CxxString,
});

//  - delete
rankadm.overload((p, o) => {
    const player = o.getEntity()?.getNetworkIdentifier().getActor() ?? undefined;

    RankPerms.deleteRank(p.rank)
    .then(() => {
        send.success(`Success to delete §r${p.rank}§a rank`, player);
    })
    .catch((err) => {
        if (err) send.error(err, player);
    });
}, {
    delete: command.enum("Rank_delete", "delete"),
    rank: CxxString,
});

//  - permission
rankadm.overload((p, o) => {
    const actor = o.getEntity()?.getNetworkIdentifier().getActor() ?? undefined;

    if (p.edit === "add") {
        Permissions.addPermission(p.rank, p.perm)
        .then(() => {
            send.success(`Success to add §r${p.perm}§a to §r${p.rank}§a permissions`, actor);
        })
        .catch((err) => {
            if (err) send.error(err, actor);
        });
    }
    if (p.edit === "remove") {
        Permissions.removePermission(p.rank, p.perm)
        .then(() => {
            send.success(`Success to remove §r${p.perm}§a in §r${p.rank}§a permissions`, actor);
        })
        .catch((err) => {
            if (err) send.error(err, actor);
        });
    }
}, {
    rank: CxxString,
    edit: command.enum("Perm", "add", "remove"),
    perm: CxxString,
});

rankadm.overload((p, o) => {
    const actor = o.getEntity()?.getNetworkIdentifier().getActor() ?? undefined;

    Permissions.setPermission(p.rank, p.perm, p.newPerm)
    .then(() => {
        send.success(`Success to set §r${p.perm}§a to §r${p.newPerm}§a in §r${p.rank}§a permissions`, actor);
    })
    .catch((err) => {
        if (err) send.error(err, actor);
    });
}, {
    rank: CxxString,
    edit: command.enum("Perm_set", "set"),
    perm: CxxString,
    newPerm: CxxString,
});

//  - list
rankadm.overload((p, o) => {
    const actor = o.getEntity()?.getNetworkIdentifier().getActor() ?? undefined;
    send.msg(`§aRanks: §e${RankPerms.getRanks()}`, actor, [["[", ""], ["]", ""], [",", "§a, §e"]]);
}, {
    list: command.enum("Rank_list", "list"),
});

/**command: /setrank */
const setrank = commandPerm.register("setrank", "Change player rank.", "rank-perms.command.setrank");

setrank.overload((p, o) => {
    const actor = o.getEntity()?.getNetworkIdentifier().getActor() ?? undefined;
    for (const target of p.target.newResults(o)) {
        if (target.isPlayer()) {
            PlayerRank.setRank(target, p.rank)
            .then(() => {
                send.success(`Success to set §r${target.getName()}§a as §r${p.rank}`, actor);
            })
            .catch((err) => {
                if (err) send.error(err, actor);
            });
        }
    }
}, {
    target: PlayerCommandSelector,
    rank: CxxString,
});

/**command: /rankreload */
const rankreload = commandPerm.register("rankreload", "Reload all permission command.", "rank-perms.command.rankreload");

rankreload.overload((p, o) => {
    commandPerm.reload();
}, {});