---
title: "Compiling"
weight: 50
---

Compiling Quetoo from source is only recommended for developers modders. The engine builds on macOS, Linux, BSD, and Windows.

---

## Noteworthy Dependencies

Quetoo has a few dependencies you will likely not find in Homebrew or in your package manager:

| Library | Notes |
|---------|-------|
| [Objectively](https://github.com/jdolan/Objectively/) | Object-oriented framework for GNU C |
| [ObjectivelyGPU](https://github.com/jdolan/ObjectivelyGPU/) | Object-oriented graphics library for GNU C and SDL3 |
| [ObjectivelyMVC](https://github.com/jdolan/ObjectivelyMVC/) | Object-oriented user interface library for GNU C and SDL3 |

---

## Linux / BSD

### Install dependencies

On recent Debian / Ubuntu / Mint:

```bash
sudo apt-get update
sudo apt-get install -y \
  build-essential autoconf automake libtool pkg-config check \
  libcurl4-openssl-dev \
  libncurses-dev \
  libopenal-dev \
  libphysfs-dev \
  libsdl3-image-dev libsdl3-ttf-dev \
  libsndfile1-dev
```

### Clone repositories

Clone Objectively, ObjectivelyMVC, quetoo, and quetoo-data as siblings:

```bash
git clone https://github.com/jdolan/Objectively.git
git clone https://github.com/jdolan/ObjectivelyMVC.git
git clone https://github.com/jdolan/quetoo.git
git clone https://github.com/jdolan/quetoo-data.git
```

### Build and install

```bash
for repo in Objectively ObjectivelyMVC quetoo; do
  pushd $repo
  autoreconf -i
  ./configure
  make -j$(nproc) && sudo make install
  popd
done
```

Link the game data into your installation:

```bash
sudo ln -s $(pwd)/quetoo-data/target /usr/local/share/quetoo
```

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

Build and install Objectively, ObjectivelyMVC, and quetoo:

```bash
for repo in Objectively ObjectivelyMVC quetoo; do
  pushd $repo
  autoreconf -i
  ./configure
  make -j$(nproc) && sudo make install
  popd
done
```

Link the game data into your installation:

```bash
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
