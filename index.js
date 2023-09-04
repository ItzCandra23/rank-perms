"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permissions = exports.RankPerms = void 0;
const src_1 = require("./src");
const message_1 = require("./src/utils/message");
const event_1 = require("bdsx/event");
const command_1 = require("./src/command");
const path = require("path");
const fs = require("fs");
let ranks = {
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
try {
    ranks = require(rankPath);
}
catch (err) {
    if (err)
        message_1.send.error(err);
}
/**RankPermissions */
var RankPerms;
(function (RankPerms) {
    /**Create new rank */
    async function createRank(rank, display = rank) {
        return new Promise((resolve, reject) => {
            const textPattern = /^[A-Za-z0-9]+$/;
            if (hasRank(rank)) {
                reject(`Rank already!`);
                return;
            }
            if (!textPattern.test(rank) || rank === "") {
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
            };
            resolve();
        });
    }
    RankPerms.createRank = createRank;
    /**Delete rank */
    function deleteRank(rank) {
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
    RankPerms.deleteRank = deleteRank;
    /**Get rank */
    function getRank(rank) {
        var _a;
        return (_a = ranks[rank]) !== null && _a !== void 0 ? _a : null;
    }
    RankPerms.getRank = getRank;
    /**Get rank display */
    function getDisplay(rank) {
        var _a, _b;
        return (_b = (_a = getRank(rank)) === null || _a === void 0 ? void 0 : _a.display) !== null && _b !== void 0 ? _b : null;
    }
    RankPerms.getDisplay = getDisplay;
    /**Get all rank permissions */
    function getPermissions(rank) {
        return Permissions.getPermissions(rank);
    }
    RankPerms.getPermissions = getPermissions;
    /**Get rank permissions */
    function permissions(rank) {
        if (!hasRank(rank))
            return null;
        return new Permissions(rank);
    }
    RankPerms.permissions = permissions;
    /**Get player rank */
    function playerRank(player) {
        return src_1.PlayerRank.rank(player);
    }
    RankPerms.playerRank = playerRank;
    /**Check rank */
    function hasRank(rank) {
        return ranks.hasOwnProperty(rank);
    }
    RankPerms.hasRank = hasRank;
    /**Get all ranks */
    function getRanks() {
        return Object.keys(ranks);
    }
    RankPerms.getRanks = getRanks;
    /**Save */
    function save(message = false) {
        fs.writeFile(rankPath, JSON.stringify(ranks, null, 4), "utf8", (err) => {
            if (message) {
                if (err)
                    message_1.send.error(`ranks.json ${err}`);
                else
                    message_1.send.success(`ranks.json Saved!`);
            }
        });
    }
    RankPerms.save = save;
})(RankPerms = exports.RankPerms || (exports.RankPerms = {}));
/**Permissions */
class Permissions {
    constructor(rank) {
        this.rank = rank;
    }
    /**Check player permission */
    static check(perm, player) {
        const rank = src_1.PlayerRank.getRank(player);
        if (!rank)
            return Permissions.hasPermission(RankPerms.getRanks()[0], perm);
        return Permissions.hasPermission(rank, perm);
    }
    /**Register permission Command */
    static registerCommand(name, perm) {
        if (command_1.commandPerm.find(name))
            return false;
        else
            return command_1.commandPerm.setPermission(name, perm);
    }
    /**Check permission in rank */
    static hasPermission(rank, permission) {
        if (!RankPerms.hasRank(rank))
            return false;
        return ranks[rank].permissions.includes(permission);
    }
    /**Get all permissions in rank */
    static getPermissions(rank) {
        const data = RankPerms.getRank(rank);
        if (!data)
            return [];
        else
            return data.permissions;
    }
    /**Add permission */
    static async addPermission(rank, permission) {
        return new Promise((resolve, reject) => {
            const textPattern = /^[a-z.]+$/;
            const data = RankPerms.getRank(rank);
            if (!data) {
                reject(`Rank not found!`);
                return;
            }
            if (!textPattern.test(permission) || permission === "") {
                reject(`Invalid permission!`);
                return;
            }
            if (data.permissions.includes(rank)) {
                reject(`Permission already!`);
                return;
            }
            ;
            ranks[rank].permissions.push(permission);
            command_1.commandPerm.reload();
            resolve();
        });
    }
    /**Remove permission */
    static async removePermission(rank, permission) {
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
            ;
            ranks[rank].permissions = ranks[rank].permissions.filter((perm) => perm !== permission);
            command_1.commandPerm.reload();
            resolve();
        });
    }
    /**Set permission */
    static async setPermission(rank, permission, newPermission) {
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
            ranks[rank].permissions[data.permissions.indexOf(permission)] = newPermission;
            command_1.commandPerm.reload();
            resolve();
        });
    }
    /**Check permission in rank */
    hasPermission(permission) {
        return Permissions.hasPermission(this.rank, permission);
    }
    /**Get all permissions in rank */
    getPermissions() {
        return Permissions.getPermissions(this.rank);
    }
    /**Add permission */
    async addPermission(permission) {
        return Permissions.addPermission(this.rank, permission);
    }
    /**Remove permission */
    async removePermission(permission) {
        return Permissions.removePermission(this.rank, permission);
    }
    /**Set permission */
    async setPermission(permission, newPermission) {
        return Permissions.setPermission(this.rank, permission, newPermission);
    }
}
exports.Permissions = Permissions;
event_1.events.playerJoin.on((ev) => {
    src_1.PlayerRank.addPlayer(ev.player);
});
event_1.events.serverOpen.on(() => {
    require("./src");
    require("./src/commands");
    message_1.send.success("Started!");
});
event_1.events.serverClose.on(() => {
    RankPerms.save(true);
    src_1.PlayerRank.save(true);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrQkFBbUM7QUFDbkMsaURBQTJDO0FBQzNDLHNDQUFvQztBQUNwQywyQ0FBNEM7QUFDNUMsNkJBQTZCO0FBQzdCLHlCQUF5QjtBQU96QixJQUFJLEtBQUssR0FBeUI7SUFDOUIsS0FBSyxFQUFFO1FBQ0gsT0FBTyxFQUFFLFdBQVc7UUFDcEIsV0FBVyxFQUFFO1lBQ1QsMkJBQTJCO1NBQzlCO0tBQ0o7SUFDRCxLQUFLLEVBQUU7UUFDSCxPQUFPLEVBQUUsV0FBVztRQUNwQixXQUFXLEVBQUU7WUFDVCwyQkFBMkI7WUFDM0IsNEJBQTRCO1NBQy9CO0tBQ0o7SUFDRCxLQUFLLEVBQUU7UUFDSCxPQUFPLEVBQUUsV0FBVztRQUNwQixXQUFXLEVBQUU7WUFDVCwyQkFBMkI7WUFDM0IsNEJBQTRCO1lBQzVCLDRCQUE0QjtZQUM1QiwrQkFBK0I7U0FDbEM7S0FDSjtDQUNKLENBQUM7QUFFRixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUVwRCxJQUFJO0lBQUUsS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtDQUFFO0FBQUMsT0FBTSxHQUFHLEVBQUU7SUFDekMsSUFBSSxHQUFHO1FBQUUsY0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUM1QjtBQUVELHFCQUFxQjtBQUNyQixJQUFpQixTQUFTLENBeUZ6QjtBQXpGRCxXQUFpQixTQUFTO0lBRXRCLHFCQUFxQjtJQUNkLEtBQUssVUFBVSxVQUFVLENBQUMsSUFBWSxFQUFFLFVBQWtCLElBQUk7UUFDakUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNuQyxNQUFNLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQztZQUNyQyxJQUFJLE9BQU8s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