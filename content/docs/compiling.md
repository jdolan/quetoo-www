---
title: "Compiling"
weight: 50
---

Compiling Quetoo from source is recommended for developers and mappers who want to build against the latest code. The engine builds on macOS, Linux, BSD, and Windows (MinGW cross-compile or Visual Studio).

---

## Dependencies

| Library | Notes |
|---------|-------|
| [ObjectivelyMVC](https://github.com/jdolan/ObjectivelyMVC/) | UI framework |
| [PhysicsFS](https://icculus.org/physfs/) | Virtual filesystem |
| [OpenAL](https://www.openal.org/) | 3D audio |
| [libsndfile](http://mega-nerd.com/libsndfile/) | Audio format loading |
| [glib2](https://developer.gnome.org/glib/) | Utility library |
| [ncurses](https://www.gnu.org/software/ncurses/) | Server console |
| [SDL2](https://libsdl.org/) | Window, input, and GL context |

---

## Building

```bash
# Clone the repository
git clone https://github.com/jdolan/quetoo.git
cd quetoo

# Generate the build system
autoreconf -i

# Configure and build
./configure
make -j$(nproc)
sudo make install
```

On macOS with Homebrew dependencies in a non-standard prefix:

```bash
./configure --with-homebrew=/opt/homebrew
```

To build with the unit test suite and master server:

```bash
./configure --with-tests --with-master
make -j$(nproc)
make check
```

---

## Installing Game Data

The engine requires game data from a separate repository:

```bash
git clone https://github.com/jdolan/quetoo-data.git
sudo ln -s $(pwd)/quetoo-data/target /usr/local/share/quetoo
```

---

## Licensing

Quetoo is licensed under the [GNU General Public License v2](https://opensource.org/licenses/GPL-2.0). You are free to download, play, and modify the game. All source code is available on [GitHub](https://github.com/jdolan/quetoo).
