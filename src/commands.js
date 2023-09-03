"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("bdsx/bds/command");
const command_2 = require("bdsx/command");
const nativetype_1 = require("bdsx/nativetype");
const command_3 = require("./command");
const message_1 = require("./utils/message");
const __1 = require("..");
const _1 = require(".");
/**command: /myrank */
const myrank = command_3.commandPerm.register("myrank", "Check your rank.", "rank-perms.command.myrank");
myrank.overload((p, o) => {
    var _a;
    const player = o.getEntity();
    if (!player) {
        message_1.send.error(`You are console.`);
        return;
    }
    if (player.isPlayer()) {
        message_1.send.msg(`§aYour rank is §r${(_a = __1.RankPerms.getDisplay(_1.PlayerRank.getRank(player))) !== null && _a !== void 0 ? _a : _1.PlayerRank.getRank(player)}`, player);
    }
}, {});
/**command: /rankadm */
const rankadm = command_3.commandPerm.register("rankadm", "Command rank-perms for admin.", "rank-perms.command.rankadm");
//  - create
rankadm.overload((p, o) => {
    var _a, _b;
    const player = (_b = (_a = o.getEntity()) === null || _a === void 0 ? void 0 : _a.getNetworkIdentifier().getActor()) !== null && _b !== void 0 ? _b : undefined;
    __1.RankPerms.createRank(p.rank)
        .then(() => {
        message_1.send.success(`Success to create §r${p.rank}§a rank`, player);
    })
        .catch((err) => {
        if (err)
            message_1.send.error(err, player);
    });
}, {
    create: command_2.command.enum("Rank_create", "create"),
    rank: nativetype_1.CxxString,
});
rankadm.overload((p, o) => {
    var _a, _b;
    const player = (_b = (_a = o.getEntity()) === null || _a === void 0 ? void 0 : _a.getNetworkIdentifier().getActor()) !== null && _b !== void 0 ? _b : undefined;
    __1.RankPerms.createRank(p.rank, p.display)
        .then(() => {
        message_1.send.success(`Success to create §r${p.rank}§a rank`, player);
    })
        .catch((err) => {
        if (err)
            message_1.send.error(err, player);
    });
}, {
    create: command_2.command.enum("Rank_create", "create"),
    rank: nativetype_1.CxxString,
    display: nativetype_1.CxxString,
});
//  - delete
rankadm.overload((p, o) => {
    var _a, _b;
    const player = (_b = (_a = o.getEntity()) === null || _a === void 0 ? void 0 : _a.getNetworkIdentifier().getActor()) !== null && _b !== void 0 ? _b : undefined;
    __1.RankPerms.deleteRank(p.rank)
        .then(() => {
        message_1.send.success(`Success to delete §r${p.rank}§a rank`, player);
    })
        .catch((err) => {
        if (err)
            message_1.send.error(err, player);
    });
}, {
    delete: command_2.command.enum("Rank_delete", "delete"),
    rank: nativetype_1.CxxString,
});
//  - permission
rankadm.overload((p, o) => {
    var _a, _b;
    const actor = (_b = (_a = o.getEntity()) === null || _a === void 0 ? void 0 : _a.getNetworkIdentifier().getActor()) !== null && _b !== void 0 ? _b : undefined;
    if (p.edit === "add") {
        __1.Permissions.addPermission(p.rank, p.perm)
            .then(() => {
            message_1.send.success(`Success to add §r${p.perm}§a to §r${p.rank}§a permissions`, actor);
        })
            .catch((err) => {
            if (err)
                message_1.send.error(err, actor);
        });
    }
    if (p.edit === "remove") {
        __1.Permissions.removePermission(p.rank, p.perm)
            .then(() => {
            message_1.send.success(`Success to remove §r${p.perm}§a in §r${p.rank}§a permissions`, actor);
        })
            .catch((err) => {
            if (err)
                message_1.send.error(err, actor);
        });
    }
}, {
    rank: nativetype_1.CxxString,
    edit: command_2.command.enum("Perm", "add", "remove"),
    perm: nativetype_1.CxxString,
});
rankadm.overload((p, o) => {
    var _a, _b;
    const actor = (_b = (_a = o.getEntity()) === null || _a === void 0 ? void 0 : _a.getNetworkIdentifier().getActor()) !== null && _b !== void 0 ? _b : undefined;
    __1.Permissions.setPermission(p.rank, p.perm, p.newPerm)
        .then(() => {
        message_1.send.success(`Success to set §r${p.perm}§a to §r${p.newPerm}§a in §r${p.rank}§a permissions`, actor);
    })
        .catch((err) => {
        if (err)
            message_1.send.error(err, actor);
    });
}, {
    rank: nativetype_1.CxxString,
    edit: command_2.command.enum("Perm_set", "set"),
    perm: nativetype_1.CxxString,
    newPerm: nativetype_1.CxxString,
});
//  - list
rankadm.overload((p, o) => {
    var _a, _b;
    const actor = (_b = (_a = o.getEntity()) === null || _a === void 0 ? void 0 : _a.getNetworkIdentifier().getActor()) !== null && _b !== void 0 ? _b : undefined;
    message_1.send.msg(`§aRanks: §e${__1.RankPerms.getRanks()}`, actor, [["[", ""], ["]", ""], [",", "§a, §e"]]);
}, {
    list: command_2.command.enum("Rank_list", "list"),
});
/**command: /setrank */
const setrank = command_3.commandPerm.register("setrank", "Change player rank.", "rank-perms.command.setrank");
setrank.overload((p, o) => {
    var _a, _b;
    const actor = (_b = (_a = o.getEntity()) === null || _a === void 0 ? void 0 : _a.getNetworkIdentifier().getActor()) !== null && _b !== void 0 ? _b : undefined;
    for (const target of p.target.newResults(o)) {
        if (target.isPlayer()) {
            _1.PlayerRank.setRank(target, p.rank)
                .then(() => {
                message_1.send.success(`Success to set §r${target.getName()}§a as §r${p.rank}`, actor);
            })
                .catch((err) => {
                if (err)
                    message_1.send.error(err, actor);
            });
        }
    }
}, {
    target: command_1.PlayerCommandSelector,
    rank: nativetype_1.CxxString,
});
/**command: /rankreload */
const rankreload = command_3.commandPerm.register("rankreload", "Reload all permission command.", "rank-perms.command.rankreload");
rankreload.overload((p, o) => {
    command_3.commandPerm.reload();
}, {});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb21tYW5kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhDQUF5RDtBQUN6RCwwQ0FBdUM7QUFDdkMsZ0RBQTRDO0FBQzVDLHVDQUF3QztBQUN4Qyw2Q0FBdUM7QUFDdkMsMEJBQTRDO0FBQzVDLHdCQUErQjtBQUUvQixzQkFBc0I7QUFDdEIsTUFBTSxNQUFNLEdBQUcscUJBQVcsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLGtCQUFrQixFQUFFLDJCQUEyQixDQUFDLENBQUM7QUFFL0YsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTs7SUFDckIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzdCLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDVCxjQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDL0IsT0FBTztLQUNWO0lBQ0QsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUU7UUFDbkIsY0FBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsTUFBQSxhQUFTLENBQUMsVUFBVSxDQUFDLGFBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsbUNBQUksYUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQzFIO0FBQ0wsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBRVAsdUJBQXVCO0FBQ3ZCLE1BQU0sT0FBTyxHQUFHLHFCQUFXLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSwrQkFBK0IsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO0FBRS9HLFlBQVk7QUFDWixPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFOztJQUN0QixNQUFNLE1BQU0sR0FBRyxNQUFBLE1BQUEsQ0FBQyxDQUFDLFNB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