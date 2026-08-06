---
title: "Modding Guide"
description: "Writing a Quetoo mod — the game and cgame modules, the eight files a mod owns, optional features, and the hooks for changing behaviour."
weight: 40
---

Modding Quetoo involves writing custom C code to _modify_ the gameplay. By writing a mod, you can:

 * Change gameplay rules like teams, friendly fire, kill streaks..
 * Change physics like projectile strength or speed, gravity, friction..
 * Change player movement to introduce flying, wall jumping, power sliding..
 * Add new weapons, items, powerups or entity types.
 * Introduce new audio and visual effects like lights, sprites and more.
 * Change or introduce new menus to help players find your features.

But a mod is not a fork of the entire Quetoo engine or even the entire game module source. Instead, a mod is _composed_ by including gameplay features from a common set of source files, and then augmenting them with your own code using callbacks. Your mod is split into two shared libraries: `game.so` for server-side gameplay changes, and `cgame.so` for client-side effect and menu changes.

The practical consequence of composing modules rather than forking them is that your mod stays very small, and evolves with the rest of the Quetoo codebase and ecosystem.

## What a module owns

Quetoo ships three modules. `default` is deathmatch with optional teams support, `ctf` is capture the flag, and `lithium` is deathmatch with the grappling hook and the tech powerups. Each one is exactly this, and nothing more:

```
src/game/<mod>/                 src/cgame/<mod>/
    Makefile.am                     Makefile.am
    g_types.h                       cg_module.c
    bg_item.h                       cg_team_mode.c
    bg_item.c
    g_module.c
```

| File | What it is |
|------|------------|
| `g_types.h` | The manifest: wire values, stat indices, config strings, tuning constants, `GAME_NAME`, `PROTOCOL_MINOR` |
| `bg_item.h` | Item tags — the `ITEM_*` enum your roster is indexed by |
| `bg_item.c` | The item roster itself: names, models, sounds, pickup behaviour |
| `g_module.c` | `G_Module_Init` / `G_Module_Shutdown` — where your mod installs behaviour of its own |
| `cg_module.c` | `Cg_Module_Init` / `Cg_Module_Shutdown` — the same seam, client side |
| `cg_team_mode.c` | The team arrangements your mod offers in the Create Server menu |
| `Makefile.am` | The source list, and the features you switch on |

The manifest files stay per-module **by design**. A mod can only add files in its own directory, so the manifest is what a modder owns — sharing it would make adding one stat a reason to fork the engine.

---

## Creating a mod

### 1. Copy a module

Start from whichever shipped module is closest to what you want:

```bash
cd quetoo
cp -r src/game/lithium src/game/mymod
cp -r src/cgame/lithium src/cgame/mymod
```

### 2. Rename it

In `src/game/mymod/g_types.h`, set the name the module answers to. This is both its directory under `lib/quetoo` and the name it advertises on the wire:

```c
#define GAME_NAME "mymod"
```

In both `Makefile.am` files, point the install directory and the game source path at your module:

```makefile
# src/game/mymod/Makefile.am
gamelibdir = @PKGLIBDIR@/mymod

# src/cgame/mymod/Makefile.am
GAME_DIR = $(top_srcdir)/src/game/mymod
cgamelibdir = @PKGLIBDIR@/mymod
```

Both libraries are still built as `game.la` and `cgame.la`. Every module's binary is named `game.so` and `cgame.so` — the *directory* is what distinguishes it.

### 3. Wire it into the build

Add your module to `configure.ac`, in `GAME_MODULES` and in `AC_CONFIG_FILES`:

```
GAME_MODULES="default ctf lithium mymod"
...
	src/cgame/mymod/Makefile
	src/game/mymod/Makefile
```

### 4. Build and install

```bash
autoreconf -i
./configure
make && sudo make install
```

To build only what you care about, use `--with-games`:

```bash
./configure --with-games='default mymod'
```

> **Keep `default` in that list.** The shared menus, fonts and UI sounds install to `lib/quetoo/default/ui`, and the engine mounts `lib/quetoo/default` permanently so that every module can find them. A build with only your own mod produces a game with no menus.

### 5. Run it

```bash
quetoo +game mymod
```

Or from the console, at any time:

```
game mymod
```

`game` with no argument reports the module that is current, and completes module names on Tab. Changing games brings down any running server or connection first, because both modules are loaded from the game that is current.

---

## Switching features on

Three optional features live in the common sources. A module opts into one wholesale by listing its sources and its define in `Makefile.am` — there is no runtime cvar for them, because compiling one in *is* the module saying it wants it.

| Define | Feature | Sources to list |
|--------|---------|-----------------|
| `G_HOOK` | The grappling hook | `g_hook.c` |
| `G_TECH` | The tech powerups | `g_tech.c`, plus `cg_tech.c` client side |
| `G_CTF` | Capture the flag | `g_ctf.c`, plus `cg_ctf.c` client side |

The defines go in `AM_CPPFLAGS`:

```makefile
AM_CPPFLAGS = \
	-DG_HOOK \
	-DG_TECH \
	...
```

> **The defines must match between your `game` and `cgame` modules.** They change struct layouts and wire values that both sides read, so a mismatch is not a build error — it is a client quietly misreading the server.

Adopting a feature also means supplying what it needs in your manifest. `G_TECH` wants `ITEM_TYPE_TECH`, the `TECH_*` tags with their item definitions, and a `STAT_TECH` wire value. Each feature's header says what it expects, and a missing piece is a compile error rather than a surprise at runtime.

---

## Changing behaviour

Pick the mechanism that matches the *shape* of the difference, in roughly this order of preference.

### The manifest

Wire numbering, the item roster, tuning constants. Yours already — just edit it.

### An `#if` guard in common

For a few additive lines inside an existing function. Duplicates nothing.

### A chainable hook

For a variation point that several optional features may each want a say in. Common holds the default; a feature installs over the top, keeping the previous value to call as super:

```c
static struct {
	ResetDroppedItem ResetDroppedItem;
} super;

static void G_ResetDroppedItem_MyMod(g_entity_t *ent) {

	if (ent->item->def.type == ITEM_TYPE_MINE) {
		G_DefuseMine(ent);
		return;
	}

	super.ResetDroppedItem(ent);
}

/* in G_Module_Init */
super.ResetDroppedItem = G_ResetDroppedItem;
G_ResetDroppedItem = G_ResetDroppedItem_MyMod;
```

Composition falls out of which features a module builds. Neither feature mentions the other, and no module hand-writes a dispatcher.

### The module contract

`G_Module_Init` and `G_Module_Shutdown` are declared in `g_module.h` and defined by every module, even if the body is empty. A missing definition is a link error, which is how a new module learns what it owes.

This seam exists **because** a mod can only add files to its own directory: it cannot add a call to `G_Init`, and a guard named after it could never be committed upstream. Installing from here also puts your hooks at the head of every chain, so you may wrap a shipped feature.

### Overriding a whole file

The build resolves your module's own copy of a source ahead of common's, so forking one file is a bounded, per-file decision rather than a per-module one. Copy it into your module's directory and list it in `Makefile.am`. That escape hatch is what makes sharing safe: inherit by default, own what you actually change.

---

## The hooks

Server side, declared in `src/game/common/g_module.h`:

| Hook | Tail lives in | What it decides |
|------|---------------|-----------------|
| `ConfigureLevel` | `g_entity.c` | What a feature holds for the level ahead |
| `InitMedia` | `g_entity.c` | Models and sounds to index |
| `InhibitItem` | `g_item.c` | Whether the gameplay withholds an item entirely |
| `InitItem` | `g_item.c` | How an item type is picked up and dropped |
| `ResetItem` | `g_item.c` | Placing an item for the start of a level |
| `ResetDroppedItem` | `g_item.c` | What becomes of a dropped item that left the world |
| `ResolveInventoryItem` | `g_item.c` | Which item a name the client typed means |
| `TossInventory` | `g_item.c` | What a client sheds on team change or death |
| `ModifyDamage` | `g_combat.c` | Scaling damage and knockback |
| `PrepareMove` | `g_client.c` | The state a player move starts from |
| `CheckCvars` | `g_rules.c` | Applying a feature's own modified cvars |
| `CheckWinner` | `g_rules.c` | Whether the level has been won |
| `FormatGameName` | `g_rules.c` | The gameplay name in server info |

Client side, in `src/cgame/common/cg_module.h`, the HUD is composable through one hook:

| Hook | Tail lives in | What it decides |
|------|---------------|-----------------|
| `DrawHudElements` | `cg_hud.c` | Which HUD elements are drawn, and in what order |

The drawing primitives — crosshair, screen blends, centre print, weapon bar, and the icon and vital helpers — live in `cg_hud_draw.c` and know nothing about which stats a module shows. Your `cg_hud.c` is composition only.

Each hook carries a docblock saying whether implementations should call super. A few, such as `CheckWinner`, have a single owner: frag limit and capture limit are answers to the same question rather than additions to each other, so a mod that plays for captures replaces it instead of chaining onto it.

---

## Rules that will bite you

- **Installation must be idempotent.** `G_Init` runs on *every* server initialization, not once per process, and `dlclose` does not reliably unload a module on macOS, so file statics survive. Installing twice points a chain at itself and the first call spins forever. Guard installs with a `static bool installed`.
- **Install from `_Init`**, behind that guard, and never from anything per-level — the chain would grow on every map restart.
- **Chain order is installation order**, so the order of the `_Init` calls is part of your mod's behaviour.
- **Call super, not the default.** Super means "let whoever installed before me decide". Calling the default directly gives last-writer-wins, and two features would swallow each other.
- **Never uninstall hooks in `_Shutdown`.** `_Init` and `_Shutdown` run on every server initialization, while a hook installs once per module image — uninstalling would tear a link out of a chain that the next `_Init` declines to rebuild.
- **Bump your `PROTOCOL_MINOR`** whenever your wire layout changes, so that a mismatched client is refused rather than left misreading stats.

---

## Adding cvars and commands

Register both from your module's init, through the engine imports:

```c
cvar_t *g_my_feature = gi.AddCvar("g_my_feature", "1", CVAR_SERVER_INFO,
                                  "Enables my custom feature.");

gi.AddCmd("my_cmd", G_MyCmd_f, CMD_GAME, "Does something useful.");
```

`CVAR_SERVER_INFO` sends the value to clients as part of server info. If your feature owns cvars that require a level restart when changed, consume them from a `CheckCvars` hook and clear each cvar's `modified` flag there, or it will announce the same change every frame.

---

## How the engine finds your module

Modules are resolved **only** from directories whose name is the game that is current — `lib/quetoo/mymod`, and the equivalent under the data directory, your [user directory](/docs/players/), or a `-path` root. Every module's library is named `game.so` and `cgame.so`, and `lib/quetoo/default` stays mounted for the shared UI, so searching the whole path would silently load another module's library under your mod's name.

Two failures are therefore clean rather than confusing:

- A mod that ships no `cgame` is refused outright — `Couldn't find cgame.so for game mymod` — instead of quietly running `default`'s.
- A client whose loaded module is not the one the server is running is dropped at connect, because each module reports the `GAME_NAME` its own manifest defines.

Only `lib/quetoo` is scanned for Tab completion, so install your mod there if you want it offered.

---

## Building on Windows and macOS

Autotools is not the only build. Every module is described three times — in its `Makefile.am`, in the MSVS project and property sheet under `Quetoo.vs15/`, and in the Xcode project — and only autotools is exercised by a local build on macOS or Linux. A module missing a source in one of the others produces no failure in the system you happen to be looking at.

Quetoo ships a checker for exactly this:

```bash
python3 src/tools/verify_projects.py --verbose
```

It compares each module's sources and feature defines across all three, in both directions. Run it after adding, moving or removing any source file.

---

## Further reading

- [**`doc/game-module-hooks.md`**](https://github.com/jdolan/quetoo/blob/main/doc/game-module-hooks.md) — the design rationale in full: why each mechanism is shaped the way it is, what stayed a guard and why, and what changed on purpose
- `src/game/lithium` and `src/cgame/lithium` — the smallest complete mod, and the best template
- `src/game/common/g_module.h` and `src/cgame/common/cg_module.h` — the authoritative hook lists, each with a docblock on whether to call super
- [Discord](https://discord.gg/unb9U4b) — ask in `#development`
