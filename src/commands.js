"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("bdsx/bds/command");
const command_2 = require("bdsx/command");
const nativetype_1 = require("bdsx/nativetype");
const command_3 = require("./command");
const message_1 = require("./utils/message");
const __1 = require("..");
const _1 = require(".");
const myrank = command_3.commandPerm.register("myrank", "Check your rank.", "rank-perms.command.myrank");
myrank.overload((p, o) => {
    var _a;
    const player = o.getEntity();
    if (!player) {
        message_1.send.error(`You are console.`);
        return;
    }
    if (player.isPlayer()) {
        message_1.send.msg(`&aYour rank is &r${(_a = _1.Ranks.getDisplay(__1.Permissions.getRank(player))) !== null && _a !== void 0 ? _a : __1.Permissions.getRank(player)}`, player);
    }
}, {});
const rankadm = command_3.commandPerm.register("rankadm", "Command rank-perms for admin.", "rank-perms.command.rankadm", command_1.CommandPermissionLevel.Operator);
rankadm.overload((p, o) => {
    var _a;
    const actor = (_a = o.getEntity()) === null || _a === void 0 ? void 0 : _a.getNetworkIdentifier().getActor();
    if (actor === null)
        return;
    __1.RankPerms.createRank(p.rank, undefined, actor);
}, {
    create: command_2.command.enum("Rank_create", "create"),
    rank: nativetype_1.CxxString,
});
rankadm.overload((p, o) => {
    var _a;
    const actor = (_a = o.getEntity()) === null || _a === void 0 ? void 0 : _a.getNetworkIdentifier().getActor();
    if (actor === null)
        return;
    __1.RankPerms.createRank(p.rank, p.display, actor);
}, {
    create: command_2.command.enum("Rank_create", "create"),
    rank: nativetype_1.CxxString,
    display: nativetype_1.CxxString,
});
rankadm.overload((p, o) => {
    var _a;
    const actor = (_a = o.getEntity()) === null || _a === void 0 ? void 0 : _a.getNetworkIdentifier().getActor();
    if (actor === null)
        return;
    __1.RankPerms.deleteRank(p.rank, actor);
}, {
    delete: command_2.command.enum("Rank_delete", "delete"),
    rank: nativetype_1.CxxString,
});
rankadm.overload((p, o) => {
    var _a;
    const actor = (_a = o.getEntity()) === null || _a === void 0 ? void 0 : _a.getNetworkIdentifier().getActor();
    if (actor === null)
        return;
    message_1.send.msg(`&aRanks: &e${__1.RankPerms.getRanks()}`.replace("[", "").replace("]", "").replace(/,/g, "&a, &e"), actor);
}, {
    list: command_2.command.enum("Rank_list", "list"),
});
const setrank = command_3.commandPerm.register("setrank", "Change player rank.", "rank-perms.command.setrank", command_1.CommandPermissionLevel.Operator);
setrank.overload((p, o) => {
    var _a;
    const actor = (_a = o.getEntity()) === null || _a === void 0 ? void 0 : _a.getNetworkIdentifier().getActor();
    if (actor === null)
        return;
    for (const target of p.target.newResults(o)) {
        if (target.isPlayer()) {
            __1.Permissions.setRank(p.rank, target, actor);
        }
    }
}, {
    target: command_1.PlayerCommandSelector,
    rank: nativetype_1.CxxString,
});
const rankreload = command_3.commandPerm.register("rankreload", "Reload all permission command.", "rank-perms.command.rankreload", command_1.CommandPermissionLevel.Operator);
rankreload.overload((p, o) => {
    command_3.commandPerm.reload();
}, {});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb21tYW5kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhDQUFpRjtBQUNqRiwwQ0FBdUM7QUFDdkMsZ0RBQTRDO0FBQzVDLHVDQUF3QztBQUN4Qyw2Q0FBdUM7QUFDdkMsMEJBQTRDO0FBQzVDLHdCQUEwQjtBQUUxQixNQUFNLE1BQU0sR0FBRyxxQkFBVyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsa0JBQWtCLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztBQUUvRixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFOztJQUNyQixNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDN0IsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNULGNBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUMvQixPQUFPO0tBQ1Y7SUFDRCxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRTtRQUNuQixjQUFJLENBQUMsR0FBRyxDQUFDLG9CQUFvQixNQUFBLFFBQUssQ0FBQyxVQUFVLENBQUMsZUFBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxtQ0FBSSxlQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDeEg7QUFDTCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFFUCxNQUFNLE9BQU8sR0FBRyxxQkFBVyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsK0JBQStCLEVBQUUsNEJBQTRCLEVBQUUsZ0NBQXNCLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFaEosT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTs7SUFDdEIsTUFBTSxLQUFLLEdBQUcsTUFBQSxDQUFDLENBQUMsU0FBUyxFQUFFLDBDQUFFLG9CQUFv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