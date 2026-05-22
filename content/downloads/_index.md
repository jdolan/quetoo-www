---
title: "Downloads"
description: "Download Quetoo for Linux, macOS, and Windows. Free to download, play, and modify."
---

Download the latest release of Quetoo for your platform.

<div class="download-grid">
  <div class="download-card">
    <div class="platform-icon">🍎</div>
    <h3>macOS</h3>
    <p>Apple Silicon bundle with auto-updater for macOS Sequoia or later.</p>
    <a href="https://github.com/jdolan/quetoo/releases/latest#macos" class="btn btn-primary">Download for macOS</a>
  </div>
  <div class="download-card">
    <div class="platform-icon">🪟</div>
    <h3>Windows</h3>
    <p>64-bit bundle with auto-updater for Windows 10 or later.</p>
    <a href="https://github.com/jdolan/quetoo/releases/latest#windows-x86-64" class="btn btn-primary">Download for Windows</a>
  </div>
  <div class="download-card">
    <div class="platform-icon">🐧</div>
    <h3>Linux Client</h3>
    <p><tt>x86_64</tt> bundle with auto-updater compatible with most modern distros.</p>
    <a href="https://github.com/jdolan/quetoo/releases/latest#linux-x86-64" class="btn btn-primary">Download for Linux</a>
  </div>
  <div class="download-card">
    <div class="platform-icon">🖥️</div>
    <h3>Linux Server</h3>
    <p><tt>.deb</tt> and <tt>.rpm</tt> packages for server operators.</p>
    <a href="https://github.com/jdolan/quetoo/releases/latest#linux-x86-64" class="btn btn-primary">Linux Server Packages</a>
  </div>
</div>

## Platform Notes

Quetoo has a two-tier update model. The **built-in updater** runs on every launch and automatically downloads the latest curated game content — maps, textures, and assets — so you're always playing with the current map pool without any manual steps. **Engine binaries** (the executable and game libraries) are not self-updating; re-download from this page periodically to pick up new engine releases. We announce them on the [News](/news/) page.

### macOS — `.app` Bundle

The macOS release is a self-contained `.app` bundle. On every launch, the built-in updater downloads the latest curated game content automatically. Re-download this bundle from the site when a new engine release is announced to pick up binary updates.

### Windows — `.zip` Bundle

The Windows release is a `.zip` archive containing the engine, game modules, and all required libraries. Extract it anywhere and run `quetoo.exe`. On every launch, the built-in updater downloads the latest curated game content automatically. Re-download and re-extract when a new engine release is announced to pick up binary updates.

Windows SmartScreen may warn on first launch. Click **More info**, then **Run anyway** to proceed.

### Linux Client — AppImage

The Linux client is distributed as a tarball. Extract it to a location of your liking and run `./bin/quetoo`. On every launch, the built-in updater downloads the latest curated game content automatically. Re-download and re-extract when a new engine release is announced to pick up binary updates.

### Linux Server — `.deb` / `.rpm` Packages

For dedicated server operators on Debian/Ubuntu or Fedora/RHEL, Quetoo is available as native packages. These are managed by your system's package manager and do **not** use the built-in auto-updater — updates are applied via `apt`/`dnf` in the usual way.

Two packages are required: `quetoo` (the engine) and `quetoo-data` (the game data). Download both from GitHub and install together:

 * [Quetoo Linux Server Releases](https://github.com/jdolan/quetoo/releases/latest#linux-x86-64)
 * [Quetoo Data Releases](https://github.com/jdolan/quetoo-data/releases)

```sh
# Debian / Ubuntu
apt install ./quetoo_*.deb ./quetoo-data_*.deb

# Fedora / RHEL
dnf install quetoo-*.rpm quetoo-data-*.rpm
```

### Building from Source

Quetoo builds with GNU Autotools on macOS, Linux, and BSD. For details, see the [Documentation](/docs/) page.
