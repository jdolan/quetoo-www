---
title: "Downloads"
description: "Download Quetoo for Linux, macOS, and Windows. Free to download, play, and modify."
---

<div class="download-grid">
  <div class="download-card">
    <div class="platform-icon"><img src="/icons/apple.svg" class="brand-icon" alt="macOS"></div>
    <h3>macOS</h3>
    <p>Apple Silicon <tt>.app</tt> for macOS Sequoia or later.</p>
    <a href="https://github.com/jdolan/quetoo/releases/latest#macos" class="btn btn-primary">Download for macOS</a>
  </div>
  <div class="download-card">
    <div class="platform-icon"><img src="/icons/windows.svg" class="brand-icon" alt="Windows"></div>
    <h3>Windows</h3>
    <p>64-bit <tt>.zip</tt> for Windows 10 or later.</p>
    <a href="https://github.com/jdolan/quetoo/releases/latest#windows-x86-64" class="btn btn-primary">Download for Windows</a>
  </div>
  <div class="download-card">
    <div class="platform-icon"><img src="/icons/linux.svg" class="brand-icon" alt="Linux"></div>
    <h3>Linux Client</h3>
    <p>64-bit <tt>.tgz</tt> compatible with most modern distros.</p>
    <a href="https://github.com/jdolan/quetoo/releases/latest#linux-x86-64" class="btn btn-primary">Download for Linux</a>
  </div>
  <div class="download-card">
    <div class="platform-icon"><img src="/icons/linux.svg" class="brand-icon" alt="Linux Server"></div>
    <h3>Linux Server</h3>
    <p>64-bit packages for <tt>x64</tt> and <tt>arm64</tt> servers.</p>
    <a href="https://github.com/jdolan/quetoo/releases/latest#linux-x86-64" class="btn btn-primary">Linux Server Packages</a>
  </div>
</div>

<div style="text-align: center;">{{< download-counter >}}</div>

## Release Model

Quetoo has a two-tier update model. On each launch, Quetoo checks for and automatically downloads the latest curated game content — maps, textures, and assets — so you're always playing with the current map pool without any manual steps. **Engine binaries** (the executable and game libraries) are not self-updating; re-download from this page periodically to pick up new engine releases. The game will tell you when a new version is available.

## Platform Notes

### macOS — `.app` Bundle

The macOS release is a self-contained `.app` bundle. Drag it to your `Applications` folder and launch it to play.

### Windows — `.zip` Bundle

The Windows release is a `.zip` archive containing everything you need to run the game. Extract it anywhere and run `quetoo.exe`. Windows _SmartScreen_ may warn on first launch. Click **More info**, then **Run anyway** to proceed.

### Linux Client — `.tgz` Bundle

The Linux client is distributed as a tarball. Extract it to a location of your liking and run `./bin/quetoo`.

### Linux Server — `.deb` / `.rpm` Packages

For dedicated server operators on Debian/Ubuntu or Fedora/RHEL, install the `quetoo` and `quetoo-data` packages using your package manager:

```sh
# Debian / Ubuntu
apt install ./quetoo_*.deb ./quetoo-data_*.deb

# Fedora / RHEL
dnf install quetoo-*.rpm quetoo-data-*.rpm
```

### Building from Source

Quetoo builds with GNU Autotools on macOS, Linux, and BSD. For details, see the [Documentation](/docs/) page.
