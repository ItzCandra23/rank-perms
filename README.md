# RankPerms
This is a permissions plugin for BDSX.

## Commands
* `/myrank` - `Check your rank`
* `/rankadm` - `Rank command for admin`
* `/setrank` - `Set player rank`
* `/rankreload` - `Reload commands`

## Permissions
* `/myrank` - `rank-perms.command.myrank`
* `/rankadm` - `rank-perms.command.rankadm`
* `/setrank` - `rank-perms.command.setrank`
* `/rankreload` - `rank-perms.command.rankreload`

## Custom COmmand Permission
```ts
import { commandPerm } from "@bdsx/rank-perms/src/command";
import { MobEffectIds, MobEffectInstance } from "bdsx/bds/effects";
import { int32_t } from "bdsx/nativetype";

commandPerm.register("heal", "Heal your health.", "heal.command.permission")
.overload((params, origin) => {
    const player = origin.getEntity();
    if (!player) {
        console.log("This command can't use in console");
        return;
    }
    if (!player.isPlayer()) return;

    const effect = MobEffectInstance.create(MobEffectIds.InstantHealth, params.duration, 20);
    player.addEffect(effect);
}, {
    duration: int32_t,
});
```
