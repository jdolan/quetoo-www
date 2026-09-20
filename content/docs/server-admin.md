---
title: "Server Administration"
weight: 20
---

This page covers how to set up and run a dedicated Quetoo server on Debian or Fedora Linux.

## Installation

Download `quetoo` and `quetoo-data` packages from their respective Releases pages and install them together:

```sh
# Debian / Ubuntu
sudo apt install ./quetoo-x86_64-pc-linux.deb ./quetoo-data_*.deb

# Fedora / RHEL
sudo dnf install quetoo-x86_64-pc-linux.rpm quetoo-data-*.rpm
```

- Engine packages: [github.com/jdolan/quetoo/releases](https://github.com/jdolan/quetoo/releases)
- Data packages: [github.com/jdolan/quetoo-data/releases](https://github.com/jdolan/quetoo-data/releases)

`quetoo` and `quetoo-data` have independent release cycles — install the latest of each.

---

## Service Management

The `quetoo` package installs a systemd template unit `quetoo-dedicated@.service` and a default instance configuration at `/etc/quetoo-dedicated/default.cfg`.

Each `.cfg` file in `/etc/quetoo-dedicated/` represents one server instance. Lines are in Quake console format and are passed directly as `+set key value` arguments to `quetoo-dedicated`. Blank lines and lines beginning with `//` or `#` are ignored.

Edit the default instance configuration to suit your server:

```
// /etc/quetoo-dedicated/default.cfg
set net_port 1998
set sv_hostname "My Quetoo Server"
set sv_public 1
set rcon_password "secret"
set g_fragLimit 30
set g_timeLimit 20
```

Enable and start the default instance:

```sh
sudo systemctl enable --now quetoo-dedicated@default
```

Manage the service:

```sh
sudo systemctl start   quetoo-dedicated@default
sudo systemctl stop    quetoo-dedicated@default
sudo systemctl restart quetoo-dedicated@default
sudo systemctl status  quetoo-dedicated@default
```

### Multiple Instances

To run multiple server instances, create a `.cfg` file per instance and enable each one:

```sh
# Create a CTF instance on port 1999
sudo cp /etc/quetoo-dedicated/default.cfg /etc/quetoo-dedicated/ctf.cfg
# Edit /etc/quetoo-dedicated/ctf.cfg: set net_port 1999, game ctf, etc.
sudo systemctl enable --now quetoo-dedicated@ctf
```

Each instance is managed independently. A typical three-server VPS might have `default.cfg` (FFA, port 1998), `ctf.cfg` (CTF, port 1999), and `instagib.cfg` (Instagib, port 2000).

### Attaching to the Console

Each dedicated server instance runs inside a named `screen` session. The `quetoo-attach` command lets any `sudo`-capable user attach to the live server console:

```sh
quetoo-attach           # attaches to the "default" instance
quetoo-attach ctf       # attaches to the "ctf" instance
```

Detach with **Ctrl-A D** without stopping the server.

---

## Updates

`quetoo-update` fetches the latest release versions of `quetoo` and `quetoo-data` from GitHub independently, installs any that are out of date, and restarts all running instances.

Run it manually to update immediately:

```sh
sudo quetoo-update
```

For automatic updates, add it to root's crontab with `--wait-for-empty`. The server will update within 15 minutes of a new release, but only once all human players have disconnected:

```sh
sudo crontab -e
```

```
*/15 * * * * /usr/bin/quetoo-update --wait-for-empty >> /var/log/quetoo-update.log 2>&1
```

---

## Running a Dedicated Server

Quetoo ships with a `quetoo-dedicated` binary for headless server operation. You can also launch it directly from the command line:

```bash
quetoo-dedicated +set sv_hostname "My Server" +map edge
```

You can pass any cvar as a `+set key value` argument at startup, and any command (like `map`) with `+command`.

### Minimal Startup Example

```bash
quetoo-dedicated \
  +set sv_hostname "Fragfest" \
  +set sv_maxClients 16 \
  +set sv_public 1 \
  +set g_fragLimit 30 \
  +set g_timeLimit 20 \
  +map edge
```

---

## Key Server Cvars

### Network

| Cvar | Default | Description |
|------|---------|-------------|
| `net_port` | `1998` | UDP port the server listens on |
| `sv_hostname` | `Quetoo` | Server name shown in the browser |
| `sv_public` | `0` | Set to `1` to advertise on the master server |

### Capacity

| Cvar | Default | Description |
|------|---------|-------------|
| `sv_maxClients` | `64` | Maximum simultaneous players |
| `sv_minClients` | `0` | Minimum total clients (human + bot); see [Bots](#bots) |
| `sv_maxEntities` | `1024` | Maximum entities; rarely needs changing |
| `sv_timeout` | `20` | Client connection timeout in seconds |

### Security

| Cvar | Default | Description |
|------|---------|-------------|
| `rcon_password` | *(empty)* | Password for remote console access (`rcon`). Set this to allow trusted admins to run server commands remotely. |
| `g_adminPassword` | *(empty)* | In-game admin password (set with `admin <password>`) |

### Game Modules

Some modes are a separate game module rather than a cvar. A module is selected with a `game`
line in the instance `.cfg`, which the wrapper passes as `+game <name>`:

```
game ctf
```

Quetoo ships `default`, `ctf`, `lithium` and `race`. A module brings its own maps, rules and
cvars, so `g_captureLimit` below only applies under `ctf`.

### Game Rules

| Cvar | Default | Description |
|------|---------|-------------|
| `g_fragLimit` | `30` | Frags needed to win the level |
| `g_timeLimit` | `20` | Minutes per level |
| `g_captureLimit` | `8` | Flag captures to win (CTF) |
| `g_gameplay` | `default` | Game variant: `default`, `deathmatch`, `instagib` or `arena`. Prefix with `team_` for team play, e.g. `team_deathmatch`. `default` defers to whatever the level asks for |
| `g_numTeams` | `default` | Number of teams (auto-detected by default) |
| `g_autoJoin` | `1` | Automatically assign players to teams |
| `g_weaponStay` | `0` | Weapons stay after pickup instead of respawning |
| `g_respawnProtection` | `0` | Spawn protection duration in seconds |
| `g_spawnFarthest` | `1` | Spawn players as far as possible from enemies |
| `g_ammoRespawnTime` | `20.0` | Ammo respawn interval in seconds |
| `g_weaponRespawnTime` | `5` | Weapon respawn interval in seconds |

---

## Bots

Quetoo has a built-in bot system that provides real opposition when human players aren't around. Bots are especially useful for **server seeding** — an empty server rarely attracts players, but a server with a few active bots is much more likely to draw people in.

### sv_minClients

`sv_minClients` sets the minimum total number of clients (human + bot) the server will maintain. The game automatically adds bots to meet this floor, and removes them one-by-one as real players join, keeping the total at `sv_minClients` until all bots are gone.

```
// Keep at least 4 clients in the game at all times
set sv_minClients 4
```

When the last human disconnects, bots fill back up to `sv_minClients` within a few seconds. `sv_minClients` is capped by `sv_maxClients`, so you never need to worry about them conflicting.

A typical seeding configuration for a public server:

```
// /etc/quetoo-dedicated/default.cfg
set sv_hostname "My Quetoo Server"
set sv_public 1
set sv_maxClients 16
set sv_minClients 4   // always 4 players in the game
set g_fragLimit 30
set g_timeLimit 20
```

---

## Map Rotation

The server cycles through maps in rotation order when the frag limit or time limit is reached. The rotation is defined by a map list file — by default `maps.lst` from the game data.

### Copying the Default maps.lst

The installed game data includes a default `maps.lst` at:

```
/usr/lib/quetoo/share/quetoo/default/maps.lst
```

To customize the rotation, copy it to the server's user data directory and edit it there:

```sh
sudo -u quetoo mkdir -p /var/lib/quetoo/.local/share/WickedOldGames/Quetoo/default
sudo -u quetoo cp /usr/lib/quetoo/share/quetoo/default/maps.lst \
    /var/lib/quetoo/.local/share/WickedOldGames/Quetoo/default/my-rotation.lst
```

The user data directory takes precedence over the installed data, so your copy will be used without modifying the system files.

### Pointing the Server at Your Custom List

In `/etc/quetoo-dedicated/default.cfg`, add:

```
set sv_mapList my-rotation.lst
```

The filename is resolved from the `default/` game directory — no path prefix needed.

### maps.lst Format

Each map is an entry enclosed in `{ }`. Only `name` is required; all other fields are optional and override the corresponding server cvar for that map only.

```
{
    name edge
}
{
    name aerowalk
    gameplay instagib
}
{
    name lavatomb
    min_clients 4
}
{
    name pits
    teams 1
    num_teams 2
    hook 0
    gravity 600.0
    music quetoo/the_pits
}
```

**Supported fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Map filename (required) |
| `gameplay` | string | `default`, `instagib`, or `arena` |
| `teams` | int | `1` to enable Team Deathmatch |
| `num_teams` | int | Number of teams (overrides auto-detect) |
| `ctf` | int | `1` to enable Capture the Flag |
| `hook` | int | `1` to enable grappling hook, `0` to disable |
| `gravity` | float | World gravity (default `800.0`) |
| `min_clients` | int | Skip this map unless at least this many clients are connected |
| `music` | string | Music track to play on this map |

### Using min_clients to Skip Maps

The `min_clients` field lets you exclude large or team-oriented maps when the server is lightly populated. For example, a server seeded with bots might want to skip big CTF maps until real players show up:

```
{
    name warehouse
    min_clients 6
}
{
    name chthon
    teams 1
    ctf 1
    min_clients 8
}
```

When the rotation reaches a map whose `min_clients` threshold isn't met, the server automatically advances to the next eligible map.

### Advancing the Map Manually

From the server console or via `rcon`:

```
map edge
```

---

## Remote Console (rcon)

If `rcon_password` is set, admins can run commands remotely from a Quetoo client:

```
rcon_password mypassword
rcon map edge
rcon status
```

---

## Firewall / Port Forwarding

Quetoo uses **UDP port 1998** by default. Open this port in your firewall and forward it on your router if hosting from a home network.

To list your server on the public master server, set:

```
+set sv_public 1
```

---

## Getting Help

Join the [Discord](https://discord.gg/unb9U4b) `#development` channel for help running a server.
