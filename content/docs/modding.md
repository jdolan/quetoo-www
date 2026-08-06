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

The benefit of composing modules rather than forking them is that your mod stays very small, and evolves with the rest of the Quetoo codebase and ecosystem.

---

## Creating a mod

### 1. Copy it

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

### 3. Build it

Add your module to `configure.ac`, in `GAME_MODULES` and in `AC_CONFIG_FILES`:

```
GAME_MODULES="default ctf lithium mymod"
...
	src/cgame/mymod/Makefile
	src/game/mymod/Makefile
```

Then build and install it.

```bash
autoreconf -i
./configure
make && sudo make install
```

### 5. Run it

```bash
quetoo +game mymod
```

Or from the console, at any time:

```
game mymod
```

---

## Changing the game

### Opt-in features

Several optional features live in `src/game/common`. A module opts into one by enabling it in `Makefile.am`.

| Define | Feature | Sources to list |
|--------|---------|-----------------|
| `G_HOOK` | The grappling hook | `g_hook.c` |
| `G_TECH` | The tech powerups | `g_tech.c`, plus `cg_tech.c` client side |
| `G_CTF` | Capture the flag | `g_ctf.c`, plus `cg_ctf.c` client side |


The defines go in `AM_CPPFLAGS` **for both game.so and cgame.so**:


```makefile
AM_CPPFLAGS = -DG_HOOK -DG_TECH ...
```

---

## Hooks

Both the game and cgame modules provide a _Hooks API_, defined in `g_module.h` for game and `cg_module.h` for cgame. Both provide injection points for mods to augment gameplay events. **Both hooks APIs use a chain-of-responsibility pattern.** 

To implement a hook, install it from your `G_Module_Init` or `Cg_Module_Init` function. To ensure you do not break the chain of responsibility, **copy the previous hook function chain** so that you may dispatch it from yours.


```c
// hook chain storage
static struct {
  ResetDroppedItem ResetDroppedItem;
} previous;

static void G_ResetDroppedItem_MyMod(g_entity_t *ent) {

  if (ent->item->def.type == ITEM_TYPE_MINE) {
    G_DefuseMine(ent);
    return; // chain intentionally broken
  }

  previous.ResetDroppedItem(ent); // chain preserved
}

/**
 * @brief Initializes MyMod.
 */
void G_Module_Init(void) {
  
  previous.ResetDroppedItem = G_ResetDroppedItem; // copy the chain
  G_ResetDroppedItem = G_ResetDroppedItem_MyMod; // register your hook
}

```

### Overriding a whole file

If hooks do not provide enough flexibility, you can also override an entire common file. The build system resolves your module's own copy of a source ahead of common's to support this. Copy the said file into your module's directory and list it in `Makefile.am`.

---

## Further reading

- [Quetoo Discord](https://discord.gg/unb9U4b) `#development` channel
