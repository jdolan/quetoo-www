---
title: "Downloads"
---

Download the latest release of Quetoo for your platform.

<div class="download-grid">
  <div class="download-card">
    <div class="platform-icon">🍎</div>
    <h3>macOS</h3>
    <p>Apple Silicon bundle with auto-updater.</p>
    <a href="https://github.com/jdolan/quetoo/releases" class="btn btn-primary">Download for macOS</a>
  </div>
  <div class="download-card">
    <div class="platform-icon">🪟</div>
    <h3>Windows</h3>
    <p>64-bit bundle with auto-updater for Windows 10 and later.</p>
    <a href="https://github.com/jdolan/quetoo/releases" class="btn btn-primary">Download for Windows</a>
  </div>
  <div class="download-card">
    <div class="platform-icon">🐧</div>
    <h3>Linux Client</h3>
    <p>x86_64 AppImage bundle with auto-updater. No install required.</p>
    <a href="https://github.com/jdolan/quetoo/releases" class="btn btn-primary">Download for Linux</a>
  </div>
  <div class="download-card">
    <div class="platform-icon">🖥️</div>
    <h3>Linux Server</h3>
    <p>Debian/RPM packages for server operators. Managed by your package manager.</p>
    <a href="https://github.com/jdolan/quetoo/releases" class="btn btn-primary">Linux Server Packages</a>
  </div>
</div>

## Platform Notes

### macOS — `.app` Bundle

The macOS release is a self-contained `.app` bundle. It includes all game data and updates itself automatically on launch via the built-in updater.

Because Quetoo is not signed with an Apple Developer certificate, macOS will block it on first launch. To allow it, right-click the application and select **Open**, then click **Open** again in the dialog that appears.

### Windows — `.zip` Bundle

The Windows release is a `.zip` archive containing the engine, game data, and all required libraries. Extract it anywhere and run `quetoo.exe`. The built-in updater keeps it current automatically on each launch.

Windows SmartScreen may warn on first launch. Click **More info**, then **Run anyway** to proceed.

### Linux Client — AppImage

The Linux client is distributed as an **AppImage** — a single portable executable that requires no installation and runs on any x86_64 distribution. It includes all game data and updates itself automatically via the built-in updater.

```sh
chmod +x quetoo-*.AppImage
./quetoo-*.AppImage
```

### Linux Server — `.deb` / `.rpm` Packages

For dedicated server operators on Debian/Ubuntu or Fedora/RHEL, Quetoo is available as native packages. These are managed by your system's package manager and do **not** use the built-in auto-updater — updates are applied via `apt`/`dnf` in the usual way.

Two packages are required: `quetoo` (the engine) and `quetoo-data` (the game data). Download both from the [Releases](https://github.com/jdolan/quetoo/releases) page and install together:

```sh
# Debian / Ubuntu
apt install ./quetoo_*.deb ./quetoo-data_*.deb

# Fedora / RHEL
dnf install quetoo-*.rpm quetoo-data-*.rpm
```

The `quetoo-data` packages are published on the [quetoo-data Releases](https://github.com/jdolan/quetoo-data/releases) page. Use matching version numbers for both packages.

### Building from Source

Quetoo builds with GNU Autotools on macOS, Linux, and BSD. For details, see the [Documentation](/docs/) page.
