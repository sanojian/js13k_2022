/** @format */

class MapManager {
	constructor() {
		this.createMap();
	}

	createMap() {
		let myMap = mapData[g_level % mapData.length].data;
		let w = mapData[g_level % mapData.length].w;
		let h = mapData[g_level % mapData.length].h;

		g_game.doors = {};

		if (g_game.TILE_LAYER_COLLISION) {
			g_game.tileLayer = new TileLayer(vec2(0, 0), vec2(w, h), TILE_SIZE, vec2(1));
			initTileCollision(vec2(w, h));
		}

		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				// floor
				let tld = new TileLayerData(
					levelDefs[g_level % mapData.length].floorTile,
					Math.floor(rand(0, 3)),
					false,
					new Color(1, 1, 1, rand(0.2, 0.4))
				);
				g_game.tileLayer.setData(vec2(x, h - 1 - y), tld);

				let t = myMap[x + y * w];
				if (t) {
					if (t - 1 == g_game.tileNumbers.door) {
						g_game.doors[x + "_" + (h - 1 - y)] = { hp: 3 };
					}

					if (t - 1 == g_game.tileNumbers.vampire) {
						let vamp = new Vampire(vec2(x + 0.75, h - 1 - y + 0.75));
						g_game.enemies.push(vamp);
						continue;
					} else if (t - 1 == g_game.tileNumbers.npc) {
						new Npc(vec2(x + 0.5, h - 1 - y + 0.5), vec2(1));
						continue;
					} else if (t - 1 == g_game.tileNumbers.boxBullets) {
						new AmmoBox(vec2(x + 0.5, h - 1 - y + 0.5), vec2(1), t - 1);
						continue;
					} else if (t - 1 == g_game.tileNumbers.boxShells) {
						new AmmoBox(vec2(x + 0.5, h - 1 - y + 0.5), vec2(1), t - 1);
						continue;
					}
					setTileCollisionData(vec2(x, h - 1 - y), t - 1);
					let tld = new TileLayerData(t - 1, 0, false, new Color(rand(0.8, 1), rand(0.8, 1), rand(0.8, 1)));
					g_game.tileLayer.setData(vec2(x, h - 1 - y), tld);

					// moss
					if (Math.random() < 0.3) {
						g_game.moss.push({
							pos: vec2(x + 0.5, h - 1 - y + 0.5).add(randInCircle(5 / 12)),
							tileIndex: g_game.miniTileNumbers.moss + Math.floor(Math.random() * 4),
							angle: rand(0, Math.PI * 2),
						});
					}
				}
			}
		}

		//g_game.tileLayer.redraw();
	}

	render() {
		g_game.tileLayer.redraw();
	}
}
