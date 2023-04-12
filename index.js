"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permissions = exports.RankPerms = void 0;
const message_1 = require("./src/utils/message");
const src_1 = require("./src");
const player_1 = require("./src/player");
const event_1 = require("bdsx/event");
const command_1 = require("./src/command");
var RankPerms;
(function (RankPerms) {
    function createRank(rank, display, actor) {
        const send = new message_1.sendMessage(actor);
        if (src_1.Ranks.has(rank)) {
            send.error(`Rank already!`);
            return false;
        }
        if (rank === "" || rank.includes(" ") || rank.includes("§") || rank.includes("&")) {
            send.error(`Invalid rank.`);
            return false;
        }
        if (rank.length > 16) {
            send.error(`Rank rank too long.`);
            return false;
        }
        send.success(`Success to create ${rank} in ranks`);
        return src_1.Ranks.add(rank, display);
    }
    RankPerms.createRank = createRank;
    function deleteRank(rank, actor) {
        const send = new message_1.sendMessage(actor);
        if (!src_1.Ranks.has(rank)) {
            send.error(`Rank not found!`);
            return false;
        }
        if (src_1.Ranks.getRanks().length === 1) {
            send.error(`You can't delete last rank`);
            return false;
        }
        send.success(`Success to delete ${rank} in ranks`);
        return src_1.Ranks.remove(rank);
    }
    RankPerms.deleteRank = deleteRank;
    RankPerms.permissions = Permissions;
    function getRanks() {
        return src_1.Ranks.getRanks();
    }
    RankPerms.getRanks = getRanks;
    function has(rank) {
        return src_1.Ranks.has(rank);
    }
    RankPerms.has = has;
})(RankPerms = exports.RankPerms || (exports.RankPerms = {}));
var Permissions;
(function (Permissions) {
    function check(perm, player) {
        const rank = player_1.PlayerRank.getRank(player.getXuid());
        if (!rank)
            return src_1.Permission.has(src_1.Ranks.getRanks()[0], perm);
        return src_1.Permission.has(rank, perm);
    }
    Permissions.check = check;
    function registerCommand(name, perm) {
        if (command_1.commandPerm.find(name))
            return false;
        else
            return command_1.commandPerm.setPermission(name, perm);
    }
    Permissions.registerCommand = registerCommand;
    function setRank(rank, player, actor) {
        const xuid = player.getXuid();
        const send = new message_1.sendMessage(actor);
        if (xuid === "" || xuid.includes(" ")) {
            send.error(`Xuid not found!`);
            return false;
        }
        if (!src_1.Ranks.has(rank)) {
            send.error(`Rank not found!`);
            return false;
        }
        send.success(`Success to set ${player.getNameTag()} in ${rank} rank`);
        return player_1.PlayerRank.setRank(rank, xuid);
    }
    Permissions.setRank = setRank;
    function getRank(player) {
        var _a;
        return (_a = player_1.PlayerRank.getRank(player.getXuid())) !== null && _a !== void 0 ? _a : src_1.Ranks.getRanks()[0];
    }
    Permissions.getRank = getRank;
    function addPermission(rank, permission, actor) {
        const send = new message_1.sendMessage(actor);
        if (!src_1.Ranks.has(rank)) {
            send.error(`Rank not found!`);
            return false;
        }
        if (src_1.Permission.has(rank, permission)) {
            send.error(`Permission already!`);
            return false;
        }
        if (permission === "" || permission.includes(" ")) {
            send.error(`Invalid permission.`);
            return false;
        }
        send.success(`Success to add ${permission}&r in ${rank} permissions`);
        return src_1.Permission.add(rank, permission);
    }
    Permissions.addPermission = addPermission;
    function removePermission(rank, permission, actor) {
        const send = new message_1.sendMessage(actor);
        if (!src_1.Ranks.has(rank)) {
            send.error(`Rank not found!`);
            return false;
        }
        if (!src_1.Permission.has(rank, permission)) {
            send.error(`Permission not found!`);
            return false;
        }
        send.success(`Success to remove ${permission}&r in ${rank} permissions`);
        return src_1.Permission.remove(rank, permission);
    }
    Permissions.removePermission = removePermission;
    function setPermission(rank, permission, newPermission, actor) {
        const send = new message_1.sendMessage(actor);
        if (!src_1.Ranks.has(rank)) {
            send.error(`Rank not found!`);
            return false;
        }
        if (!src_1.Permission.has(rank, permission)) {
            send.error(`Permission not found!`);
            return false;
        }
        if (src_1.Permission.has(rank, newPermission)) {
            send.error(`Permission already!`);
            return false;
        }
        send.success(`Success to change ${permission}&r to ${newPermission}&r in ${rank} permissions`);
        return src_1.Permission.set(rank, permission, newPermission);
    }
    Permissions.setPermission = setPermission;
    function has(rank, permission) {
        return src_1.Permission.has(rank, permission);
    }
    Permissions.has = has;
    function getPermissions(rank) {
        return src_1.Permission.getPermissions(rank);
    }
    Permissions.getPermissions = getPermissions;
})(Permissions = exports.Permissions || (exports.Permissions = {}));
event_1.events.playerJoin.on((ev) => { player_1.PlayerRank.addPlayer(ev.player.getXuid()); });
event_1.events.serverOpen.on(() => {
    require("./src");
    require("./src/commands");
    message_1.send.success("Started!");
});
event_1.events.serverClose.on(() => {
    src_1.Ranks.save(true);
    player_1.PlayerRank.save(true);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpREFBd0Q7QUFDeEQsK0JBQTBDO0FBQzFDLHlDQUEwQztBQUMxQyxzQ0FBb0M7QUFDcEMsMkNBQTRDO0FBRTVDLElBQWlCLFNBQVMsQ0E0Q3pCO0FBNUNELFdBQWlCLFNBQVM7SUFDdEIsU0FBZ0IsVUFBVSxDQUFDLElBQVksRUFBRSxPQUFnQixFQUFFLEtBQW9CO1FBQzNFLE1BQU0sSUFBSSxHQUFHLElBQUkscUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQyxJQUFJLFdBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM1QixPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELElBQUksSUFBSSxLQUFLLEVBQUUsSUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN6RSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzVCLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRTtZQUNsQixJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDbEMsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixJQUFJLFdBQVcsQ0FBQyxDQUFDO1FBQ25ELE9BQU8sV0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQWpCZSxvQkFBVSxhQWlCekIsQ0FBQTtJQUVELFNBQWdCLFVBQVUsQ0FBQyxJQUFZLEVB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