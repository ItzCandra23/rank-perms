import { Player } from "bdsx/bds/player";
import { RankPerms } from "..";
import { send } from "./utils/message";
import { commandPerm } from "./command";
import * as path from "path";
import * as fs from "fs";

let players: Record<string, string> = {};
const playerRankPath = path.join(__dirname, "..", "players.json");

try { players = require(playerRankPath) } catch(err) {
    if (err) fs.writeFileSync(playerRankPath, JSON.stringify(players), "utf8");
}

/**PlayerRank */
export class PlayerRank {
    constructor(private xuid: string) {}

    static rank(player: Player): PlayerRank {
        return new PlayerRank(player.getXuid());
    }

    static rankByXuid(xuid: string): PlayerRank {
        return new PlayerRank(xuid);
    }

    static has(xuid: string): boolean {
        return players.hasOwnProperty(xuid);
    }

    /**Add player */
    static addPlayer(player: Player): boolean {
        if (player.getXuid() === "") return false;
        if (this.has(player.getXuid())) return false;

        players[player.getXuid()]=RankPerms.getRanks()[0];
        return true;
    }

    /**Set player rank */
    static async setRank(player: Player, rank: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (player.getXuid() === "") {
                reject(`Xuid not found!`);
                return;
            }
            if (!RankPerms.hasRank(rank)) {
                reject(`Rank not found!`);
                return;
            }

            players[player.getXuid()]=rank;
            commandPerm.reload();

            resolve();
        });
    }

    /**Get player rank */
    static getRank(player: Player): string {
        if (player.getXuid() === "") return RankPerms.getRanks()[0];
        if (!this.has(player.getXuid())) this.addPlayer(player);

        if (!RankPerms.hasRank(players[player.getXuid()])) {
            players[player.getXuid()]=RankPerms.getRanks()[0];
            commandPerm.reload();
        }

        return players[player.getXuid()];
    }

    /**Set player rank */
    async setRank(rank: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!PlayerRank.has(this.xuid)) {
                reject(`Xuid not found!`);
                return;
            }
            if (!RankPerms.hasRank(rank)) {
                reject(`Rank not found!`);
                return;
            }

            players[this.xuid]=rank;
            commandPerm.reload();

            resolve()
        });
    }

    /**Get player rank */
    getRank(): string {
        if (!PlayerRank.has(this.xuid)) return RankPerms.getRanks()[0];
        if (!RankPerms.hasRank(players[this.xuid])) {
            players[this.xuid]=RankPerms.getRanks()[0];
            commandPerm.reload();
        }

        return players[this.xuid];
    }

    /**Save */
    static save(message: boolean = false): void {
        fs.writeFile(playerRankPath, JSON.stringify(players, null, 4), "utf8", (err) => {
            if (message) {
                if (err) send.error(`players.json ${err}`);
                else send.success(`players.json Saved!`);
            }
        });
    }
}