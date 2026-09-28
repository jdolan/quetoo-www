---
title: "The Autumn Update"
description: "116 releases since 1.0: portals and reflections, demo tools for content creators, a slew of new player models, voice chat, a new HUD, new maps, and a whole lot more."
date: 2026-09-27
featured_image: "/images/screenshots/quetoo039.jpg"
build:
  list: never
  render: always
---

<div class="press-release">

<p class="pr-meta">September 27, 2026</p>

# 🍁 The <span style="color: #c4785f">Autumn</span> Update

We released Quetoo, after almost 20 years in development, back in May. Since then, we've kept the pedal absolutely pinned to the floor with **116 engine releases** and **42 game data releases** spanning well over two thousand commits across Quetoo and its supporting repositories. Our goals are crystal clear:

<ol>
<li>Make Quetoo deathmatch the best open source boomer shooter out there</li>
<li></li>
</ol>

Grab the latest from [Downloads](/downloads/). Everything below is live right now.

<div class="trailer-embed">
  <iframe src="https://www.youtube.com/embed/0b_6YGUfhn0"
    title="Quetoo Autumn 2026 Update"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen></iframe>
</div>

## For players

### Portals and reflections

Quetoo can now draw the world a second time, from somewhere other than your eyes, and paste the result onto a surface. Point that second camera somewhere else in the map and you have a **portal**: walk up to a teleporter and you can see where it goes, live, before you commit. Mirror it about the surface instead and you have a **reflection**: water reflects the room above it, glass reflects you, and yes, you can see yourself in both.

Maps have been rebaked to show it off, so you don't have to wait for anyone to build something new.

<div class="post-video">
  <video src="/images/autumn-2026-update/B2.mp4" poster="/images/autumn-2026-update/B2.jpg"
    autoplay muted loop playsinline controls preload="metadata"
    aria-label="Walking up to a teleporter, seeing its destination live through the portal, and stepping through"></video>
</div>

<div class="post-video">
  <video src="/images/autumn-2026-update/B3.mp4" poster="/images/autumn-2026-update/B3.jpg"
    autoplay muted loop playsinline controls preload="metadata"
    aria-label="A player catching their own reflection in a pane of glass"></video>
</div>

<div class="post-video">
  <video src="/images/autumn-2026-update/B4.mp4" poster="/images/autumn-2026-update/B4.jpg"
    autoplay muted loop playsinline controls preload="metadata"
    aria-label="Wall torches reflected in a pool of water as the player walks along it"></video>
</div>

### Demos for content creators

Demos were rebuilt for people who make videos. The format was reworked around self-contained frames, so a demo is now **seekable**: jump anywhere, instantly, instead of fast-forwarding through a whole match to find the one rail you want.

- **A Demos browser** under Home lists your recordings newest first. Give them a title of your own, filter by title or map, mark favorites, and delete the rest. Demos that your build can't play are left out of the list instead of failing when you try them.
- **Transport controls** show up when you pause: rewind, fast forward, a scrubber, a speed slider, and single-frame step in both directions. The world holds still while you're paused, but the camera doesn't, so you can line up the shot.
- **Camera modes** work in demos and when spectating live. Cycle through first person, third person, and a **follow** camera that you aim yourself (the mouse swings it around the player, forward and back change the distance). The hook button cycles the camera, attack drops the player you're watching for free flight, and a second press picks one back up.

{{< placeholder type="image" id="B5" caption="The Demos browser under Home: a list of demos with titles, favorites, and the map filter in use." >}}

{{< placeholder type="video" id="B6" caption="Clip: demo playback paused, the transport bar appears; scrub the timeline, frame-step a rocket in flight, then resume at half speed." >}}

{{< placeholder type="video" id="B7" caption="Clip: during a demo, cycle first person, third person, and follow, swinging the follow camera around the player; then drop into free flight." >}}

### New player models

[Twelve new player models](/news/new-player-models/) landed this month, taken from the ioQuake3 and DeFrag communities and overhauled for Quetoo. Bloodseeker, Gladiator, Mantis, Violator and friends are all in the game now, and you can see all seventeen up close in the [gallery](/media/player-models/).

They've gotten better since that post, too: every model's default skin is now **tintable**. Pick your shirt, pants, and helmet colors in Player Setup and they're painted onto whichever model you're wearing. Team games tint you into your team's colors the same way, so red and blue work on every model, with no separate team skins needed.

And we finally have a **female player sound set**, voiced by my extremely talented wife. Turns out I married a voice actor. Go get fragged by her.

{{< placeholder type="image" id="B8" caption="Player Setup with a model wearing custom shirt, pants, and helmet tints, the color pickers visible." >}}

{{< placeholder type="image" id="B9" caption="A CTF match with several different models, all tinted red and blue by team." >}}

### Voice chat

Quetoo has **voice chat**. Hold `V` to talk to everyone, or `Shift+V` to talk to your team (the binds are `+voice` and `+voiceTeam`). It's encoded with Opus, so it sounds good and costs very little bandwidth. The HUD shows you who is talking.

Muting someone mutes their chat and their voice together, and if one player is ruining it for everyone, the server can **vote to mute** them.

{{< placeholder type="image" id="B10" caption="The HUD voice indicator showing a player's name while they talk, mid-match." >}}

### A new HUD

The HUD has looked the same for a decade. It's been rebuilt from scratch on the same toolkit as the menus, and there are now two to choose from in the menus:

- **default**: the classic arrangement, reset in Barlow Condensed with M PLUS U numerals.

![Screenshot showing the default HUD](/images/autumn-2026-update/A08.jpg)

- **chrome**: four corner clusters sitting flush to the screen edges on angled cards, the weapon bar running up the right edge, and a tabular scoreboard.

![Screenshot showing the chrome HUD](/images/autumn-2026-update/A09.jpg)

Both are sharp at any resolution, your own row in the scoreboard is highlighted, and your ping sits under the frame rate counter. And if neither is quite right, you can build your own. See [For developers and modders](#for-developers-and-modders).

{{< placeholder type="image" id="B11" caption="Optional: the HUD selector in the menus, with default and chrome listed." >}}

### New maps

Skies912's long-awaited cavern mine map, **Miner Difficulty**, is in the rotation. Winding tunnels, rail tracks, mine carts that bank and pitch along them, and the largest BSP in the game by a wide margin.

![Screenshot of Miner Difficulty](/images/autumn-2026-update/miner01.jpg)

**Campgrounds** is Skies912's remake of Q3DM6, based on the Quake Live version, jump pad effects and all.

![Screenshot of Campgrounds](/images/autumn-2026-update/campgrounds01.jpg)

More are in progress in the data repo: **Another Place of Two Deaths**, a full rebuild of 2deaths with MOAR detail, and **Introduction to Shub**, a re-imagining of Quake's START map for deathmatch. Neither ships yet, but the sources are public if you want a preview.

### Voting on what's next

When a level ends, the intermission now counts down and shows what's coming next, and players can **vote on the next map** right there. You can also vote on the bot count, the frag and time limits, forcing someone to spectate, and muting them.

{{< placeholder type="image" id="B12" caption="The intermission screen with the countdown and the next-map vote open." >}}

### It looks and sounds better

Lighting was unified across the world, models, and effects, and every map has been rebaked with **voxel ambient occlusion** and light penetration through liquids. Grates, foliage, and light fixtures now **cast correct shadows**. Glowing screens and panels actually feed the bloom pass instead of faking it. And shadow acne is gone. Yes, for real this time.

{{< ab-compare
  before="/images/autumn-2026-update/TODO-ao-before.jpg"
  after="/images/autumn-2026-update/TODO-ao-after.jpg"
  before-label="1.0"
  after-label="Now"
  title="B13: ambient occlusion and liquid lighting (same camera position, before/after)"
>}}

*Light fixtures on Campgrounds*
![Screenshot of alpha-tested lights on Campgrounds](/images/autumn-2026-update/A11a.jpg)
*Grates in the floor on Rage*
![Screenshot of alpha-tested grates on Rage](/images/autumn-2026-update/A11b.jpg)

{{< placeholder type="image" id="B14" caption="Emissive materials: a wall of glowing computer screens or lit panels blooming in a dark room." >}}

The sound system was, to quote the commit, unfucked. **HRTF** is available from the Audio menu, reverb is derived from the map itself so rooms sound like their size, and every music track was resampled to kill a persistent aliasing buzz.

### Finding a game

The server browser was rebuilt as a **two-pane browser**: the servers on the left, and everything about the one you've selected on the right, including the map, its mapshot, the game, the movement, and who's playing. **Hide Empty** and **Hide Bots** filters, live scores, and a fresh list every time you open it.

The Home menu shows the **global leaderboard** from [Stats](/stats/), and Discord join announcements include a `quetoo://` link, so one click puts you in the server your friends are on.

![New two-pane Join Server browser: server table on the left, details pane with mapshot on the right](/images/autumn-2026-update/A13.jpg)
![Home menu showing the global leaderboard table](/images/autumn-2026-update/A14.jpg)

### Quick hits

- **The cam of shame.** When you die, the camera lingers on whoever did it to you.
- **Turrets and traps.** Mappers can now place player-operated turrets and weapon traps. Turret frags count for you, with a dozen new obituaries to match.
- **Bots** flee from Quad and Invulnerability carriers, can't spot invisible players from across the map, and path around a lot faster.
- **Balance.** The Super Nailgun fires single nails like Quake's and hits harder, the Thunderbolt carries more ammo, and point-blank explosives detonate instead of politely hanging in the air.
- **Items** that fall into lava or slime can respawn at their origin immediately, if the map says so.
- **High frame rates** no longer shorten your jumps.
- **Updates** come to you. Quetoo tells you when a new release is out, asks before downloading it, and offers to restart when it's ready.

## For mappers

### Portals and reflections

Reflective water is a single `reflect` flag on its material, with no entity and no key. A portal is a `portal` flag on a brush entity's material plus a `portal` key naming where to look from, and on a teleporter that can simply be its destination. The details, including the budget of eight extra views per frame and the cases that won't reflect, are in the [mapping docs](/docs/mapping/#portals-and-reflections).

{{< placeholder type="image" id="B15" caption="TrenchBroom showing a misc_portal brush and the teleporter destination it names, beside the same portal in-game." >}}

### Material lights and the material editor

Materials can now emit light. The new `light.radius`, `light.color` and `light.intensity` stage keys turn a surface into real BSP lights at compile time, placed across each cluster of coplanar faces, so a lit panel lights the room without a hand-placed light beside it.

The [in-game editor](/docs/mapping/#in-game-editor) can **edit material stages live**. Add and remove stages, flip their flags, and preview material lights as you tune them. It also **simulates movers** on the real game code: doors, plats, trains, buttons and rotators all run, and `U` fires whatever you have selected.

{{< placeholder type="image" id="B16" caption="The in-game editor's Stages tab editing a material, with several collapsible stages open." >}}

{{< placeholder type="image" id="B17" caption="A material light being previewed live in the editor, with the light's radius and color visible on nearby walls." >}}

### TrenchBroom

- **Valve 220.** `quemap` auto-detects it, the game config prefers it, and every shipped map source has been converted.
- **Curved patches.** `quemap` tessellates TrenchBroom patches into the BSP, and the engine renders and collides against them, so arches, pipes and domes are available today.
- **Entity definitions audited against the source**, fixing swapped spawnflags, missing keys, and link lines that didn't draw.
- **New entities:** `misc_portal`, `func_bob`, `ballistics_*` traps and `turret_*` turrets, toggleable `trigger_push`, and the `hazard_respawn` item spawnflag.
- **func_train** got origin brushes, per-corner speed with smooth acceleration, and a heading inferred from the route, which is how Miner Difficulty's carts follow their rails.

{{< placeholder type="image" id="B18" caption="Curved geometry: a patch-built arch or pipe in TrenchBroom next to the same view in-game." >}}

### The `games` key

A `games` key on worldspawn says which game types a map is built for, such as `dm`, `duel`, `tdm` or `instagib`. The Create Server map browser badges each map with its game types and lists only the maps that suit the mod you're hosting, so a CTF map stops turning up when you're setting up a deathmatch server.

{{< placeholder type="image" id="B19" caption="The Create Server map browser with game badges on the maps and the game filter in use." >}}

## For developers and modders

### Mod support

Quetoo 1.0.68 shipped a **mod framework**, so that a mod no longer means forking the whole game. Gameplay rules are composed from chainable hooks rather than by editing the default game, and shared code is compiled into each module, so nothing breaks when the default game changes shape. Three modules ship beside the default game to prove it: **CTF**, extracted from the default game; **Lithium**, written from scratch against the hooks; and **Race**, a timed-run mod with its own scoring, HUD and replay format.

If you don't need code, you don't need a build: **shallow mods** run with nothing but a `.cfg` and some maps in your game directory. The full picture is in the [mod support docs](/docs/modding/).

![Create Server menu showing the game module selector with default / ctf / lithium / race, and the movement selector open beside it](/images/autumn-2026-update/A17.jpg)

### Race, in preview

Race is built on the design, the replay format and the barrier semantics of **MovoWR**'s community jump mod: checkpoints, a best time per movement, and the record holder's ghost to race against. There are no race maps or public servers yet, so treat it as something to poke at locally.

### Five ways to move

Movement is selectable per server, per level, or per module: **Quetoo** (the default, and the only one with the grappling hook), **Quetoo Race**, **Quake**, **Quake II**, and **Quake III Arena**. Set it with the `g_movement` cvar, from the Create Server menu, or with a `movement` key on worldspawn. The server browser shows the movement before you join.

### Build your own HUD

The HUD from [the players section](#a-new-hud) is laid out in JSON and styled with CSS. `cg_hud` names a directory under `ui/hud/` holding JSON layouts and CSS for the HUD, the scoreboard and the intermission, and anything your variant doesn't ship falls back to the default, so a variant that only changes colors is a single stylesheet. Mods ship their own layouts the same way: CTF adds a captures counter, Lithium the held tech, Race speed and run counters.

### Under the hood

The renderer was **ported from OpenGL to Metal, Vulkan, and Direct3D 12** via SDL3's GPU API and our new [ObjectivelyGPU](https://github.com/jdolan/ObjectivelyGPU) library, and it's faster than the old one on the same hardware. glib is gone, replaced by [Objectively 2](https://github.com/jdolan/Objectively) collections, and [ObjectivelyMVC](https://github.com/jdolan/ObjectivelyMVC) renders through ObjectivelyGPU on every platform. All three libraries build for iOS and Android. We are not announcing a mobile port, but for the first time, nothing in the stack prevents one.

Cvars and commands were renamed to camelCase. The old names still resolve, and your key binds are rewritten to the new names once, so your config keeps working.

{{< placeholder type="image" id="B20" caption="The console showing the renderer's Metal or Vulkan driver line, or Quetoo running on a Mac and on Linux side by side." >}}

### Tools for model authors

Two new scripts ship in `src/tools`: **md3fu** previews animated MD3 player models, and **tintfu** builds the tintmaps that make a skin tintable and draws UV wireframes for checking them.

{{< placeholder type="image" id="B21" caption="tintfu output: a player skin beside its generated tintmap and UV wireframe." >}}

### For server admins

**Update your servers.** Protocol 2029 (v1.0.70+) is required to be listed on the master, and the master handshake now uses challenge-response authentication. Linux packages are split into **`quetoo-client`** and **`quetoo-server`** for Debian and Red Hat, so a VPS install pulls no graphics libraries, and **arm64 Linux** tarballs are published alongside x86_64. Public servers report frags to [giblets.quetoo.org](https://giblets.quetoo.org), which feeds the [leaderboard](/stats/). Set `sv_statsUrl` to `0` to opt out.

## Everything else

A hardening sweep closed roughly forty bounds-check, overflow, and input-validation issues in network and BSP parsing. Startup crashes on older NVIDIA drivers are fixed. Screenshots and demos are auto-named with the map and timestamp. There are `^8` orange and `^9` grey color codes for your name. Your default player name is no longer your OS username.

## Thank you

To everyone who filed a bug, tested a snapshot build, joined a pickup game on Discord, or shipped a map: this is your update too. Special thanks to Skies912 for Miner Difficulty and the remakes in flight, to MovoWR, whose jump mod is the reason Race exists, to the ioQuake3 and DeFrag communities for the player models, and to my wife, for lending the arena her voice.

See you in the arena. 🚩

- **Downloads:** [quetoo.org/downloads](https://quetoo.org/downloads)
- **Discord:** [discord.gg/unb9U4b](https://discord.gg/unb9U4b)
- **GitHub:** [github.com/jdolan/quetoo](https://github.com/jdolan/quetoo)
- **Release notes:** [Quetoo](https://github.com/jdolan/quetoo/releases) · [Quetoo Data](https://github.com/jdolan/quetoo-data/releases) · [Objectively](https://github.com/jdolan/Objectively/releases) · [ObjectivelyGPU](https://github.com/jdolan/ObjectivelyGPU/releases) · [ObjectivelyMVC](https://github.com/jdolan/ObjectivelyMVC/releases)

</div>
