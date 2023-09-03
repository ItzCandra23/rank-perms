import { CommandCheatFlag, CommandPermissionLevel, CommandUsageFlag } from "bdsx/bds/command";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { CustomCommandFactory } from "bdsx/command";
import { events } from "bdsx/event";
import { bedrockServer } from "bdsx/launcher";
import EventEmitter = require("events");
import { Permissions } from "..";
import { AvailableCommandsPacket } from "bdsx/bds/packets";

interface CommandPermission {
    name: string;
    description: string;
    perm: string;
    level: CommandPermissionLevel;
}

const onreload = new EventEmitter();

const commands = new Map<string, string>();

export class CustomCommandPermission {
    private command: CommandPermission;
    constructor(name: string, description: string, perm: string, cmdPerm: CommandPermissionLevel) {
        this.command={
            name: name,
            description: description,
            perm: perm,
            level: cmdPerm,
        };
    }

    register(): CustomCommandFactory {
        const cmd = this.command;
        const registry = bedrockServer.commandRegistry;
        const find = registry.findCommand(cmd.name);
        if (find !== null) throw Error(`${cmd.name}: command already registered`);
        registry.registerCommand(cmd.name, cmd.description, cmd.level, CommandCheatFlag.NotCheat, CommandUsageFlag._Unknown);
        commands.set(cmd.name, cmd.perm);
        return new CustomCommandFactory(registry, cmd.name);
    }
}

export const commandPerm = {
    register(name: string, description: string, perm: string, level: CommandPermissionLevel = CommandPermissionLevel.Normal): CustomCommandFactory {
        return new CustomCommandPermission(name, description, perm, level).register();
    },
    setPermission(name: string, perm: string): boolean {
        const registry = bedrockServer.commandRegistry;
        const find = registry.findCommand(name);
        if (!find) return false;
        else {
            commands.set(name, perm);
            return true;
        }
    },
    /**Check command have permission or not. */
    find(name: string): boolean {
        return commands.has(name);
    },
    /**Get all commands that have permission. */
    commands(): IterableIterator<[string, string]> {
        return commands.entries();
    },
    reload(): void {
        const pkt = bedrockServer.commandRegistry.serializeAvailableCommands();
        const players = bedrockServer.serverInstance.getPlayers();

        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            player.sendNetworkPacket(pkt);
        }

        onreload.emit("CommandRankReloadEvent");
        pkt.dispose();
    },
    onReloading(callback: () => void) {
        onreload.on("CommandRankReloadEvent", () => {
            callback();
        });
    }
};

// Wait Update
// events.packetSend(MinecraftPacketIds.AvailableCommands).on((pkt, ni) => {
//     const player = ni.getActor();
//     if (!player) return;

//     const newPkt = AvailableCommandsPacket.construct(pkt);
//     AvailableCommandsPacket.apply(newPkt, AvailableCommandsPacket.contentSize);

//     for (let i = 0; i < newPkt.commands.size(); i++) {
//         const cmds: [string, string][] = Array.from(commands.entries());

//         for (let i_ = 0; i_ < cmds.length; i_++) {
//             const [cmd, perm] = cmds[i_];

//             if (newPkt.commands.get(i).name === cmd && !Permissions.check(perm, player)) {
//                 // newPkt.commands.splice(i, 1);
//                 console.log(newPkt.commands.get(i).name);
//             }
//         }
//     }

//     newPkt.sendTo(ni);
//     newPkt.destruct();
// });

events.command.on((command, username, ctx) => {
    const fixCmd = command.split(" ")[0];
    const cmds: [string, string][] = Array.from(commands.entries());
    for (let i = 0; i < cmds.length; i++) {
        const [cmd, perm] = cmds[i];
        if (fixCmd === `/${cmd}`) {
            const entity = ctx.origin.getEntity();
            if (!entity) return;

            const player = entity.getNetworkIdentifier().getActor();
            if (!player) return 0;

            if (!Permissions.check(perm, player)) {
                player.sendMessage("§cYou dont have permission to access this command");
                return 0;
            }
        }
    }
});