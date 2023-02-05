import { ServerPlayer } from "bdsx/bds/player";
import { sendMessage } from "./utils/message";
import { Ranks } from ".";
import * as path from "path";
import * as fs from "fs";
import { commandPerm } from "./command";

let playerRank: Record<string, string> = {};
const playerRankPath = path.join(__dirname, "..", "players.json");

try { playerRank = require(playerRankPath) } catch(err) {
    if (err) fs.writeFileSync(playerRankPath, JSON.stringify(playerRank), "utf8");
}

export namespace PlayerRank {
    export function addPlayer(xuid: string): boolean {
        if (xuid === ""||xuid.includes(" ")) return false;
        if (playerRank.hasOwnProperty(xuid)) return false;
        playerRank[xuid]=Ranks.getRanks()[0];
        return true;
    }

    export function setRank(rank: string, xuid: string): boolean {
        if (xuid === ""||xuid.includes(" ")) return false;
        if (!Ranks.has(rank)) return false;

        playerRank[xuid]=rank;
        commandPerm.reload();
        return true;
    }

    export function getRank(xuid: string): string|null {
        if (xuid === ""||xuid.includes(" ")) return null;
        if (!playerRank.hasOwnProperty(xuid)) addPlayer(xuid);
        if (!Ranks.has(playerRank[xuid])) playerRank[xuid]=Ranks.getRanks()[0];
        return playerRank[xuid];
    }

    export function save(message: boolean = false, actor?: ServerPlayer): void {
        const send = new sendMessage(actor);
        fs.writeFile(playerRankPath, JSON.stringify(playerRank, null, 2), "utf8", (err) => {
            if (message) {
                if (err) {
                    send.error(`players.json ${err}`);
                    throw err;
                }
                else send.success(`players.json Saved!`);
            }
        });
    }
}