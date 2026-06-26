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
| [libsndfile](http://mega-nerd.com/libsndfile/) | Multiformat sound loading |
| [ncurses](https://www.gnu.org/software/ncurses/) | Server console |
| [SDL3](https://libsdl.org/) | Window, input, and GL context |
| [SDL3_image](https://libsdl.org/) | Multiformat image loading |
| [SDL3_ttf](https://libsdl.org/) | TrueType Font rendering |
| [libcheck](https://libcheck.github.io/check/) | Unit testing |

---

## Linux / BSD

Install dependencies with your package manager, then clone and build:

```bash
git clone https://github.com/jdolan/quetoo.git
cd quetoo
autoreconf -i
./configure
make -j$(nproc)
sudo make install
```

Clone the game data and link it into your installation:

```bash
git clone https://github.com/jdolan/quetoo-data.git
sudo ln -s $(pwd)/quetoo-data/target /usr/local/share/quetoo
```

---

## macOS — Xcode

Xcode is the recommended development environment on macOS. Install [Homebrew](https://brew.sh), then install the required dependencies:

```bash
brew install autoconf automake check libtool pkg-config \
  libsndfile ncurses openal-soft physfs sdl3_image sdl3_ttf
```

Clone Objectively, ObjectivelyMVC, quetoo, and quetoo-data as siblings (the workspace requires this layout):

```bash
git clone https://github.com/jdolan/Objectively.git
git clone https://github.com/jdolan/ObjectivelyMVC.git
git clone https://github.com/jdolan/quetoo.git
git clone https://github.com/jdolan/quetoo-data.git
```

Link the game data into your installation:

```bash
sudo ln -s $(pwd)/quetoo-data/target /usr/local/share/quetoo
```

Open `quetoo/Quetoo.xcworkspace` — this workspace includes all three projects and manages their dependencies automatically. Select the **Quetoo** scheme and press **⌘B** to build.

---

## macOS — GNU Autotools

Install [Homebrew](https://brew.sh), then install the required dependencies:

```bash
brew install autoconf automake check libtool pkg-config \
  libsndfile ncurses openal-soft physfs sdl3_image sdl3_ttf
```

Clone Objectively, ObjectivelyMVC, quetoo, and quetoo-data as siblings:

```bash
git clone https://github.com/jdolan/Objectively.git
git clone https://github.com/jdolan/ObjectivelyMVC.git
git clone https://github.com/jdolan/quetoo.git
git clone https://github.com/jdolan/quetoo-data.git
```

Build and install Objectively, then ObjectivelyMVC, then quetoo — each with:

```bash
autoreconf -i
./configure
make -j$(nproc)
sudo make install
```

> **Intel Macs:** Homebrew installs to `/usr/local` rather than `/opt/homebrew`. Pass `--with-homebrew=/usr/local` to `./configure` on those machines.

Link the game data into your installation:

```bash
sudo ln -s $(pwd)/quetoo-data/target /usr/local/share/quetoo
```

---

## Windows — Visual Studio

The Visual Studio solution uses **Clang-CL** as its compiler and targets Windows 10 x64. Visual Studio 2019 or later is required with the **Desktop development with C++** workload and the **Clang compiler for Windows** optional component installed.

#### 1. Clone the repositories

Clone Objectively, ObjectivelyMVC, quetoo, and quetoo-data as siblings:

```powershell
git clone https://github.com/jdolan/Objectively.git
git clone https://github.com/jdolan/ObjectivelyMVC.git
git clone https://github.com/jdolan/quetoo.git
git clone https://github.com/jdolan/quetoo-data.git
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

#### 4. Build the solution

Open `Quetoo.vs15\quetoo_all.sln` in Visual Studio. Select the **Release | x64** configuration and build the solution (**Ctrl+Shift+B**).

After building, run `Quetoo.vs15\COPY_DEPENDENCIES.bat` to copy required DLLs into the output directory:

```bat
COPY_DEPENDENCIES.bat quetoo x64 Release
```
