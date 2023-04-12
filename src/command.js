"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandPerm = exports.CustomCommandPermission = void 0;
const command_1 = require("bdsx/bds/command");
const packetids_1 = require("bdsx/bds/packetids");
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
        for (const player of launcher_1.bedrockServer.serverInstance.getPlayers()) {
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
event_1.events.packetSend(packetids_1.MinecraftPacketIds.AvailableCommands).on((pkt, ni) => {
    const player = ni.getActor();
    if (!player)
        return;
    for (let i = 0; i < pkt.commands.size(); i++) {
        for (const [cmd, perm] of commands.entries()) {
            if (pkt.commands.get(i).name === cmd && !__1.Permissions.check(perm, player))
                pkt.commands.splice(i, 1);
        }
    }
});
event_1.events.command.on((command, username, ctx) => {
    const fixCmd = command.split(" ")[0];
    for (const [cmd, perm] of commands.entries()) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOENBQThGO0FBQzlGLGtEQUF3RDtBQUN4RCwwQ0FBb0Q7QUFDcEQsc0NBQW9DO0FBQ3BDLDRDQUE4QztBQUM5Qyx1Q0FBd0M7QUFDeEMsMEJBQWlDO0FBU2pDLE1BQU0sUUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7QUFFcEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7QUFFM0MsTUFBYSx1QkFBdUI7SUFFaEMsWUFBWSxJQUFZLEVBQUUsV0FBbUIsRUFBRSxJQUFZLEVBQUUsT0FBK0I7UUFDeEYsSUFBSSxDQUFDLE9BQU8sR0FBQztZQUNULElBQUksRUFBRSxJQUFJO1lBQ1YsV0FBVyxFQUFFLFdBQVc7WUFDeEIsSUFBSSxFQUFFLElBQUk7WUFDVixLQUFLLEVBQUUsT0FBTztTQUNqQixDQUFDO0lBQ04sQ0FBQztJQUVELFFBQVE7UUFDSixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3pCLE1BQU0sUUFBUSxHQUFHLHdCQUFhLENBQUMsZUFBZSxDQUFDO1FBQy9DLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLElBQUksSUFBSSxLQUFLLElBQUk7WUFBRSxNQUFNLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLDhCQUE4QixDQUFDLENBQUM7UUFDMUUsUUFBUSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSwwQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsMEJBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckgsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJ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