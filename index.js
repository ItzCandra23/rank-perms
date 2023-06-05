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
    function setPlayerRank(player, rank) {
        return player_1.PlayerRank.setRank(rank, player.getXuid());
    }
    RankPerms.setPlayerRank = setPlayerRank;
    function getPlayerRank(player) {
        return player_1.PlayerRank.getRank(player.getXuid());
    }
    RankPerms.getPlayerRank = getPlayerRank;
    function setDisplayRank(rank, display) {
        return src_1.Ranks.setDisplay(rank, display);
    }
    RankPerms.setDisplayRank = setDisplayRank;
    function getDisplayRank(rank) {
        return src_1.Ranks.getDisplay(rank);
    }
    RankPerms.getDisplayRank = getDisplayRank;
    function save(message = false) {
        src_1.Ranks.save(message);
        player_1.PlayerRank.save(message);
    }
    RankPerms.save = save;
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
event_1.events.playerJoin.on((ev) => {
    player_1.PlayerRank.addPlayer(ev.player.getXuid());
});
event_1.events.serverOpen.on(() => {
    require("./src");
    require("./src/commands");
    message_1.send.success("Started!");
});
event_1.events.serverClose.on(() => {
    RankPerms.save(true);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpREFBd0Q7QUFDeEQsK0JBQTBDO0FBQzFDLHlDQUEwQztBQUMxQyxzQ0FBb0M7QUFDcEMsMkNBQTRDO0FBRTVDLElBQWlCLFNBQVMsQ0FpRXpCO0FBakVELFdBQWlCLFNBQVM7SUFDdEIsU0FBZ0IsVUFBVSxDQUFDLElBQVksRUFBRSxPQUFnQixFQUFFLEtBQWM7UUFDckUsTUFBTSxJQUFJLEdBQUcsSUFBSSxxQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLElBQUksV0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzVCLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxJQUFJLEtBQUssRUFBRSxJQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3pFLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDNUIsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFDRCxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUNsQyxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLElBQUksV0FBVyxDQUFDLENBQUM7UUFDbkQsT0FBTyxXQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBakJlLG9CQUFVLGFBaUJ6QixDQUFBO0lBRUQsU0FBZ0IsVUFBVSxDQUFDLElBQVksRUFBRSxLQUFjO1FBQ25ELE1BQU0sSUFBSSxHQUFHLElBQUkscUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsV0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNsQixJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDOUIsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFDRCxJQUFJLFdBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUN6QyxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLElBQUksV0FBVyxDQUFDLENBQUM7UUFDbkQsT0FBTyxXQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFiZSxvQkFBVSxhQWF6QixDQUFBO0lBRVkscUJBQVcsR0FBRyxXQUFXLENBQUM7SUFFdkMsU0FBZ0IsUUFBUTtRQUNwQixPQUFPLFdBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRmUsa0JBQVEsV0FFdkIsQ0FBQTtJQUVELFNBQWdCLEdBQUcsQ0FBQyxJQUFZO1FBQzVCLE9BQU8sV0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRmUsYUFBRyxNQUVsQixDQUFBO0lBRUQsU0FBZ0IsYUFBYSxDQUFDLE1BQWMsRUFBRSxJQUFZO1FBQ3RELE9BQU8sbUJBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFGZSx1QkFBYSxnQkFFNUIsQ0FBQTtJQUVELFNBQWdCLGFBQWEsQ0FBQyxNQUFjO1FBQ3hDLE9BQU8sbUJBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUZlLHVCQUFhLGdCQUU1QixDQUFBO0lBRUQsU0FBZ0IsY0FBYyxDQUFDLElBQVksRUFBRSxPQUFlO1FBQ3hELE9BQU8sV0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUZlLHdCQUFjLGlCQUU3QixDQUFBO0lBRUQsU0FBZ0IsY0FBYyxDQUFDLElBQVk7UUFDdkMsT0FBTyxXQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFGZSx3QkFBYyxpQkFFN0IsQ0FBQTtJQUVELFNBQWdCLElBQUksQ0FBQyxVQUFtQixLQUFLO1FBQ3pDLFdBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEIsbUJBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUhlLGNBQUksT0FHbkIsQ0FBQTtBQUNMLENBQUMsRUFqRWdCLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBaUV6QjtBQUVELElBQWlCLFdBQVcsQ0E0RjNCO0FBNUZELFdBQWlCLFdBQVc7SUFDeEIsU0FBZ0IsS0FBSyxDQUFDLElBQVksRUFBRSxNQUFjO1FBQzlDLE1BQU0sSUFBSSxHQUFHLG1CQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxJQUFJO1lBQUUsT0FBTyxnQkFBVSxDQUFDLEdBQUcsQ0FBQyxXQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUQsT0FBTyxnQkFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUplLGlCQUFLLFFBSXBCLENBQUE7SUFFRCxTQUFnQixlQUFlLENBQUMsSUFBWSxFQUFFLElBQVk7UUFDdEQsSUFBSSxxQkFBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFBRSxPQUFPLEtBQUssQ0FBQzs7WUFDcEMsT0FBTyxxQkFBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUhlLDJCQUFlLGtCQUc5QixDQUFBO0lBRUQsU0FBZ0IsT0FBTyxDQUFDLElBQVksRUFBRSxNQUFjLEVBQUUsS0FBYztRQUNoRSxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDOUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxxQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLElBQUksSUFBSSxLQUFLLEVBQUUsSUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUM5QixPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELElBQUksQ0FBQyxXQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUM5QixPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLE1BQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDO1FBQ3RFLE9BQU8sbUJBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFkZSxtQkFBTyxVQWN0QixDQUFBO0lBRUQsU0FBZ0IsT0FBTyxDQUFDLE1BQWM7O1FBQ2xDLE9BQU8sTUFBQSxtQkFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsbUNBQUksV0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFGZSxtQkFBTyxVQUV0QixDQUFBO0lBRUQsU0FBZ0IsYUFBYSxDQUFDLElBQVksRUFBRSxVQUFrQixFQUFFLEtBQWM7UUFDMUUsTUFBTSxJQUFJLEdBQUcsSUFBSSxxQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxXQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUM5QixPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELElBQUksZ0JBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUNsQyxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELElBQUksVUFBVSxLQUFLLEVBQUUsSUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzdDLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUNsQyxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLFVBQVUsU0FBUyxJQUFJLGNBQWMsQ0FBQyxDQUFDO1FBQ3RFLE9BQU8sZ0JBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFqQmUseUJBQWEsZ0JBaUI1QixDQUFBO0lBRUQsU0FBZ0IsZ0JBQWdCLENBQUMsSUFBWSxFQUFFLFVBQWtCLEVBQUUsS0FBYztRQUM3RSxNQUFNLElBQUksR0FBRyxJQUFJLHFCQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLFdBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQzlCLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxDQUFDLGdCQUFVLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsRUFBRTtZQUNuQyxJQUFJLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDcEMsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixVQUFVLFNBQVMsSUFBSSxjQUFjLENBQUMsQ0FBQztRQUN6RSxPQUFPLGdCQUFVLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBYmUsNEJBQWdCLG1CQWEvQixDQUFBO0lBRUQsU0FBZ0IsYUFBYSxDQUFDLElBQVksRUFBRSxVQUFrQixFQUFFLGFBQXFCLEVBQUUsS0FBYztRQUNqRyxNQUFNLElBQUksR0FBRyxJQUFJLHFCQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLFdBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQzlCLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxDQUFDLGdCQUFVLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsRUFBRTtZQUNuQyxJQUFJLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDcEMsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFDRCxJQUFJLGdCQUFVLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsRUFBRTtZQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDbEMsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixVQUFVLFNBQVMsYUFBYSxTQUFTLElBQUksY0FBYyxDQUFDLENBQUM7UUFDL0YsT0FBTyxnQkFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFqQmUseUJBQWEsZ0JBaUI1QixDQUFBO0lBRUQsU0FBZ0IsR0FBRyxDQUFDLElBQVksRUFBRSxVQUFrQjtRQUNoRCxPQUFPLGdCQUFVLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRmUsZUFBRyxNQUVsQixDQUFBO0lBRUQsU0FBZ0IsY0FBYyxDQUFDLElBQVk7UUFDdkMsT0FBTyxnQkFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRmUsMEJBQWMsaUJBRTdCLENBQUE7QUFDTCxDQUFDLEVBNUZnQixXQUFXLEdBQVgsbUJBQVcsS0FBWCxtQkFBVyxRQTRGM0I7QUFFRCxjQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3hCLG1CQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUM5QyxDQUFDLENBQUMsQ0FBQztBQUVILGNBQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRTtJQUN0QixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakIsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDMUIsY0FBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM3QixDQUFDLENBQUMsQ0FBQztBQUVILGNBQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRTtJQUN2QixTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLENBQUMsQ0FBQyxDQUFDIn0=