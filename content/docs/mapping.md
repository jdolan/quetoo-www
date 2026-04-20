---
title: "Mapping Guide"
weight: 30
---

This page covers how to create and compile levels (maps) for Quetoo.

## Overview

Quetoo uses the [Quake II BSP](https://www.flipcode.com/archives/Quake_II_BSP_File_Format.htm) format, extended with additional lumps for voxel-based clustered lighting and dynamic lights. Maps are authored in `.map` format (text) and compiled to `.bsp` format (binary) using the `quemap` tool.

The recommended editor is [TrenchBroom](https://trenchbroom.github.io/).

---

## Tools

| Tool | Purpose |
|------|---------|
| [TrenchBroom](https://trenchbroom.github.io/) | Visual level editor |
| `quemap` | Map compiler (ships with Quetoo) |

---

## The .map Format

Quetoo uses the standard Quake/Quake II `.map` text format. A map file consists of **entities**, each of which has **key/value pairs** and zero or more **brushes** (convex polyhedra that define solid geometry).

```
// World entity — always the first entity
{
"classname" "worldspawn"
"message" "My Map"
// Brushes follow...
{
( -64 -64 -16 ) ( -64 63 -16 ) ( -64 -64 -15 ) CLIP 0 0 0 1 1
...
}
}

// A spawn point
{
"classname" "info_player_deathmatch"
"origin" "0 0 24"
}
```

---

## Key Entities

### Required

| Classname | Description |
|-----------|-------------|
| `worldspawn` | Root entity. All solid brushes belong here. Set `message` for the map title. |
| `info_player_deathmatch` | Player spawn point for deathmatch. Place multiple. |

### Lighting

| Classname | Description |
|-----------|-------------|
| `light` | Point light. Key `light` sets brightness. |
| `light_spot` | Spot light. Keys `light`, `angle`, `cone`. |
| `light_sun` | Directional sun light. Sets ambient sky lighting. |

### Team / CTF

| Classname | Description |
|-----------|-------------|
| `info_player_team1` | Red team spawn |
| `info_player_team2` | Blue team spawn |
| `item_flag_team1` | Red team flag |
| `item_flag_team2` | Blue team flag |

### Items and Weapons

Items use standard Quake II classnames, e.g. `item_health`, `weapon_railgun`, `ammo_slugs`, `item_armor_body`. Place these around the map to give players pickup opportunities.

### Geometry Helpers

| Classname | Description |
|-----------|-------------|
| `func_door` | Moving door brush entity |
| `func_plat` | Rising platform |
| `func_rotating` | Continuously rotating brush |
| `trigger_teleport` | Teleporter trigger volume |

---

## Compiling a Map

Map compilation happens in three sequential stages. Run all three for a fully lit, playable BSP.

### Stage 1: BSP

Converts the `.map` file into a `.bsp` file with geometry and BSP tree.

```bash
quemap -bsp maps/mymap.map
```

The output `.bsp` is playable but unlit (fullbright).

### Stage 2: Visibility (VIS)

Calculates the Potentially Visible Set (PVS) — which areas of the map can see which other areas. This enables culling on both the server and renderer side.

```bash
quemap -vis maps/mymap.bsp
```

This can take several minutes for large or complex maps.

### Stage 3: Lighting

Bakes static lightmaps, computes bounce lighting, and generates the voxel grid used for dynamic (runtime) clustered lighting.

```bash
quemap -light maps/mymap.bsp
```

### Full Compile Pipeline

```bash
quemap -bsp maps/mymap.map && \
quemap -vis maps/mymap.bsp && \
quemap -light maps/mymap.bsp
```

### Packaging

Once compiled, package the BSP and any custom assets into a ZIP for distribution:

```bash
quemap -zip maps/mymap.bsp
```

---

## Testing Your Map

1. Copy (or symlink) your compiled `.bsp` to the `maps/` directory inside your Quetoo game data:
   ```
   ~/.quetoo/default/maps/mymap.bsp
   ```

2. Launch Quetoo and open the console (`` ` ``):
   ```
   map mymap
   ```

3. Iterate: edit in TrenchBroom → recompile → reload.

For rapid iteration during brushwork, skip `-vis` and `-light` (just run `-bsp`) to keep compile times fast. Run the full pipeline for final testing.

---

## Lighting Tips

- Place `light` entities generously — well-lit maps play better.
- Use `light_sun` for outdoor areas to get directional sunlight and sky ambient.
- The `-light` stage bakes bounce lighting; increase the `bounce` key on a `light_env` for richer indirect light.
- Dynamic lights (from explosions, weapon muzzle flashes, etc.) use the voxel grid built during `-light`. Voxel coverage depends on where you place geometry.

---

## Further Reading

- [TrenchBroom documentation](https://trenchbroom.github.io/manual/latest/)
- Quake II entity reference (most classnames are compatible)
- [Quetoo Discord](https://discord.gg/unb9U4b) `#mapping` channel for help
