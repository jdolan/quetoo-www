---
title: "Compiling"
weight: 50
---

Compiling Quetoo from source is only recommended for developers, modders, or people porting Quetoo to other platforms. The engine currently builds on macOS, Linux, BSD, and Windows. Support for iOS and Android is in the works.

---

## Noteworthy Dependencies

Quetoo has a few dependencies you must not install from your package manager. They are sibling projects of Quetoo, updated frequently, and compile readily on all of our supported platforms:

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

Clone Objectively, ObjectivelyGPU, ObjectivelyMVC, quetoo, and quetoo-data as siblings:

```bash
git clone https://github.com/jdolan/Objectively.git
git clone https://github.com/jdolan/ObjectivelyGPU.git
git clone https://github.com/jdolan/ObjectivelyMVC.git
git clone https://github.com/jdolan/quetoo.git
git clone https://github.com/jdolan/quetoo-data.git
```

### Build and install

```bash
for repo in Objectively ObjectivelyGPU ObjectivelyMVC quetoo; do
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

Clone Objectively, ObjectivelyGPU, ObjectivelyMVC, quetoo, and quetoo-data as siblings:

```bash
git clone https://github.com/jdolan/Objectively.git
git clone https://github.com/jdolan/ObjectivelyGPU.git
git clone https://github.com/jdolan/ObjectivelyMVC.git
git clone https://github.com/jdolan/quetoo.git
git clone https://github.com/jdolan/quetoo-data.git
```

Build and install Objectively, ObjectivelyGPU, ObjectivelyMVC, and quetoo:

```bash
for repo in Objectively ObjectivelyGPU ObjectivelyMVC quetoo; do
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

Clone Objectively, ObjectivelyGPU, ObjectivelyMVC, quetoo, and quetoo-data as siblings (the workspace requires this layout):

```bash
git clone https://github.com/jdolan/Objectively.git
git clone https://github.com/jdolan/ObjectivelyGPU.git
git clone https://github.com/jdolan/ObjectivelyMVC.git
git clone https://github.com/jdolan/quetoo.git
git clone https://github.com/jdolan/quetoo-data.git
```

Link the game data into your installation:

```bash
sudo ln -s $(pwd)/quetoo-data/target /usr/local/share/quetoo
```

In Xcode's `Settings → Locations -> Custom Paths`, set `WORKSPACE_PREFIX` to the parent directory containing all of the repos you just cloned. Set `HOMEBREW_PREFIX` to your Homebrew prefix.

```
WORKSPACE_PREFIX=/Users/dingus/Coding
HOMEBREW_PREFIX=/opt/homebrew
```

Open `quetoo/Quetoo.xcworkspace` — this workspace includes all three projects and manages their dependencies automatically. Select the **quetoo-all** scheme and build.

---

## Windows — Visual Studio

The Visual Studio solution uses **Clang-CL** as its compiler and targets Windows 10 x64. Visual Studio 2019 or later is required with the **Desktop development with C++** workload and the **Clang compiler for Windows** optional component installed.

#### 1. Clone the repositories

Clone Objectively, ObjectivelyMVC, quetoo, and quetoo-data as siblings:

```powershell
git clone https://github.com/jdolan/Objectively.git
git clone https://github.com/jdolan/ObjectivelyGPU.git
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

---

## Disabling Updates

A build from source has updates disabled already, since `configure` leaves the
version unset. To pin a release build instead, pass `+set version -1`:

```
quetoo +set version -1
```
