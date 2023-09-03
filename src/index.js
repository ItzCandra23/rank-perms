"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerRank = void 0;
const __1 = require("..");
const message_1 = require("./utils/message");
const command_1 = require("./command");
const path = require("path");
const fs = require("fs");
let players = {};
const playerRankPath = path.join(__dirname, "..", "players.json");
try {
    players = require(playerRankPath);
}
catch (err) {
    if (err)
        fs.writeFileSync(playerRankPath, JSON.stringify(players), "utf8");
}
/**PlayerRank */
class PlayerRank {
    constructor(xuid) {
        this.xuid = xuid;
    }
    static rank(player) {
        return new PlayerRank(player.getXuid());
    }
    static rankByXuid(xuid) {
        return new PlayerRank(xuid);
    }
    static has(xuid) {
        return players.hasOwnProperty(xuid);
    }
    /**Add player */
    static addPlayer(player) {
        if (player.getXuid() === "")
            return false;
        if (this.has(player.getXuid()))
            return false;
        players[player.getXuid()] = __1.RankPerms.getRanks()[0];
        return true;
    }
    /**Set player rank */
    static async setRank(player, rank) {
        return new Promise((resolve, reject) => {
            if (player.getXuid() === "") {
                reject(`Xuid not found!`);
                return;
            }
            if (!__1.RankPerms.hasRank(rank)) {
                reject(`Rank not found!`);
                return;
            }
            players[player.getXuid()] = rank;
            command_1.commandPerm.reload();
            resolve();
        });
    }
    /**Get player rank */
    static getRank(player) {
        if (player.getXuid() === "")
            return __1.RankPerms.getRanks()[0];
        if (!this.has(player.getXuid()))
            this.addPlayer(player);
        if (!__1.RankPerms.hasRank(players[player.getXuid()])) {
            players[player.getXuid()] = __1.RankPerms.getRanks()[0];
            command_1.commandPerm.reload();
        }
        return players[player.getXuid()];
    }
    /**Set player rank */
    async setRank(rank) {
        return new Promise((resolve, reject) => {
            if (!PlayerRank.has(this.xuid)) {
                reject(`Xuid not found!`);
                return;
            }
            if (!__1.RankPerms.hasRank(rank)) {
                reject(`Rank not found!`);
                return;
            }
            players[this.xuid] = rank;
            command_1.commandPerm.reload();
            resolve();
        });
    }
    /**Get player rank */
    getRank() {
        if (!PlayerRank.has(this.xuid))
            return __1.RankPerms.getRanks()[0];
        if (!__1.RankPerms.hasRank(players[this.xuid])) {
            players[this.xuid] = __1.RankPerms.getRanks()[0];
            command_1.commandPerm.reload();
        }
        return players[this.xuid];
    }
    /**Save */
    static save(message = false) {
        fs.writeFile(playerRankPath, JSON.stringify(players, null, 4), "utf8", (err) => {
            if (message) {
                if (err)
                    message_1.send.error(`players.json ${err}`);
                else
                    message_1.send.success(`players.json Saved!`);
            }
        });
    }
}
exports.PlayerRank = PlayerRank;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwwQkFBK0I7QUFDL0IsNkNBQXVDO0FBQ3ZDLHVDQUF3QztBQUN4Qyw2QkFBNkI7QUFDN0IseUJBQXlCO0FBRXpCLElBQUksT0FBTyxHQUEyQixFQUFFLENBQUM7QUFDekMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBRWxFLElBQUk7SUFBRSxPQUFPLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0NBQUU7QUFBQyxPQUFNLEdBQUcsRUFBRTtJQUNqRCxJQUFJLEdBQUc7UUFBRSxFQUFFLENBQUMsYUFBYSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0NBQzlFO0FBRUQsZ0JBQWdCO0FBQ2hCLE1BQWEsVUFBVTtJQUNuQixZQUFvQixJQUFZO1FBQVosU0FBSSxHQUFKLElBQUksQ0FBUTtJQUFHLENBQUM7SUFFcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFjO1FBQ3RCLE9BQU8sSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBWTtRQUMxQixPQUFPLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDLElBQVk7UUFDbkIsT0FBTyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFjO1FBQzNCLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUU7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUMxQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFFN0MsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFDLGFBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQscUJBQXFCO0lBQ3JCLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQWMsRUFBRSxJQUFZO1FBQzdDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDbkMsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUN6QixNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDMUIsT0FBTzthQUNWO1lBQ0QsSUFBSSxDQUFDLGFBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzFCLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUMxQixPQUFPO2FBQ1Y7WUFFRCxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDO1lBQy9CLHFCQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7WUFFckIsT0FBTyxFQUFFLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxxQkFBcUI7SUFDckIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFjO1FBQ3pCLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUU7WUFBRSxPQUFPLGFBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7WUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXhELElBQUksQ0FBQyxhQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFO1lBQy9DLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBQyxhQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEQscUJBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUN4QjtRQUVELE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxxQkFBcUI7SUFDckIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFZO1FBQ3RCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDbkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM1QixNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDMUIsT0FBTzthQUNWO1lBQ0QsSUFBSSxDQUFDLGFBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzFCLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUMxQixPQUFPO2FBQ1Y7WUFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFDLElBQUksQ0FBQztZQUN4QixxQkFBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBRXJCLE9BQU8sRUFBRSxDQUFBO1FBQ2IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQscUJBQXFCO0lBQ3JCLE9BQU87UUFDSCxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQUUsT0FBTyxhQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLGFBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO1lBQ3hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUMsYUFBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNDLHFCQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDeEI7UUFFRCxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELFVBQVU7SUFDVixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQW1CLEtBQUs7UUFDaEMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQzNFLElBQUksT0FBTyxFQUFFO2dCQUNULElBQUksR0FBRztvQkFBRSxjQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxDQUFDOztvQkFDdEMsY0FBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2FBQzVDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUEvRkQsZ0NBK0ZDIn0=