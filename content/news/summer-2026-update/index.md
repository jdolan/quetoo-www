---
title: "The Summer Update"
description: "Eighty-eight releases in four months: a new renderer, real mod support, five ways to move, a HUD you can rebuild yourself, a new map, turrets, mine carts, and a whole lot more."
date: 2026-09-09
featured_image: "/images/screenshots/quetoo039.jpg"
build:
  list: never
  render: always
---

<div class="press-release">

<p class="pr-meta">September 9, 2026</p>

# 💀 The <span style="color: #5fb0c4">Summer</span> Update

Quetoo 1.0 shipped on May 22nd. Since then we've pushed **88 engine releases**, **30 game data releases**, and roughly fifteen hundred commits across Quetoo and its supporting libraries. If you've had the auto-updater on, you've been getting all of this quietly. If you haven't played since launch, here's what you missed.

Grab the latest from [Downloads](/downloads/) — everything below is live right now.

{{< placeholder type="video" id="A1" caption="Sizzle reel: 60-90s montage of a race run, Miner Difficulty, turrets, mine carts, death cam, the chrome HUD, and the new lighting. This is the hero asset for the post." >}}

## For players

### Miner Difficulty

Skies912's long-awaited cavern mine map, **Miner Difficulty**, is in the rotation. Winding tunnels, rail tracks, and the largest BSP in the game by a wide margin. It also drove a pile of engine work, more on that below.

![Screenshot of 'Miner Difficulty in C#`](/images/summer-2026-update/miner01.jpg)

### Campgrounds

Skies912's remake of Q3DM6 based on the Quake Live version. Effects for the jump pads, some wall effects etc are included. Also drove some engine work (new entity).

![Screenshot of 'Campgrounds`](/images/summer-2026-update/campgrounds01.jpg)

### More from Skies912:
Two more remakes are in progress in the data repo: 

- **Another Place of Two Deaths** -- full rebuild of 2deaths with MOAR detail<br>
- **Introduction to Shub** -- A re-imagining of Quake's START map made for DM. 

Neither ships yet, but the sources are public if you want a preview.

### Five ways to move

Player movement is no longer one thing. Quetoo now ships **five movements**, and you pick one:

- **Quetoo** — what you've been playing, and the only one with the grappling hook.
- **Quetoo Race** — Quetoo's own movement for jumping, and the only one still being tuned.
- **Quake** — QuakeWorld.
- **Quake II**
- **Quake III Arena**

Set it with the `g_movement` cvar, from the **Create Server** menu, or per-level with a `movement` key on worldspawn; and each game module decides which movement a level falls back to when nothing asks for one. Servers advertise the movement they resolved, so the server browser tells you what you're joining before you join it.

The important part is what each movement is allowed to do. The three that imitate another game are **frozen**: fixed parameters in their own file, out of reach of the server's tuning cvars, finished the moment they match what they're imitating. The Quetoo movement still follows the server's movement cvars, as it always has. And Quetoo Race is deliberately the odd one out — it imitates nothing, having begun from Quake II and picked up its ramp mechanics by way of Digital Paint: Paintball 2, and it is still being tuned, because racing is entirely about movement. Race records carry a hash of the parameters they were set under, so a time can always be told which version of the movement produced it.

Movement travels with the player rather than with the server, so the client and the server run the same code over the same numbers, and your player bounding box — and the size your model is drawn at — comes from the movement you're using.

{{< placeholder type="video" id="A4" caption="Clip: the same strafe jump or gap attempted under Quetoo, Quake, Quake II, and Quake III in quick succession, labelled, showing how differently each lands." >}}

### Traps, turrets, and mine carts

Mappers have new toys, which means you have new ways to die. **Ballistics traps** fire any weapon's projectile on an interval, on a trigger, or as a toggle. **Turrets** are player-operated: walk up, use it, and fire along your view. Frags scored from a turret count for you, with a dozen new obituaries to match.

`func_train` got a complete overhaul so that a mine cart can bank and pitch to follow its rails, accelerate smoothly between corners, and carry its own heading. And the new `func_bob` mover does what it says: a self-contained bobbing platform with no path corners to fiddle with.

{{< placeholder type="video" id="A5" caption="Clip: player hops on a turret and fires at incoming players; cut to a ballistics trap firing rockets down a hallway." >}}

{{< placeholder type="video" id="A6" caption="Clip: mine cart on Miner Difficulty rounding a bend and climbing, showing the cart pitching with the rails." >}}

### The cam of shame

When you die, the camera now lingers on whoever did it to you. We call it the death cam. You will call it something else.

{{< placeholder type="video" id="A7" caption="Clip: 5-10s death cam following the killer after a rail frag." >}}

### A HUD you can rebuild

The heads-up display used to be drawn by hand, in C, one call at a time — which is why it had looked the same for a decade. The whole thing has been **rebuilt on the same toolkit and the same renderer as the menus**. Every element — vitals, powerups, the stat column, the clock, pickups, the weapon bar, the team banner, the crosshair, the scoreboard, the chat, the notifications, the console, and the diagnostics — is now a **real view**, with the HUD's own layout described in JSON and all of it styled with CSS.

Which means the HUD is now **yours**. The `cg_hud` cvar names a directory, `ui/hud/<variant>`, holding `hud.json`, `hud.css`, `scoreboard.json`, and `scoreboard.css`. Anything your variant doesn't ship falls back to the default, so a variant that only changes colors is four lines long. Two ship with the game:

- **default** — the classic arrangement, now set in Barlow Condensed with M PLUS U numerals.
![Screenshot showing the Default HUD](/images/summer-2026-update/A08.jpg)
- **chrome** — edge-anchored: four corner clusters sitting flush to the screen edges on angled cards cut from a gradient, the weapon bar running up the right edge, and a tabular scoreboard.
![Screenshot showing the Default HUD](/images/summer-2026-update/A09.jpg)

Because the HUD draws through the UI renderer, its icons and glyphs come from a shared atlas and its numbers are baked fonts, so all of it lands in a handful of draw calls. Pics can be SVG now, rasterized at your display's actual pixel density, and the crosshair is rasterized at the size it's drawn rather than scaled up from a small bitmap. Your own scoreboard row is highlighted. The frame rate counter has your ping under it, and the diagnostics overlay is a real table.

The menus got attention alongside it: rounded panels throughout, a loading screen that shows the map, the server, and a backdrop while you wait, color escapes accepted in server hostnames and player names, and confirmation dialogs that no longer stack up if you click Quit twice.

### It looks better

Lighting was unified across the world, models, and effects, and every map has been rebaked with **voxel ambient occlusion** and light penetration through liquids. Grates, foliage, and other alpha-tested surfaces now **cast correct shadows**. Materials gained an `emissive` property, so computer screens and glowing panels actually feed the bloom pass instead of faking it. And shadow acne is gone. Yes, for real this time.

{{< ab-compare
  before="/news/summer-update/TODO-ao-before.jpg"
  after="/news/summer-update/TODO-ao-after.jpg"
  before-label="1.0"
  after-label="Now"
  title="A10 — ambient occlusion and liquid lighting (same camera position, before/after)"
>}}

*Light Fixtures on Campgrounds*
![Screenshot of alpha-tested lights on Campgrounds](/images/summer-2026-update/A11a.jpg)
*Grates in the floor on Rage*
![Screenshot of alpha-tested grates on Rage](/images/summer-2026-update/A11b.jpg)

{{< placeholder type="image" id="A12" caption="Emissive materials: a wall of glowing computer screens or lit panels blooming in a dark room." >}}

Also: proper **Hor+ field of view** on ultrawide and portrait displays, a saturation slider, custom fullscreen modes, MSAA and AO controls in the Graphics menu, and beefier bullet and nail impacts.

### It sounds better

The sound system was, to quote the commit, unfucked. **HRTF** is available from the Audio menu, reverb is derived from the same baked voxels as ambient occlusion so rooms sound like their size, doppler and attenuation were fixed, and every music track was resampled to the engine's native rate to kill a persistent aliasing buzz.

### Bots and balance

Bots now flee from Quad and Invulnerability carriers, can't spot invisible players from across the map, and have a floor on how badly they wobble their aim. Pathfinding got a large performance pass. On the weapons side, the Super Nailgun was buffed and now fires single nails like Quake's, the Quake shotgun spread was tuned, Thunderbolt ammo was raised to Quake 3 levels, and point-blank explosives detonate instead of politely hanging in the air.

Items that fall into lava or slime can now **respawn immediately at their origin** when the mapper flags them, so no more waiting out a 30 second timer because someone knocked the rocket launcher into the drink.

A long-standing bug where high frame rates shortened your jumps is fixed. 

### Map Voting
Clients can also **vote** on the map, the bot count, the frag and time limits, and on forcing each other to spectate.

### Finding a game

The server browser was rewritten on top of a new status protocol and then rebuilt as a **two-pane browser**: the servers on the left, and everything known about the one you've selected on the right — hostname, address, whether it came from the master or the LAN, the map and its mapshot, the gameplay, the movement, occupancy, and ping. **Hide Empty** and **Hide Bots** filters, live scores, and a re-query of the master every time you open it. A server that answers on both the LAN and the master is now shown once instead of twice, and one that never answered at all renders as unset and, when you sort by ping, sorts last rather than posing as a 999 ms server.

The Home menu shows the **global leaderboard** from [Stats](/stats/). And Discord join announcements now include a `quetoo://` link, so one click puts you in the server your friends are on.

![New two-pane Join Server browser: server table on the left, details pane with mapshot on the right](/images/summer-2026-update/A13.jpg)
![Home menu showing the global leaderboard table](/images/summer-2026-update/A14.jpg)

### Race, in preview

The mod framework's most ambitious tenant ships in the box: **Race**, a timed-run mod built on the design, the replay format and the barrier semantics of **MovoWR**'s community jump mod. Runs are timed against checkpoints, your best is kept separately for each movement, and the fastest run on a course becomes its record — whose ghost you can then line up alongside and race.

Consider it a **preview**. There are no race maps and no public race servers yet, so for now it is something to load up locally and poke at rather than a game to go find tonight. Courses are built entirely out of entities, so that changes the moment mappers get hold of it.

{{< placeholder type="video" id="A15" caption="Clip: 15-20s of a race run on a test course, the record holder's ghost visible ahead and the run timer on the HUD. Preview-quality footage is fine here." >}}

## Under the hood: a new renderer

This is the big one. Quetoo's renderer has been **ported from OpenGL to Metal, Vulkan, and Direct3D 12** via SDL3's GPU API and our new [ObjectivelyGPU](https://github.com/jdolan/ObjectivelyGPU) library. OpenGL is deprecated on macOS and simply doesn't exist on iOS, so this was the price of admission for anything beyond the desktop. The OpenGL renderer has been removed entirely.

Along the way we consolidated most rendering into a single render pass with a single per-frame upload, moved decals and sprites to storage buffers, and cache dynamic light and shadow state across frames. On the same hardware, the new renderer is faster than the old one. With the HUD, console, and overlays moved onto the UI toolkit, the old 2D drawing layer is gone as well: there is now exactly one path from a pixel to the screen.

{{< placeholder type="image" id="A16" caption="Quetoo running on a Mac with a GPU/frame-time overlay showing Metal, or a Linux screenshot showing Vulkan in the console." >}}

The other half of the portability story is the dependency diet. **glib is gone**, replaced by [Objectively 2](https://github.com/jdolan/Objectively) collections. The UI toolkit, [ObjectivelyMVC](https://github.com/jdolan/ObjectivelyMVC), no longer touches OpenGL either; it renders through ObjectivelyGPU on every platform. All three libraries now build for iOS and Android and ship xcframeworks on every release.

We are not announcing a mobile port. But for the first time, there is nothing in the stack that prevents one.

## For modders

Quake 2 gave you a `game.dll` and a copy of the source. Quake 3 gave you three of them and QVMs. Both left you with one option: fork the whole game and maintain a divergent copy forever. Quetoo 1.0.68 shipped a **mod framework** designed to make that unnecessary, and we've spent the summer proving it out.

Gameplay rules are composed from **chainable hooks** rather than by editing the default game. There are now hooks for damage (which can veto an attack outright), item drops, entity spawning, trace clipping, entity presentation, chat, the client lifecycle, client commands, and gameplay resolution, with the client lifecycle hooks in matching `Will`/`Did` pairs. Shared code lives in `src/game/common` and `src/cgame/common` and is compiled into each module, so every mod owns its own struct layouts and nothing breaks when the default game changes shape.

**Three modules now ship beside the default game**, each proving a different point. **CTF** was extracted out of the default game, so the framework has to support what was previously privileged. **Lithium** (deathmatch plus grappling hook and techs) was written from scratch against the hooks alone. And **Race** replaces the entire premise — no frags, its own scoring, the racing movement, its own HUD, its own entity classes, its own on-disk record and replay formats — without touching a line of the default game. It is in preview, with no maps or servers of its own yet, but if a racing mod fits, most things fit.

![Create Server menu showing the game module selector with default / ctf / lithium / race, and the movement selector open beside it](/images/summer-2026-update/A17.jpg)

Two things that fell out of the mod work are worth calling out on their own:

- **A module chooses the movement.** The five movements above are kernels selected per player through the movement parameters, and each module names the one a level falls back to. New movements live in the shared movement tree rather than inside a module — the ids are networked and have to resolve on both sides — so adding flying, wall jumping, or power sliding is a file alongside the other five rather than a fork of the game.
- **A module arranges its own HUD.** A module ships its own `hud.json` and `scoreboard.json` per variant, reusing common's views and slotting in its own — CTF a captures counter, Lithium the held tech, Race speed and run counters — styled with the same gradient and corner-cut properties the shipped `chrome` variant uses.

If you don't need code, you don't need a build. **Shallow mods** let you `quetoo +game mymod` with nothing but a `.cfg` and some maps in your game directory; the engine falls back to the default modules. A server module can declare which client module its players should load, and the engine refuses to connect a client running a mismatched game or BSP. The `game` command tab-completes any directory under any search root, including hand-installed mods in your user directory.

Rounding it out: every player-movement constant is a server cvar, `g_fall_damage` is a cvar, frag logging is exposed to game modules through `gi.FragLog` so your mod gets stats for free, and `quemap -g mymod` compiles maps against your mod's search path.

The full picture is in the [mod support docs](/docs/modding/); [PR #915](https://github.com/jdolan/quetoo/pull/915) has the original design rationale and [issue #963](https://github.com/jdolan/quetoo/issues/963) tracks everything built on top of it.

## For mappers

Quetoo's [TrenchBroom](https://trenchbroom.github.io/) integration got a lot of love this summer.

- **Valve 220 map format.** `quemap` auto-detects it, the game config prefers it, and every shipped `.map` source has been converted. Better texture alignment, fewer surprises.
- **Entity definitions audited against the source.** The FGD and `entities.def` were compared line by line with the game code, fixing swapped `func_door_rotating` spawnflags, missing `target` keys, a wrongly-classed `trigger_exec`, missing Quake items, and more. Target link lines draw correctly in the editor again.
- **New entities:** `func_bob`, `ballistics_*` and `turret_*` per-weapon trap and turret classes, `trigger_push` with `start_off` and `toggle`, `trigger_multiple` that fires for as long as it's touched, `trigger_void`, the `hazard_respawn` item spawnflag, and custom `func_button` sounds.
- **func_train:** origin brushes, per-`path_corner` speed with smooth acceleration, heading inferred from the route, and the previously undocumented `teleport` and `silent` corner flags are now documented.
- **Race courses:** the race mod's course-building classes are documented in its own source, but are not in the shipped editor definitions yet.
- **Materials:** the new `emissive` stage property replaces `bloom`, and material stages support flat lighting.
- **Textures:** the new `ceil2_*` set (a remake of `ceil1_*` in extra colors), an expanded `evil` set, new lava materials, and refreshed Atlantis and Quake 2 sets. Every set ships with its Krita source.

{{< placeholder type="image" id="A18" caption="TrenchBroom showing the Quetoo entity browser with the turret_* / ballistics_* groups, or func_train path_corner links drawn." >}}
*Tilesheet mockup of ceil2 set*
![Ceil2_* Tilesheet mockup](/images/summer-2026-update/ceil2_atlas.png)
*In-game full set*
![Ceil2_* In-game Overall](/images/summer-2026-update/A19a.jpg)
*Focus on Parallax details*
![Ceil2_* In-game Focus on Parallax](/images/summer-2026-update/A19b.jpg)
*Atlantis Set: Testing map*
![Screenshot of some of the Atlantis set](/images/summer-2026-update/atlantis.jpg)

### Q3 Bezier Style Patches
We're also leaning hard into TrenchBroom's **patch** support. `quemap` tessellates curved patch geometry into the BSP, and the engine renders and collides against it natively, so arches, pipes, and domes are available to you today. We'd love to see what you do with them.

{{< placeholder type="image" id="A20" caption="Curved geometry: a patch-built arch or pipe in TrenchBroom next to the same view in-game." >}}

### The in-game editor

The [in-game editor](/docs/mapping/) now **simulates movers**. Doors, plats, trains, buttons, bobs, rotators, and conveyors run on the real game code inside the editor, and `U` fires whatever you have selected. Mouse-wheel cycles through stacked entities under the cursor. And the editor got a serious performance and memory pass, with static lights caching their shadow tiles indefinitely and several VRAM leaks plugged.

{{< placeholder type="video" id="A21" caption="Clip: in the editor, select a door and press U to open it; scroll the wheel to cycle through stacked entities." >}}

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
