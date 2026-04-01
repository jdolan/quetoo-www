---
title: "Documentation"
---

## Building from Source

Compiling Quetoo is recommended for developers and mappers. The engine builds on macOS, Linux, BSD, and Windows (MinGW cross-compile or Visual Studio).

### Dependencies

- [ObjectivelyMVC](https://github.com/jdolan/ObjectivelyMVC/)
- [PhysicsFS](https://icculus.org/physfs/)
- [OpenAL](https://www.openal.org/)
- [libsndfile](http://mega-nerd.com/libsndfile/)
- [glib2](https://developer.gnome.org/glib/)
- [ncurses](https://www.gnu.org/software/ncurses/)

### Build Steps

```bash
# Clone the repository
git clone https://github.com/jdolan/quetoo.git
cd quetoo

# Generate build system
autoreconf -i

# Configure and build
./configure
make -j$(nproc)
sudo make install
```

### Installing Game Data

The engine requires game data from a separate repository:

```bash
git clone https://github.com/jdolan/quetoo-data.git
sudo ln -s $(pwd)/quetoo-data/target /usr/local/share/quetoo
```

## Level Editing

Quetoo supports [TrenchBroom](https://trenchbroom.github.io/) for level editing. The map compiler (`quemap`) compiles `.map` files into the BSP format used by the engine:

```bash
quemap -bsp mymap.map    # BSP tree generation
quemap -vis mymap.bsp    # Visibility calculation
quemap -light mymap.bsp  # Lighting and voxel assignment
```

## Licensing

Quetoo is licensed under the [GNU General Public License v2](https://opensource.org/licenses/GPL-2.0). You are free to download, play, and modify the game. All source code is available on [GitHub](https://github.com/jdolan/quetoo).
