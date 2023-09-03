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
            if (textPattern.test(rank) || rank === "") {
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
            if (textPattern.test(permission) || permission === "") {
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