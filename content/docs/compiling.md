---
title: "Compiling"
weight: 50
---

Compiling Quetoo from source is recommended for developers and mappers who want to build against the latest code. The engine builds on macOS, Linux, BSD, and Windows.

---

## Dependencies

Most dependencies are fetched automatically by the build system. The following are required regardless of platform:

| Library | Notes |
|---------|-------|
| [Objectively](https://github.com/jdolan/Objectively/) | Object-oriented C runtime |
| [ObjectivelyMVC](https://github.com/jdolan/ObjectivelyMVC/) | UI framework |
| [PhysicsFS](https://icculus.org/physfs/) | Virtual filesystem |
| [OpenAL](https://www.openal.org/) | 3D audio |
| [libsndfile](http://mega-nerd.com/libsndfile/) | Audio format loading |
| [glib2](https://developer.gnome.org/glib/) | Utility library |
| [ncurses](https://www.gnu.org/software/ncurses/) | Server console |
| [SDL2](https://libsdl.org/) | Window, input, and GL context |

---

## Building

### Linux / BSD — GNU Autotools

Install dependencies with your package manager, then:

```bash
git clone https://github.com/jdolan/quetoo.git
cd quetoo
autoreconf -i
./configure
make -j$(nproc)
sudo make install
```

To also build the unit test suite:

```bash
./configure --with-tests
make -j$(nproc)
make check
```

---

### macOS — GNU Autotools

Install [Homebrew](https://brew.sh), then install dependencies:

```bash
brew install autoconf automake libtool pkg-config \
     glib physfs libsndfile openal-soft sdl2
```

Clone and build Objectively and ObjectivelyMVC as siblings of the quetoo repository:

```bash
# All three repos should be siblings, e.g. ~/Coding/
git clone https://github.com/jdolan/Objectively.git
git clone https://github.com/jdolan/ObjectivelyMVC.git
git clone https://github.com/jdolan/quetoo.git
```

Build and install Objectively first, then ObjectivelyMVC, then quetoo — each with:

```bash
autoreconf -i
./configure --with-homebrew=/opt/homebrew
make -j$(nproc)
sudo make install
```

---

### macOS — Xcode

Xcode is the recommended development environment on macOS. Objectively, ObjectivelyMVC, and Quetoo must be cloned as siblings:

```
~/Coding/
  Objectively/
  ObjectivelyMVC/
  quetoo/
```

Open `quetoo/Quetoo.xcworkspace` — this workspace includes all three projects and manages their dependencies automatically. Select the **Quetoo** scheme and press **⌘B** to build.

> **Note:** Homebrew dependencies (glib, PhysFS, SDL2, etc.) must still be installed via `brew install` as described above. The Xcode workspace does not install them.

---

### Windows — Visual Studio

The Visual Studio solution uses **Clang-CL** as its compiler and targets Windows 10 x64. Visual Studio 2019 or later is required with the **Desktop development with C++** workload and the **Clang compiler for Windows** optional component installed.

#### 1. Clone the repositories

Objectively, ObjectivelyMVC, and quetoo must be cloned as siblings:

```
C:\Projects\
  Objectively\
  ObjectivelyMVC\
  quetoo\
```

#### 2. Set `QUETOO_HOME`

Run `Quetoo.vs15\SET_ENV.ps1` in PowerShell to set the `QUETOO_HOME` environment variable to your Quetoo installation directory (the folder that will contain `bin\`, `share\`, etc.):

```powershell
.\Quetoo.vs15\SET_ENV.ps1
```

#### 3. Link game data

Run `Quetoo.vs15\MAKE_DATA_JUNCTION.ps1` to create a directory junction from `%QUETOO_HOME%\share\default` to your `quetoo-data\target\default` checkout:

```powershell
.\Quetoo.vs15\MAKE_DATA_JUNCTION.ps1
```

#### 4. Open the solution and build

Open `Quetoo.vs15\quetoo_all.sln` in Visual Studio. Select the **Release | x64** configuration and build the solution (**⌃⇧B** / **Ctrl+Shift+B**).

After building, run `Quetoo.vs15\COPY_DEPENDENCIES.bat` to copy required DLLs (SDL2, glib, OpenAL, etc.) into the output directory:

```bat
COPY_DEPENDENCIES.bat quetoo x64 Release
```

---

## Installing Game Data

The engine requires game data from the [quetoo-data](https://github.com/jdolan/quetoo-data) repository. On first launch the client will attempt to download data automatically; for offline development, install it manually:

**Linux / macOS / BSD:**
```bash
git clone https://github.com/jdolan/quetoo-data.git
sudo ln -s $(pwd)/quetoo-data/target /usr/local/share/quetoo
```

**Windows:** Use the `MAKE_DATA_JUNCTION.ps1` script described above.

---

## Licensing

Quetoo is licensed under the [GNU General Public License v2](https://opensource.org/licenses/GPL-2.0). You are free to download, play, and modify the game. All source code is available on [GitHub](https://github.com/jdolan/quetoo).
