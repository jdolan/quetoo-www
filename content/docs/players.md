---
title: "Playing Quetoo"
weight: 10
---

Quetoo is a fast-paced, arena-style first-person shooter. This page covers the default controls, available game modes, and core mechanics.

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
| `Tab` | Show scoreboard |
| `` ` `` (backtick) | Open console |
| `Escape` | Main menu |

---

## Game Modes

### Deathmatch (DM)

Every player for themselves. Frag as many opponents as you can before the frag limit or time limit is reached. The server cvar `g_frag_limit` sets the winning score (default: 30) and `g_time_limit` sets the time limit in minutes (default: 20).

### Team Deathmatch (TDM)

Two (or more) teams compete for the highest combined frag total. Enabled by setting `g_teams 1` on the server. Team assignment is automatic unless players choose a side manually.

### Capture the Flag (CTF)

Two teams — Red and Blue — each defend their own flag while attempting to capture the enemy's flag and return it to their base. Enabled by setting `g_ctf 1` on the server. The `g_capture_limit` cvar controls how many captures are needed to win (default: 8).

### Instagib

A variant of Deathmatch or CTF where every player has a one-shot railgun. Enabled by setting `g_gameplay instagib` on the server.

### Arena

A round-based variant. Enabled by setting `g_gameplay arena` on the server.

---

## Core Mechanics

### Health and Armor

Players start with **100 health**. Health pickups restore health up to 100 (small/medium/large) or briefly boost it above 100 (mega health). Armor absorbs a portion of incoming damage:

- **Jacket Armor** — light protection
- **Combat Armor** — medium protection
- **Body Armor** — heavy protection

### Weapons

Quetoo features a classic Quake II-inspired arsenal:

| Weapon | Notes |
|--------|-------|
| Blaster | Starting sidearm, infinite ammo |
| Shotgun | Close-range spread |
| Super Shotgun | Double-barrel burst |
| Machinegun | Rapid-fire, moderate spread |
| Grenade Launcher | Bouncing grenades |
| Rocket Launcher | High damage, splash radius |
| Hyperblaster | Rapid energy bolts; also enables rocket-jumping style "hyperblaster climbing" |
| Lightning Gun | Short-range beam |
| Railgun | Hitscan, high damage, 1.4s refire |
| BFG10K | Area-denial super weapon |

### Movement Mechanics

- **Rocket jumping**: Fire a rocket at your feet while jumping to reach high areas.
- **Strafe jumping**: Combine forward movement with strafing to build speed.
- **Crouch sliding**: Crouch while moving at speed to slide across surfaces.

### Power-Ups

- **Quad Damage**: Multiplies your damage output for 30 seconds (respawns every 60 seconds by default).

---

## Connecting to a Server

From the main menu select **Play → Find Servers** to browse the server list. You can also connect directly from the console:

```
connect <ip>:<port>
```

The default server port is **1998**.

---

## Getting Help

Join the [Discord](https://discord.gg/unb9U4b) to find games, ask questions, and connect with the community.
