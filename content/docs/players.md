---
title: "Playing Quetoo"
description: "Default controls, voice chat setup, game modes, and core mechanics for Quetoo."
weight: 10
---

Quetoo is a fast-paced, arena-style first-person shooter. This page covers the default controls, voice chat setup, available game modes, and core mechanics.

## Default Controls

Controls can be rebound in-game from the **Controls** settings menu.

### Movement

| Key | Action |
|-----|--------|
| `W` | Move forward |
| `S` | Move backward |
| `A` | Strafe left |
| `D` | Strafe right |
| `Space` | Jump |
| `C` | Crouch |

### Combat

| Key | Action |
|-----|--------|
| `Left Mouse Button` | Fire / Attack |
| `Right Mouse Button` | Zoom (scoped weapons) |
| `Mouse Wheel` | Cycle weapons |
| `1–9` | Select weapon slot |
| `G` | Throw grenade |

### Communication & UI

| Key | Action |
|-----|--------|
| `T` | Chat (all players) |
| `Y` | Team chat |
| `V` (hold) | Voice chat (all players) |
| `Shift` + `V` (hold) | Team voice chat |
| `Tab` | Show scoreboard |
| `` ` `` (backtick) | Open console |
| `Escape` | Main menu |

---

## Voice Chat

Open **Settings > Sound** to enable **Voice chat**, select your **Capture device**, and choose a **Voice mode**:

- **Push to talk** is the default. Hold `V` to transmit, or change the **Push to talk** binding on the Sound page.
- **Voice activated** transmits automatically when your microphone level crosses the **Activation level** threshold. No talk binding is required. Automatic voice is public in the included game modules.

Automatic transmission only runs while connected to a live game, not during demo playback. Disconnecting, disabling voice chat, or switching back to push-to-talk stops automatic transmission.

### Microphone Setup

The **Microphone level** meter shows raw **Input**, with a line marking the activation threshold, and gain-adjusted **Output**, which turns red near clipping. Both use a logarithmic dBFS scale so quiet microphones are visible.

1. Check that **Input** moves when you speak. If it stays flat, check your selected device, operating system microphone permissions, and any hardware mute switch.
2. For voice activation, set **Activation level** above room noise but below normal speech. Lower values are more sensitive.
3. Adjust **Microphone gain** so **Output** is healthy without turning red. **Auto-level** can boost a quiet microphone. Neither gain nor auto-level changes the raw-input activation threshold.

Menus keep the microphone active for calibration even when you are disconnected. Disconnected calibration never transmits to a server; disabling **Voice chat** stops microphone capture.

Voice activation is a loudness gate, not speech recognition: keyboard clicks, music, and loud background noise can trigger it. It uses a lower closing threshold, about 250 ms of trailing silence, and 60 ms of pre-roll to avoid cutting off the beginnings of words.

### Team Voice

Push-to-talk still forces transmission in voice-activated mode. Hold `Shift` alongside the talk key, or bind `+voiceTeam` to a dedicated team talk key, to override automatic public voice with team-only voice. Automatic detection resumes on fresh audio when you release the key; captured team speech is never replayed publicly.

If `Shift` itself is your talk key, it does not also select team voice. Use the other `Shift` key as the modifier, or use a dedicated team talk binding.

### Console Settings

| Setting | Effect |
|---------|--------|
| `s_voiceMode 0` | Push-to-talk |
| `s_voiceMode 1` | Voice activation |
| `s_voiceThreshold` | Raw microphone RMS threshold; default `0.05`, effective range `0.001` to `0.1` |

---

## Game Modes

### Deathmatch (DM)

Every player for themselves. Frag as many opponents as you can before the frag limit or time limit is reached. The server cvar `g_fragLimit` sets the winning score (default: 30) and `g_timeLimit` sets the time limit in minutes (default: 20).

### Team Deathmatch (TDM)

Two (or more) teams compete for the highest combined frag total. Enabled by setting `g_gameplay team_deathmatch` on the server. `g_numTeams` sets how many teams there are; left at `default` it picks the valid number for the map, or 2. Team assignment is automatic while `g_autoJoin` is set, unless players choose a side manually.

### Capture the Flag (CTF)

Two teams — Red and Blue — each defend their own flag while attempting to capture the enemy's flag and return it to their base. CTF is a separate game module, so the server starts with `+game ctf` on its command line. The `g_captureLimit` cvar controls how many captures are needed to win (default: 8).

### Instagib

Every player has a one-shot railgun. Enabled by setting `g_gameplay instagib` on the server, or `g_gameplay team_instagib` for team play.

### Arena

Players or teams spawn with a full loadout of weapons, ammo and armor. Self-damage is disabled, so you can rocket jump and plasma climb to your heart's content. Last player or team standing wins. Enabled by setting `g_gameplay arena` on the server, or `g_gameplay team_arena` for team play.

---

## Core Mechanics

### Health and Armor

Players start with **100 health**. Health pickups restore health up to 100 (small/medium/large) or briefly boost it above 100 (mega health). Armor absorbs a portion of incoming damage:

- **Jacket Armor** — Green, light protection
- **Combat Armor** — Yellow, medium protection
- **Body Armor** — Red, heavy protection

### Weapons

Quetoo features a classic Quake II-inspired arsenal:

| Weapon | Notes |
|--------|-------|
| Blaster | Starting sidearm, infinite ammo, light damage |
| Shotgun | Close-range spread |
| Super Shotgun | Double-barrel burst |
| Machinegun | Rapid-fire, moderate spread |
| Grenade Launcher | Bouncing grenades |
| Rocket Launcher | High damage, splash radius |
| Hyperblaster | Rapid energy bolts; also enables rocket-jumping style "hyperblaster climbing" |
| Lightning Gun | Short-range but lethal hit-scan beam; careful around water with this one |
| Railgun | Hitscan, high damage, 1.4s refire |
| BFG10K | Area-denial super weapon |

### Movement Mechanics

- **Rocket jumping**: Fire a rocket at your feet while jumping to reach high areas.
- **Hyper climbing**: Fire the hyperblaster slightly downward along a wall to scale it and reach high areas.
- **Strafe jumping**: Combine forward movement with strafing and jumping to build speed.

### Power-Ups

- **Adrenaline**: Instantly boosts your health to 100 (respawns every 30 seconds by default).
- **Megahealth**: Increases your health by 100 (respawns every 30 seconds by default).
- **Quad Damage**: Multiplies your damage output for 30 seconds (respawns every 60 seconds by default).

---

## Connecting to a Server

From the main menu select **Play → Find Servers** to browse the server list. You can also connect directly from the console:

```
connect <ip>:<port>
```

The default server port is **1998**.

---

## User Data Directory

Quetoo stores your configuration, screenshots, and demos in a platform-specific directory:

| Platform | Path |
|----------|------|
| **Windows** | `%APPDATA%\WickedOldGames\Quetoo\default\` |
| **macOS** | `~/Library/Application Support/WickedOldGames/Quetoo/default/` |
| **Linux** | `$XDG_DATA_HOME/WickedOldGames/Quetoo/default/` (usually `~/.local/share/WickedOldGames/Quetoo/default/`) |

Within that directory:

| Subdirectory / File | Contents |
|---------------------|----------|
| `quetoo.cfg` | Key bindings and archived console variables |
| `autoexec.cfg` | Commands run automatically on startup |
| `screenshots/` | Screenshots (press `F12` or type `screenshot` in the console) |
| `demos/` | Recorded demos (`record <name>` / `stop`) |

> **Migrating from an older install:** If you have a legacy `~/.quetoo` directory (POSIX) or `Documents\My Games\Quetoo` (Windows), simply move its contents to the new location before launching Quetoo.

---

## Getting Help

Join the [Discord](https://discord.gg/unb9U4b) to find games, ask questions, and connect with the community.

---
