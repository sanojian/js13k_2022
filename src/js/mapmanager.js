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

					if (t == tileNumbers_player) {
						g_game.playerSpawn = offsetVec;
						continue;
					} else if (t == tileNumbers_pistol) {
						new Pistol(offsetVec);
						continue;
					} else if (t == tileNumbers_shotgun) {
						new Shotgun(offsetVec);
						continue;
					} else if (t == tileNumbers_rifle) {
						new Rifle(offsetVec);
						continue;
					} else if (t == tileNumbers_beefyZombie) {
						g_game.enemies.push(new BossZombie(offsetVec));
						continue;
					} else if (t == tileNumbers_boxBullets) {
						new AmmoBox(offsetVec, tileNumbers_pistol);
						continue;
					} else if (t == tileNumbers_boxShells) {
						new AmmoBox(offsetVec, tileNumbers_shotgun);
						continue;
					} else if (t == tileNumbers_boxRifleAmmo) {
						new AmmoBox(offsetVec, tileNumbers_rifle);
						continue;
					}

					if (t == tileNumbers_door) {
						g_game.doors[x + "_" + (h - 1 - y)] = { hp: 3 };
					} else {
						// pushers on all collision stuff except doors
						pushers.push(new Pusher(offsetVec, 0.01, 0.5, 1, 0));
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
		let pos = vec2(0);
		for (let x = 0; x < mapData[g_levelDef.map].w; x++) {
			for (let y = 0; y < mapData[g_levelDef.map].h; y++) {
				let dVec = vec2(g_player.pos.x - x - 0.5, g_player.pos.y - y - 0.5);
				pos.x = x + 0.5 + dVec.clampLength(min(1.5, dVec.length())).x;
				pos.y = y + 0.5 + dVec.clampLength(min(1.5, dVec.length())).y;
				let pos2 = tileCollisionRaycast(g_player.pos, pos);
				if (pos2 && !(pos2.x == x + 0.5 && pos2.y == y + 0.5)) {
					let shadow = g_game.shadows[x + "_" + y] || {
						x: x + 0.5,
						y: y + 0.5,
						alpha: 0,
					};
					shadow.alpha = min(1, shadow.alpha + 0.1);

					g_game.shadows[x + "_" + y] = shadow;
					//drawRect(pos, vec2(0.1), new Color(1, 0, 0));
				} else {
					//drawRect(pos, vec2(0.1), new Color(0, 1, 0));
				}
			}
		}

		const shadowSize = vec2(1.05);
		let color = g_game.colorBlack.copy();
		for (let key in g_game.shadows) {
			let shadow = g_game.shadows[key];
			// fade
			shadow.alpha -= 0.01;
			if (shadow.alpha <= 0) {
				delete g_game.shadows[key];
			} else {
				pos.x = shadow.x;
				pos.y = shadow.y;
				color.a = shadow.alpha;
				drawRect(pos, shadowSize, color);
			}
		}
	}

	render() {
		g_game.tileLayer.redraw();
	}
}
