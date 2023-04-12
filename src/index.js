"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = exports.Ranks = void 0;
const message_1 = require("./utils/message");
const path = require("path");
const fs = require("fs");
require("./player");
require("./command");
let ranks = {
    Guest: {
        display: "&l&aGuest",
        permissions: [
            "rank-perms.command.myrank",
        ],
    },
    Admin: {
        display: "&l&cAdmin",
        permissions: [
            "rank-perms.command.myrank",
            "rank-perms.command.rankadm",
        ],
    },
    Owner: {
        display: "&l&dOwner",
        permissions: [
            "rank-perms.command.myrank",
            "rank-perms.command.rankadm",
            "rank-perms.command.setrank",
            "rank-perms.command.rankreload",
        ],
    },
};
const rankPath = path.join(__dirname, "..", "ranks.json");
try {
    ranks = require(rankPath);
}
catch (err) {
    if (err)
        fs.writeFileSync(rankPath, JSON.stringify(ranks), "utf8");
}
var Ranks;
(function (Ranks) {
    function add(name, display) {
        if (ranks.hasOwnProperty(name))
            return false;
        if (name === "" || name.includes(" "))
            return false;
        ranks[name] = {
            display: display !== null && display !== void 0 ? display : name,
            permissions: [],
        };
        return true;
    }
    Ranks.add = add;
    function remove(rank) {
        if (!ranks.hasOwnProperty(rank))
            return false;
        if (getRanks().length === 1)
            return false;
        delete ranks[rank];
        return true;
    }
    Ranks.remove = remove;
    function getRank(index) {
        if (getRanks().length - 1 < index || 0 > index)
            return "";
        else
            return getRanks()[index];
    }
    Ranks.getRank = getRank;
    function getRanks() {
        return Object.keys(ranks);
    }
    Ranks.getRanks = getRanks;
    function has(rank) {
        return ranks.hasOwnProperty(rank);
    }
    Ranks.has = has;
    function setDisplay(rank, display) {
        if (!ranks.hasOwnProperty(rank))
            return false;
        ranks[rank].display = display.replace(/&/g, "§");
        return true;
    }
    Ranks.setDisplay = setDisplay;
    function getDisplay(rank) {
        if (!ranks.hasOwnProperty(rank))
            return null;
        else
            return ranks[rank].display.replace(/&/g, "§");
    }
    Ranks.getDisplay = getDisplay;
    function save(message = false, actor) {
        const send = new message_1.sendMessage(actor);
        fs.writeFile(rankPath, JSON.stringify(ranks, null, 2), "utf8", (err) => {
            if (message) {
                if (err) {
                    send.error(`ranks.json ${err}`);
                    throw err;
                }
                else
                    send.success(`ranks.json Saved!`);
            }
        });
    }
    Ranks.save = save;
})(Ranks = exports.Ranks || (exports.Ranks = {}));
var Permission;
(function (Permission) {
    function add(rank, permission) {
        if (!ranks.hasOwnProperty(rank))
            return false;
        if (permission === "" || permission.includes(" "))
            return false;
        if (ranks[rank].permissions.includes(rank))
            return false;
        ranks[rank].permissions.push(permission);
        return true;
    }
    Permission.add = add;
    function remove(rank, permission) {
        if (!ranks.hasOwnProperty(rank))
            return false;
        if (!ranks[rank].permissions.includes(permission))
            return false;
        ranks[rank].permissions = ranks[rank].permissions.filter((perm) => perm !== permission);
        return true;
    }
    Permission.remove = remove;
    function set(rank, permission, newPermission) {
        if (!ranks.hasOwnProperty(rank))
            return false;
        if (!ranks[rank].permissions.includes(permission))
            return false;
        if (ranks[rank].permissions.includes(newPermission))
            return false;
        ranks[rank].permissions[ranks[rank].permissions.indexOf(permission)] = newPermission;
        return true;
    }
    Permission.set = set;
    function has(rank, permission) {
        if (!ranks.hasOwnProperty(rank))
            return false;
        return ranks[rank].permissions.includes(permission);
    }
    Permission.has = has;
    function getPermissions(rank) {
        if (!ranks.hasOwnProperty(rank))
            return [];
        else
            return ranks[rank].permissions;
    }
    Permission.getPermissions = getPermissions;
})(Permission = exports.Permission || (exports.Permission = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw2Q0FBOEM7QUFDOUMsNkJBQTZCO0FBQzdCLHlCQUF5QjtBQUN6QixvQkFBa0I7QUFDbEIscUJBQW1CO0FBT25CLElBQUksS0FBSyxHQUF5QjtJQUM5QixLQUFLLEVBQUU7UUFDSCxPQUFPLEVBQUUsV0FBVztRQUNwQixXQUFXLEVBQUU7WUFDVCwyQkFBMkI7U0FDOUI7S0FDSjtJQUNELEtBQUssRUFBRTtRQUNILE9BQU8sRUFBRSxXQUFXO1FBQ3BCLFdBQVcsRUFBRTtZQUNULDJCQUEyQjtZQUMzQiw0QkFBNEI7U0FDL0I7S0FDSjtJQUNELEtBQUssRUFBRTtRQUNILE9BQU8sRUFBRSxXQUFXO1FBQ3BCLFdBQVcsRUFBRTtZQUNULDJCQUEyQjtZQUMzQiw0QkFBNEI7WUFDNUIsNEJBQTRCO1lBQzVCLCtCQUErQjtTQUNsQztLQUNKO0NBQ0osQ0FBQztBQUVGLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztBQUUxRCxJQUFJO0lBQUUsS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtDQUFFO0FBQUMsT0FBTSxHQUFHLEVBQUU7SUFDekMsSUFBSSxHQUFHO1FBQUUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztDQUN0RTtBQUVELElBQWlCLEtBQUssQ0F5RHJCO0FBekRELFdBQWlCLEtBQUs7SUFDbEIsU0FBZ0IsR0FBRyxDQUFDLElBQVksRUFBRSxPQUFnQjtRQUM5QyxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFDN0MsSUFBSSxJQUFJLEtBQUssRUFBRSxJQUFFLElBQUks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