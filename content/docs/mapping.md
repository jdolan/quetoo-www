---
title: "Mapping Guide"
weight: 30
---

This page covers how to create and compile levels (maps) for Quetoo.

---

## Tools

| Tool | Purpose |
|------|---------|
| [TrenchBroom](https://trenchbroom.github.io/) | Visual level editor for authoring `.map` files |
| `quemap` | Map compiler (ships with Quetoo) |
| In-game editor | Live entity and material editing while the map is running |

---

## Workflow

The typical mapping workflow is:

1. **Author brushwork** in TrenchBroom — build geometry, place entities, set keys
2. **Compile** with `quemap` to produce a `.bsp`
3. **Load and refine** using Quetoo's in-game editor — reposition lights, tweak material properties, add entities — all without leaving the game
4. **Save** back to `.map` and re-compile when brushwork changes are needed

---

## Compiling a Map

Quetoo's BSP compilation is a single stage:

```bash
quemap -bsp maps/mymap.map
```

`quemap` accepts the Quake path of your `.map` file. The `.bsp` is written to the same directory.

### Quick iteration

During brushwork, `-bsp` alone is fast and produces a playable result immediately. For a final build, run the full pipeline:

```bash
quemap -bsp maps/mymap.map
quemap -vis maps/mymap.bsp
quemap -light maps/mymap.bsp
```

`-vis` computes the PVS (Potentially Visible Set) for culling. `-light` bakes static lighting and builds the voxel grid used by the dynamic lighting system.

### Packaging

Package a finished map and its custom assets for distribution:

```bash
quemap -zip maps/mymap.bsp
```

---

## Testing Your Map

Copy (or symlink) your compiled `.bsp` to the `maps/` directory inside your Quetoo game data:

```
~/.quetoo/default/maps/mymap.bsp
```

Then load it from the console (`` ` ``):

```
map mymap
```

---

## The In-Game Editor

Quetoo includes a built-in live editor — something not found in any other Quake-derived engine. It lets you place and modify entities and tweak material properties in real time, with instant visual feedback, without ever leaving the game.

To open the editor, set the `editor` cvar from the console:

```
editor 1
```

The editor panel appears on the right side of the screen. It has two tabs: **Entities** and **Materials**.

---

### Entity Editor

{{< figure src="/images/editor/editor-entities.jpg" alt="In-game entity editor" >}}

The entity editor shows all key/value pairs for the entity you are currently looking at. When you open the editor, the entity closest to your crosshair is automatically selected.

**Selecting entities**

Look at any entity and open the editor — the nearest entity on your line of sight is auto-selected. For lights and other point entities, look directly at the gizmo (the colored bounding box drawn in the world).

**Moving entities**

With the entity panel open and an entity selected, use the standard movement keys to nudge it in world space:

| Key | Action |
|-----|--------|
| `W` / `↑` | Move forward |
| `S` / `↓` | Move backward |
| `A` / `←` | Move left |
| `D` / `→` | Move right |
| `Q` / `PgUp` | Move up |
| `E` / `PgDn` | Move down |

Movement is snapped to the **grid size**, which you can change with keys `1`–`8` (matching Radiant convention: key `1` = 1 unit, `2` = 2, `3` = 4, … `8` = 128). The default grid size is 16 units.

**Creating and deleting entities**

- **Create** — the **Create Entity** button spawns a new `light` entity at your crosshair position, snapped to the grid
- **Delete** — the **Delete Entity** button removes the selected entity (disabled for `worldspawn`)

**Copy / Cut / Paste**

| Shortcut | Action |
|----------|--------|
| `Ctrl+C` | Copy selected entity to clipboard |
| `Ctrl+X` | Cut selected entity |
| `Ctrl+V` | Paste entity at crosshair position |

**Editing key/value pairs**

All key/value pairs for the selected entity are shown as editable fields. Click any value field, type a new value, and press Enter — the change is applied to the live server immediately.

For `light` entities that belong to a team, the shared team properties appear in a second panel below, letting you edit all lights in the team at once.

**Saving**

Click **Save** (or run `save_editor_map` from the console) to write the modified entity data back to the `.map` file on disk. Material changes are saved at the same time via `r_save_materials`.

{{< figure src="/images/editor/editor-lights.jpg" alt="Editing a light entity in-game" >}}

---

### Material Editor

{{< figure src="/images/editor/editor-materials.jpg" alt="In-game material editor" >}}

The **Materials** tab lets you tune surface properties of any material in the map — in real time, with instant visual feedback.

**Selecting a material**

Look at any surface or model and switch to the Materials tab. The material under your crosshair is loaded automatically.

**Editable properties**

| Property | Description |
|----------|-------------|
| **Roughness** | Controls the spread of specular highlights. Higher = more matte. |
| **Hardness** | Sharpness of the specular lobe. |
| **Specularity** | Overall intensity of specular reflections. |
| **Parallax** | Depth of parallax occlusion mapping. |
| **Shadow** | Controls how much this surface receives baked shadows. |
| **Alpha Test** | Threshold for alpha-tested (cutout) transparency. |

All changes are reflected immediately in the renderer. The material is marked dirty and written to its `.mat` file when you click **Save**.

---

## Key Entities

| Classname | Description |
|-----------|-------------|
| `worldspawn` | Root entity. All solid brushes belong here. |
| `info_player_deathmatch` | Deathmatch spawn point. Place multiple. |
| `info_player_team1` / `info_player_team2` | Red / blue team spawns |
| `item_flag_team1` / `item_flag_team2` | CTF flags |
| `light` | Point light. Keys: `radius`, `color`, `intensity`, `style`, `team` |
| `light_sun` | Directional sunlight for outdoor areas |
| `func_door` | Moving door brush entity |
| `func_plat` | Rising platform |
| `func_rotating` | Continuously rotating brush |
| `trigger_teleport` | Teleporter trigger volume |

Items use standard Quake II classnames: `item_health`, `weapon_railgun`, `ammo_slugs`, `item_armor_body`, etc.

---

## Further Reading

- [TrenchBroom documentation](https://trenchbroom.github.io/manual/latest/)
- [Quetoo Discord](https://discord.gg/unb9U4b) `#mapping` channel

