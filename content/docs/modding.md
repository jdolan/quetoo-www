---
title: "Modding Guide"
weight: 40
---

This page is an introduction to modding Quetoo — customizing gameplay through the game module system.

## Architecture Overview

Quetoo uses a **dynamically loaded game module** architecture, separating gameplay logic from the engine. This means you can replace or extend game behavior without recompiling the engine itself.

| Module | File | Loaded by |
|--------|------|-----------|
| Server-side game logic | `game.so` / `game.dll` | Server at map load |
| Client-side game logic | `cgame.so` / `cgame.dll` | Client at map load |

Both modules communicate with the engine through fixed API structs (`g_import_t` / `g_export_t` for the game module, `cgi_t` / `cg_export_t` for cgame).

---

## Game Module (Server-Side)

### Entry Point

The game module exports a single entry function:

```c
g_export_t *G_LoadGame(g_import_t *import);
```

The engine calls this at startup, passing a `g_import_t` struct filled with engine functions (console output, collision, networking, etc.). The game returns a `g_export_t` struct with its function table.

### API Version

The game module must match the engine's `GAME_API_VERSION`. If it doesn't, the server will refuse to load the module. Check `src/game/g_types.h` for the current version.

### Key Source Files

| File | Purpose |
|------|---------|
| `src/game/default/g_main.c` | Module init/shutdown, cvar registration, game loop |
| `src/game/default/g_entity.c` | Entity lifecycle (spawn, free, think) |
| `src/game/default/g_combat.c` | Damage, death, gibbing |
| `src/game/default/g_weapon.c` | Weapon fire, projectile spawning |
| `src/game/default/g_physics.c` | Entity physics simulation |
| `src/game/default/g_player.c` | Player movement and state |
| `src/game/default/g_teams.c` | Team and CTF logic |
| `src/game/default/g_map_list.c` | Map rotation logic |
| `src/game/default/g_items.c` | Item pickups and inventory |
| `src/game/default/g_ai.c` | Bot AI |

### Entity System

Entities are stored in a fixed-size array (`MAX_ENTITIES`). Each entity has:

- `g_entity_t` — the full server-side entity, including private game data
- `entity_state_t` — the network-transmitted portion (origin, angles, model, effects, etc.)

Entity slots are **reused**. A `spawn_id` field increments each time a slot is recycled, so code can detect stale references:

```c
if (ent->current.spawn_id != expected_spawn_id) {
    // entity was freed and reallocated — handle accordingly
}
```

### Adding a Console Variable

Register cvars in `G_Init()`:

```c
cvar_t *g_my_feature = gi.AddCvar("g_my_feature", "1", CVAR_SERVER_INFO,
                                   "Enables my custom feature.");
```

`CVAR_SERVER_INFO` causes the cvar value to be sent to clients as part of server info. `CVAR_ARCHIVE` persists the value across server restarts.

### Adding a Server Command

```c
gi.AddCmd("my_cmd", G_MyCmd_f, CMD_GAME, "Does something useful.");
```

### Game Loop

`G_Frame()` is called by the server every game tick (60 Hz by default). Entity think functions (`ent->think`) are called from here.

---

## Client Game Module (cgame, Client-Side)

The cgame module handles client-side presentation: the HUD, scoreboard, local effects, weapon models, and client-side movement prediction.

### Key Source Files

| File | Purpose |
|------|---------|
| `src/cgame/default/cg_main.c` | Module init, imports, frame loop |
| `src/cgame/default/cg_hud.c` | HUD rendering |
| `src/cgame/default/cg_predict.c` | Client-side movement prediction |
| `src/cgame/default/cg_entity.c` | Entity interpolation and effects |
| `src/cgame/default/cg_weapon.c` | View weapon model animation |
| `src/cgame/default/ui/` | In-game menus (ObjectivelyMVC UI framework) |

### Entity Prediction

The cgame module predicts player movement locally to hide network latency. Predicted state is reconciled with authoritative server state each frame.

---

## Building a Mod

A mod is a replacement `game.so` / `cgame.so` pair placed in a subdirectory of the game data:

```
~/.quetoo/mygame/game.so
~/.quetoo/mygame/cgame.so
```

Load it with `+set game mygame` on the command line, or from the console:

```
game mygame
```

### Build Setup

The game module builds as a shared library. Use the existing `Makefile.am` in `src/game/default/` as a reference. The key flags are:

```makefile
AM_CFLAGS = -fPIC -DGAME_MODULE
LDFLAGS = -shared -Wl,-soname,game.so
```

---

## Materials System

Quetoo uses a material definition system layered on top of texture files. A `.mat` file (placed alongside a texture) can specify additional maps and rendering parameters:

```
material textures/mymod/mywall
{
    normalmap textures/mymod/mywall_nm
    glossmap  textures/mymod/mywall_spec
    roughness 0.5
}
```

See existing material files in `quetoo-data/target/default/textures/` for examples.

---

## Getting Help

- [Discord](https://discord.gg/unb9U4b) — ask in `#development` for modding help
- Browse `src/game/default/` and `src/cgame/default/` — the existing game is the best example
- Read the subsystem docs in [`.github/subsystems/`](https://github.com/jdolan/quetoo/tree/main/.github/subsystems)
