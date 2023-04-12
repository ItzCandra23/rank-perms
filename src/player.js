"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerRank = void 0;
const message_1 = require("./utils/message");
const _1 = require(".");
const path = require("path");
const fs = require("fs");
const command_1 = require("./command");
let playerRank = {};
const playerRankPath = path.join(__dirname, "..", "players.json");
try {
    playerRank = require(playerRankPath);
}
catch (err) {
    if (err)
        fs.writeFileSync(playerRankPath, JSON.stringify(playerRank), "utf8");
}
var PlayerRank;
(function (PlayerRank) {
    function addPlayer(xuid) {
        if (xuid === "" || xuid.includes(" "))
            return false;
        if (playerRank.hasOwnProperty(xuid))
            return false;
        playerRank[xuid] = _1.Ranks.getRanks()[0];
        return true;
    }
    PlayerRank.addPlayer = addPlayer;
    function setRank(rank, xuid) {
        if (xuid === "" || xuid.includes(" "))
            return false;
        if (!_1.Ranks.has(rank))
            return false;
        playerRank[xuid] = rank;
        command_1.commandPerm.reload();
        return true;
    }
    PlayerRank.setRank = setRank;
    function getRank(xuid) {
        if (xuid === "" || xuid.includes(" "))
            return null;
        if (!playerRank.hasOwnProperty(xuid))
            addPlayer(xuid);
        if (!_1.Ranks.has(playerRank[xuid]))
            playerRank[xuid] = _1.Ranks.getRanks()[0];
        return playerRank[xuid];
    }
    PlayerRank.getRank = getRank;
    function save(message = false, actor) {
        const send = new message_1.sendMessage(actor);
        fs.writeFile(playerRankPath, JSON.stringify(playerRank, null, 2), "utf8", (err) => {
            if (message) {
                if (err) {
                    send.error(`players.json ${err}`);
                    throw err;
                }
                else
                    send.success(`players.json Saved!`);
            }
        });
    }
    PlayerRank.save = save;
})(PlayerRank = exports.PlayerRank || (exports.PlayerRank = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDZDQUE4QztBQUM5Qyx3QkFBMEI7QUFDMUIsNkJBQTZCO0FBQzdCLHlCQUF5QjtBQUN6Qix1Q0FBd0M7QUFFeEMsSUFBSSxVQUFVLEdBQTJCLEVBQUUsQ0FBQztBQUM1QyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFFbEUsSUFBSTtJQUFFLFVBQVUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7Q0FBRTtBQUFDLE9BQU0sR0FBRyxFQUFFO0lBQ3BELElBQUksR0FBRztRQUFFLEVBQUUsQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7Q0FDakY7QUFFRCxJQUFpQixVQUFVLENBb0MxQjtBQXBDRCxXQUFpQixVQUFVO0lBQ3ZCLFNBQWdCLFNBQVMsQ0FBQyxJQUFZO1FBQ2xDLElBQUksSUFBSSxLQUFLLEVBQUUsSUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztZQUFFLE9BQU8sS0FBSyxDQUFDO1FBQ2xELElBQUksVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUM7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUNsRCxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUMsUUFBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFMZSxvQkFBUyxZQUt4QixDQUFBO0lBRUQsU0FBZ0IsT0FBTyxDQUFDLElBQVksRUFBRSxJQUFZO1FBQzlDLElBQUksSUFBSSxLQUFLLEVBQUUsSUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztZQUFFLE9BQU8sS0FBSyxDQUFDO1FBQ2xELElBQUksQ0FBQyxRQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRW5DLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBQyxJQUFJLENBQUM7UUFDdEIscUJBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNyQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBUGUsa0JBQU8sVUFPdEIsQ0FBQTtJQUVELFNBQWdCLE9BQU8sQ0FBQyxJQUFZO1FBQ2hDLElBQUksSUFBSSxLQUFLLEVBQUUsSUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQ2pELElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQztZQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsUUFBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUMsUUFBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLE9BQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFMZSxrQkFBTyxVQUt0QixDQUFBO0lBRUQsU0FBZ0IsSUFBSSxDQUFDLFVBQW1CLEtBQUssRUFBRSxLQUFvQjtRQUMvRCxNQUFNLElBQUksR0FBRyxJQUFJLHFCQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQzlFLElBQUksT0FBTyxFQUFFO2dCQUNULElBQUksR0FBRyxFQUFFO29CQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDLENBQUM7b0JBQ2xDLE1BQU0sR0FBRyxDQUFDO2lCQUNiOztvQkFDSSxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7YUFDNUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFYZSxlQUFJLE9BV25CLENBQUE7QUFDTCxDQUFDLEVBcENnQixVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQW9DMUIifQ==