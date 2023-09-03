"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandPerm = exports.CustomCommandPermission = void 0;
const command_1 = require("bdsx/bds/command");
const command_2 = require("bdsx/command");
const event_1 = require("bdsx/event");
const launcher_1 = require("bdsx/launcher");
const EventEmitter = require("events");
const __1 = require("..");
const onreload = new EventEmitter();
const commands = new Map();
class CustomCommandPermission {
    constructor(name, description, perm, cmdPerm) {
        this.command = {
            name: name,
            description: description,
            perm: perm,
            level: cmdPerm,
        };
    }
    register() {
        const cmd = this.command;
        const registry = launcher_1.bedrockServer.commandRegistry;
        const find = registry.findCommand(cmd.name);
        if (find !== null)
            throw Error(`${cmd.name}: command already registered`);
        registry.registerCommand(cmd.name, cmd.description, cmd.level, command_1.CommandCheatFlag.NotCheat, command_1.CommandUsageFlag._Unknown);
        commands.set(cmd.name, cmd.perm);
        return new command_2.CustomCommandFactory(registry, cmd.name);
    }
}
exports.CustomCommandPermission = CustomCommandPermission;
exports.commandPerm = {
    register(name, description, perm, level = command_1.CommandPermissionLevel.Normal) {
        return new CustomCommandPermission(name, description, perm, level).register();
    },
    setPermission(name, perm) {
        const registry = launcher_1.bedrockServer.commandRegistry;
        const find = registry.findCommand(name);
        if (!find)
            return false;
        else {
            commands.set(name, perm);
            return true;
        }
    },
    /**Check command have permission or not. */
    find(name) {
        return commands.has(name);
    },
    /**Get all commands that have permission. */
    commands() {
        return commands.entries();
    },
    reload() {
        const pkt = launcher_1.bedrockServer.commandRegistry.serializeAvailableCommands();
        const players = launcher_1.bedrockServer.serverInstance.getPlayers();
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            player.sendNetworkPacket(pkt);
        }
        onreload.emit("CommandRankReloadEvent");
        pkt.dispose();
    },
    onReloading(callback) {
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
event_1.events.command.on((command, username, ctx) => {
    const fixCmd = command.split(" ")[0];
    const cmds = Array.from(commands.entries());
    for (let i = 0; i < cmds.length; i++) {
        const [cmd, perm] = cmds[i];
        if (fixCmd === `/${cmd}`) {
            const entity = ctx.origin.getEntity();
            if (!entity)
                return;
            const player = entity.getNetworkIdentifier().getActor();
            if (!player)
                return 0;
            if (!__1.Permissions.check(perm, player)) {
                player.sendMessage("§cYou dont have permission to access this command");
                return 0;
            }
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOENBQThGO0FBRTlGLDBDQUFvRDtBQUNwRCxzQ0FBb0M7QUFDcEMsNENBQThDO0FBQzlDLHVDQUF3QztBQUN4QywwQkFBaUM7QUFVakMsTUFBTSxRQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztBQUVwQyxNQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztBQUUzQyxNQUFhLHVCQUF1QjtJQUVoQyxZQUFZLElBQVksRUFBRSxXQUFtQixFQUFFLElBQVksRUFBRSxPQUErQjtRQUN4RixJQUFJLENBQUMsT0FBTyxHQUFDO1lBQ1QsSUFBSSxFQUFFLElBQUk7WUFDVixXQUFXLEVBQUUsV0FBVztZQUN4QixJQUFJLEVBQUUsSUFBSTtZQUNWLEtBQUssRUFBRSxPQUFPO1NBQ2pCLENBQUM7SUFDTixDQUFDO0lBRUQsUUFBUTtRQUNKLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDekIsTUFBTSxRQUFRLEdBQUcsd0JBQWEsQ0FBQyxlQUFlLENBQUM7UUFDL0MsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsSUFBSSxJQUFJLEtBQUssSUFBSTtZQUFFLE1BQU0sS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksOEJBQThCLENBQUMsQ0FBQztRQUMxRSxRQUFRLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLDBCQUFnQixDQUFDLFFBQVEsRUFBRSwwQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNySCxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFD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