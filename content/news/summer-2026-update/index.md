---
title: "The Summer Update"
description: "Eighty-eight releases in four months: a new renderer, real mod support, a racing mod, five ways to move, a HUD you can build yourself, a new map, turrets, mine carts, and a whole lot more."
date: 2026-09-09
featured_image: "/images/screenshots/quetoo039.jpg"
_build:
  list: never
  render: always
---

<div class="press-release">

<p class="pr-meta">September 9, 2026</p>

# 💀 The <span style="color: #5fb0c4">Summer</span> Update

Quetoo 1.0 shipped on May 22nd. Since then we've pushed **88 engine releases**, **30 game data releases**, and roughly a thousand commits across Quetoo and its supporting libraries. If you've had the auto-updater on, you've been getting all of this quietly. If you haven't played since launch, here's what you missed.

Grab the latest from [Downloads](/downloads/) — everything below is live right now.

{{< placeholder type="video" id="A1" caption="Sizzle reel: 60-90s montage of a race run, Miner Difficulty, turrets, mine carts, death cam, the chrome HUD, and the new lighting. This is the hero asset for the post." >}}

## For players

### Race

There is a **racing mod** in the box now. `race` is a full game module that ships alongside `default`, `ctf`, and `lithium`, and it is a port of the community jump mod by **MovoWR** — his movement rulesets, his replay format, and the semantics of his barriers, rebuilt on Quetoo's mod framework.

A course is described entirely by entities, so any mapper can build one: `trigger_race_start`, `trigger_race_checkpoint`, `trigger_race_split`, `trigger_race_stage`, and `trigger_race_finish`, plus `func_race_checkpoint_gate` and `func_race_oneway_wall` for barriers that open only once you've earned them. Barriers are resolved per player and **predicted on the client**, so a gate you've passed doesn't yank you back.

The mod keeps **one personal best per player, per movement**, and the fastest run on the server becomes the course record. The record's raceline is kept too, which means you can type `ghost` and race it: the record holder's run, wearing the record holder's skin, leaving the start with you. The HUD shows your speed, your run count, and your splits **as deltas against your own bests**, so you know which third of the course you just lost.

{{< placeholder type="video" id="A2" caption="Clip: 20-30s of a race run with the ghost visible ahead, HUD showing the timer, speed, and a split delta going green then red." >}}

Racing has two modes. In **race** mode the clock counts and the grapple and noclip are refused; a run is thrown out if you noclip or if the movement changes underneath you. In **practice** mode nothing counts and everything is allowed, which is where you'll spend most of your time. The scoreboard is rearranged to suit: course records on one side, the racers on the other.

{{< placeholder type="image" id="A3" caption="Race scoreboard: course records column alongside the current racers, ideally with a personal best and a course record visible." >}}

### Five ways to move

Player movement is no longer one thing. Quetoo now ships **five movements**, and you pick one:

- **Quetoo** — what you've been playing, and the only one with the grappling hook.
- **Quetoo Race** — MovoWR's ruleset, tuned for jumping.
- **Quake** — QuakeWorld.
- **Quake II**
- **Quake III Arena**

Set it with the `g_movement` cvar, from the **Create Server** menu, or per-level with a `movement` key on worldspawn; each game module decides which movement a level falls back to when nothing asks for one, and the race module falls back to Race. Servers advertise the movement they resolved, so the server browser tells you what you're joining before you join it.

The important part is that a movement is **finished, not maintained**. Each one lives in its own file with its own fixed parameters, deliberately out of reach of the server's tuning cvars, so a movement someone set a record under can never quietly drift. Movement travels with the player rather than with the server, so the client and the server run the same code over the same numbers, and your player bounding box — and the size your model is drawn at — comes from the movement you're using.

{{< placeholder type="video" id="A4" caption="Clip: the same strafe jump or gap attempted under Quetoo, Quake, Quake II, and Quake III in quick succession, labelled, showing how differently each lands." >}}

### Miner Difficulty

Skies912's long-awaited cavern mine map, **Miner Difficulty**, is in the rotation. Winding tunnels, rail tracks, and the largest BSP in the game by a wide margin. It also drove a pile of engine work, more on that below.

{{< placeholder type="image" id="A5" caption="Miner Difficulty: wide establishing shot of the main cavern with rail tracks visible." >}}

Two more Skies912 remakes are in progress in the data repo: **Another Place of Two Deaths** (a full rebuild of 2deaths) and **Campgrounds**, our take on Q3DM6. Neither ships yet, but the sources are public if you want a preview.

{{< placeholder type="image" id="A6" caption="Campgrounds WIP: side-by-side or single shot of the remade central atrium. Label as work in progress." >}}

### Traps, turrets, and mine carts

Mappers have new toys, which means you have new ways to die. **Ballistics traps** fire any weapon's projectile on an interval, on a trigger, or as a toggle. **Turrets** are player-operated: walk up, use it, and fire along your view. Frags scored from a turret count for you, with a dozen new obituaries to match.

`func_train` got a complete overhaul so that a mine cart can bank and pitch to follow its rails, accelerate smoothly between corners, and carry its own heading. And the new `func_bob` mover does what it says: a self-contained bobbing platform with no path corners to fiddle with.

{{< placeholder type="video" id="A7" caption="Clip: player hops on a turret and fires at incoming players; cut to a ballistics trap firing rockets down a hallway." >}}

{{< placeholder type="video" id="A8" caption="Clip: mine cart on Miner Difficulty rounding a bend and climbing, showing the cart pitching with the rails." >}}

### The cam of shame

When you die, the camera now lingers on whoever did it to you. We call it the death cam. You will call it something else.

{{< placeholder type="video" id="A9" caption="Clip: 5-10s death cam following the killer after a rail frag." >}}

### A HUD you can rebuild

The heads-up display used to be drawn by hand, in C, one call at a time — which is why it had looked the same for a decade. The whole thing has been **rebuilt on the same toolkit and the same renderer as the menus**. Every element — vitals, powerups, the stat column, the clock, pickups, the weapon bar, the team banner, the crosshair, the scoreboard, the chat, the notifications, the console, and the diagnostics — is now a view described in **JSON and styled with CSS**.

Which means the HUD is now **yours**. The `cg_hud` cvar names a directory, `ui/hud/<variant>`, holding `hud.json`, `hud.css`, `scoreboard.json`, and `scoreboard.css`. Anything your variant doesn't ship falls back to the default, so a variant that only changes colors is four lines long. Two ship with the game:

- **default** — the classic arrangement, now in Barlow Condensed with M PLUS U numerals.
- **chrome** — edge-anchored: four corner clusters sitting flush to the screen edges on angled cards cut from a gradient, the weapon bar running up the right edge, and a tabular scoreboard.

{{< placeholder type="image" id="A10" caption="The default HUD variant in a firefight: vitals, weapon bar, stat column all visible." >}}

{{< placeholder type="image" id="A11" caption="The chrome HUD variant in the same scene as A10 if possible, showing the angled corner cards and the vertical weapon bar." >}}

Because the HUD draws through the UI renderer, its icons and glyphs come from a shared atlas and its numbers are baked fonts, so all of it lands in a handful of draw calls — the new HUD is cheaper than the one it replaced, not more expensive. Pics can be SVG now, rasterized at your display's actual pixel density, and the crosshair is rasterized at the size it's drawn rather than scaled up from a small bitmap. Your own scoreboard row is highlighted. The frame rate counter has your ping under it, and the diagnostics overlay is a real table.

The menus got attention alongside it: rounded panels throughout, a loading screen that shows the map, the server, and a backdrop while you wait, color escapes accepted in server hostnames and player names, and confirmation dialogs that no longer stack up if you click Quit twice.

### It looks better

Lighting was unified across the world, models, and effects, and every map has been rebaked with **voxel ambient occlusion** and light penetration through liquids. Grates, foliage, and other alpha-tested surfaces now **cast correct shadows**. Materials gained an `emissive` property, so computer screens and glowing panels actually feed the bloom pass instead of faking it. And shadow acne is gone. Yes, for real this time.

{{< ab-compare
  before="/news/summer-update/TODO-ao-before.jpg"
  after="/news/summer-update/TODO-ao-after.jpg"
  before-label="1.0"
  after-label="Now"
  title="A12 — ambient occlusion and liquid lighting (same camera position, before/after)"
>}}

{{< placeholder type="image" id="A13" caption="Alpha-tested shadows: a grate or fence casting a patterned shadow on the floor." >}}

{{< placeholder type="image" id="A14" caption="Emissive materials: a wall of glowing computer screens or lit panels blooming in a dark room." >}}

Also: proper **Hor+ field of view** on ultrawide and portrait displays, a saturation slider, custom fullscreen modes, MSAA and AO controls in the Graphics menu, and beefier bullet and nail impacts.

### It sounds better

The sound system was, to quote the commit, unfucked. **HRTF** is available from the Audio menu, reverb is derived from the same baked voxels as ambient occlusion so rooms sound like their size, doppler and attenuation were fixed, and every music track was resampled to the engine's native rate to kill a persistent aliasing buzz.

### Bots and balance

Bots now flee from Quad and Invulnerability carriers, can't spot invisible players from across the map, and have a floor on how badly they wobble their aim. Pathfinding got a large performance pass. On the weapons side, the Super Nailgun was buffed and now fires single nails like Quake's, the Quake shotgun spread was tuned, Thunderbolt ammo was raised to Quake 3 levels, and point-blank explosives detonate instead of politely hanging in the air.

Items that fall into lava or slime can now **respawn immediately at their origin** when the mapper flags them, so no more waiting out a 30 second timer because someone knocked the rocket launcher into the drink.

A long-standing bug where high frame rates shortened your jumps is fixed. Clients can also **vote** on the map, the bot count, the limits, and each other.

### Finding a game

The server browser was rewritten on top of a new status protocol and then rebuilt as a **two-pane browser**: the servers on the left, and everything known about the one you've selected on the right — hostname, address, whether it came from the master or the LAN, the map and its mapshot, the gameplay, the movement, occupancy, and ping. **Hide Empty** and **Hide Bots** filters, live scores, and a re-query of the master every time you open it. A server that answers on both the LAN and the master is now shown once instead of twice, and one that never answered at all renders as unknown and sorts last rather than posing as a 999 ms server.

The Home menu shows the **global leaderboard** from [Stats](/stats/). And Discord join announcements now include a `quetoo://` link, so one click puts you in the server your friends are on.

{{< placeholder type="image" id="A15" caption="New two-pane Join Server browser: server table on the left, details pane with mapshot on the right." >}}

{{< placeholder type="image" id="A16" caption="Home menu showing the global leaderboard table." >}}

## Under the hood: a new renderer

This is the big one. Quetoo's renderer has been **ported from OpenGL to Metal, Vulkan, and Direct3D 12** via SDL3's GPU API and our new [ObjectivelyGPU](https://github.com/jdolan/ObjectivelyGPU) library. OpenGL is deprecated on macOS and simply doesn't exist on iOS, so this was the price of admission for anything beyond the desktop. The OpenGL renderer has been removed entirely.

Along the way we consolidated most rendering into a single render pass with a single per-frame upload, moved decals and sprites to storage buffers, and cache dynamic light and shadow state across frames. On the same hardware, the new renderer is faster than the old one. With the HUD, console, and overlays moved onto the UI toolkit, the old 2D drawing layer is gone as well: there is now exactly one path from a pixel to the screen.

{{< placeholder type="image" id="A17" caption="Quetoo running on a Mac with a GPU/frame-time overlay showing Metal, or a Linux screenshot showing Vulkan in the console." >}}

The other half of the portability story is the dependency diet. **glib is gone**, replaced by [Objectively 2](https://github.com/jdolan/Objectively) collections. The UI toolkit, [ObjectivelyMVC](https://github.com/jdolan/ObjectivelyMVC), no longer touches OpenGL either; it renders through ObjectivelyGPU on every platform. All three libraries now build for iOS and Android and ship xcframeworks on every release.

We are not announcing a mobile port. But for the first time, there is nothing in the stack that prevents one.

## For modders

Quake 2 gave you a `game.dll` and a copy of the source. Quake 3 gave you three of them and QVMs. Both left you with one option: fork the whole game and maintain a divergent copy forever. Quetoo 1.0.68 shipped a **mod framework** designed to make that unnecessary, and we've spent the summer proving it out.

Gameplay rules are composed from **chainable hooks** rather than by editing the default game. There are now hooks for damage (which can veto an attack outright), item drops, entity spawning, trace clipping, entity presentation, chat, the client lifecycle, client commands, gameplay and movement resolution, and HUD arrangement, most of them in matching `Will`/`Did` pairs. Shared code lives in `src/game/common` and `src/cgame/common` and is compiled into each module, so every mod owns its own struct layouts and nothing breaks when the default game changes shape.

**Three modules now ship beside the default game**, each proving a different point. **CTF** was extracted out of the default game, so the framework has to support what was previously privileged. **Lithium** (deathmatch plus grappling hook and techs) was written from scratch against the hooks alone. And **Race** replaces the entire premise — no frags, its own scoring, its own movement, its own HUD, its own entity classes, its own on-disk record and replay formats — without touching a line of the default game. If a racing mod fits, most things fit.

{{< placeholder type="image" id="A18" caption="Create Server menu showing the game module selector with default / ctf / lithium / race, and the movement selector open beside it." >}}

Two things that fell out of the mod work are worth calling out on their own:

- **A module can supply the movement.** The five movements above are movement kernels selected per player through the movement parameters, and a module says which one a level falls back to. If you want flying, wall jumping, or power sliding, that is now a file, not a fork.
- **A module can arrange the HUD.** Modules chain onto the HUD configuration hook and add their own views by container identifier — CTF adds a captures counter, Lithium adds the held tech, Race adds speed and run counters — and the whole layout is JSON and CSS, styled with the same gradient and corner-cut properties the shipped `chrome` variant uses.

If you don't need code, you don't need a build. **Shallow mods** let you `quetoo +game mymod` with nothing but a `.cfg` and some maps in your game directory; the engine falls back to the default modules. A server module can declare which client module its players should load, and the engine refuses to connect a client running a mismatched game or BSP. The `game` command tab-completes any directory under any search root, including hand-installed mods in your user directory.

Rounding it out: every player-movement constant is a server cvar, `g_fall_damage` is a cvar, frag logging is exposed to game modules through `gi.FragLog` so your mod gets stats for free, and `quemap -g mymod` compiles maps against your mod's search path.

The full picture is in the [mod support docs](/docs/modding/); [PR #915](https://github.com/jdolan/quetoo/pull/915) has the original design rationale and [issue #963](https://github.com/jdolan/quetoo/issues/963) tracks everything built on top of it.

## For mappers

Quetoo's [TrenchBroom](https://trenchbroom.github.io/) integration got a lot of love this summer.

- **Valve 220 map format.** `quemap` auto-detects it, the game config prefers it, and every shipped `.map` source has been converted. Better texture alignment, fewer surprises.
- **Entity definitions audited against the source.** The FGD and `entities.def` were compared line by line with the game code, fixing swapped `func_door_rotating` spawnflags, missing `target` keys, a wrongly-classed `trigger_exec`, missing Quake items, and more. Target link lines draw correctly in the editor again.
- **New entities:** `func_bob`, `ballistics_*` and `turret_*` per-weapon trap and turret classes, `trigger_push` with `start_off` and `toggle`, `trigger_multiple` that fires for as long as it's touched, `trigger_void`, the `hazard_respawn` item spawnflag, custom `func_button` sounds, and the `trigger_race_*` and `func_race_*` classes for building courses.
- **func_train:** origin brushes, per-`path_corner` speed with smooth acceleration, heading inferred from the route, and the previously undocumented `teleport` and `silent` corner flags are now documented.
- **Materials:** the new `emissive` stage property replaces `bloom`, and material stages support flat lighting.
- **Textures:** the new `ceil2_*` set (a remake of `ceil1_*` in extra colors), an expanded `evil` set, new lava materials, and refreshed Atlantis and Quake 2 sets. Every set ships with its Krita source.

{{< placeholder type="image" id="A19" caption="TrenchBroom showing the Quetoo entity browser with the turret_* / ballistics_* / trigger_race_* groups, or func_train path_corner links drawn." >}}

{{< placeholder type="image" id="A20" caption="Texture sheet: the ceil2_* set laid out in a grid, or in-game on a ceiling." >}}

We're also leaning hard into TrenchBroom's **patch** support. `quemap` tessellates curved patch geometry into the BSP, and the engine renders and collides against it natively, so arches, pipes, and domes are available to you today. We'd love to see what you do with them.

{{< placeholder type="image" id="A21" caption="Curved geometry: a patch-built arch or pipe in TrenchBroom next to the same view in-game." >}}

### The in-game editor

The [in-game editor](/docs/mapping/) now **simulates movers**. Doors, plats, trains, buttons, bobs, rotators, and conveyors run on the real game code inside the editor, and `U` fires whatever you have selected. Mouse-wheel cycles through stacked entities under the cursor. And the editor got a serious performance and memory pass, with static lights caching their shadow tiles indefinitely and several VRAM leaks plugged.

{{< placeholder type="video" id="A22" caption="Clip: in the editor, select a door and press U to open it; scroll the wheel to cycle through stacked entities." >}}

## For server admins

**Update your servers.** Protocol 2029 (v1.0.70+) is required to be listed on the master. The master handshake was hardened with challenge-response authentication on registration and on every heartbeat, and the old `set_master` command is now the `sv_master` cvar.

Linux packages are now split into **`quetoo-client`** and **`quetoo-server`** for both Debian and Red Hat, so a VPS install pulls no graphics libraries. **arm64 Linux** tarballs are published alongside x86_64. `sv_min_clients` no longer counts spectators, `min_clients` can be overridden per-map in the rotation, and map list management moved from the game module into the server proper so it works for every mod.

Public servers report frags to [giblets.quetoo.org](https://giblets.quetoo.org) at every intermission, which is what feeds the [leaderboard](/stats/).

## Everything else

A late-May hardening sweep closed roughly forty bounds-check, overflow, and input-validation issues in network and BSP parsing. Startup crashes on older NVIDIA drivers are fixed. Screenshots and demos are auto-named with the map and timestamp. Windows builds ship debug symbols and a better crash dialog. There are `^8` orange and `^9` grey color codes for your name. Your default player name is no longer your OS username.

## Thank you

To everyone who filed a bug, tested a snapshot build, joined a pickup game on Discord, or shipped a map: this is your update too. Special thanks to Skies912 for Miner Difficulty and the remakes in flight, and to MovoWR, whose jump mod is the reason Race exists.

See you in the arena. 🚩

- **Downloads:** [quetoo.org/downloads](https://quetoo.org/downloads)
- **Discord:** [discord.gg/unb9U4b](https://discord.gg/unb9U4b)
- **GitHub:** [github.com/jdolan/quetoo](https://github.com/jdolan/quetoo)
- **Release notes:** [Quetoo](https://github.com/jdolan/quetoo/releases) · [Quetoo Data](https://github.com/jdolan/quetoo-data/releases) · [Objectively](https://github.com/jdolan/Objectively/releases) · [ObjectivelyGPU](https://github.com/jdolan/ObjectivelyGPU/releases) · [ObjectivelyMVC](https://github.com/jdolan/ObjectivelyMVC/releases)

</div>
