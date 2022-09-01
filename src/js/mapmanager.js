/** @format */

class MapManager {
	constructor() {
		this.createMap();
	}

	createMap() {
		let myMap = mapData[g_levelDef.map].data;
		let w = mapData[g_levelDef.map].w;
		let h = mapData[g_levelDef.map].h;

		g_game.doors = {};

		g_game.tileLayer = new TileLayer(vec2(0, 0), vec2(w, h), TILE_SIZE, vec2(1));
		initTileCollision(vec2(w, h));

		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				// floor
				let tld = new TileLayerData(
					g_levelDef.floorTile,
					Math.floor(rand(0, 3)),
					false,
					new Color(1, 1, 1, rand(0.2, 0.4))
				);
				g_game.tileLayer.setData(vec2(x, h - 1 - y), tld);

				let t = myMap[x + y * w];
				if (t) {
					t -= 1;

					let offsetVec = vec2(x + 0.5, h - 1 - y + 0.5);

					if (t == g_game.tileNumbers.player) {
						g_game.playerSpawn = offsetVec;
						continue;
					} else if (t == g_game.tileNumbers.pistol) {
						new Pistol(offsetVec);
						continue;
					} else if (t == g_game.tileNumbers.shotgun) {
						new Shotgun(offsetVec);
						continue;
					} else if (t == g_game.tileNumbers.rifle) {
						new Rifle(offsetVec);
						continue;
					} else if (t == g_game.tileNumbers.beefyZombie) {
						g_game.enemies.push(new BossZombie(offsetVec));
						continue;
					} else if (t == g_game.tileNumbers.boxBullets) {
						new AmmoBox(offsetVec, g_game.tileNumbers.pistol);
						continue;
					} else if (t == g_game.tileNumbers.boxShells) {
						new AmmoBox(offsetVec, g_game.tileNumbers.shotgun);
						continue;
					} else if (t == g_game.tileNumbers.boxRifleAmmo) {
						new AmmoBox(offsetVec, g_game.tileNumbers.rifle);
						continue;
					}

					if (t == g_game.tileNumbers.door) {
						g_game.doors[x + "_" + (h - 1 - y)] = { hp: 3 };
					} else {
						// pushers on all collision stuff except doors
						pushers.push(new Pusher(vec2(x + 0.5, h - 1 - y + 0.5), 0.01, 0.5, 1, 0));
					}

					setTileCollisionData(vec2(x, h - 1 - y), t);
					let tld = new TileLayerData(t, 0, rand(0, 1) < 0.5, new Color(rand(0.8, 1), rand(0.8, 1), rand(0.8, 1)));
					g_game.tileLayer.setData(vec2(x, h - 1 - y), tld);

					// moss
					g_game.moss.push({
						pos: offsetVec.add(randInCircle(5 / 12)),
						tileIndex: g_game.miniTileNumbers.moss + Math.floor(rand(0, 15)),
						angle: rand(0, PI * 2),
					});
				}
			}
		}

		//g_game.tileLayer.redraw();
	}

	// STUPID FOG OF WAR / LINE OF SIGHT
	renderFOW() {
		//const fogSize = 30;
		var pos = vec2(0);
		for (let x = 0; x < mapData[g_levelDef.map].w; x++) {
			for (let y = 0; y < mapData[g_levelDef.map].w; y++) {
				pos.x = x + 0.5;
				pos.y = y + 0.5;
				//pos = screenToWorld(pos);
				if (tileCollisionRaycast(pos, g_game.player.pos)) {
					drawRect(pos, vec2(1), new Color(0, 0, 0));
				}
			}
		}
	}

	render() {
		g_game.tileLayer.redraw();
	}
}
