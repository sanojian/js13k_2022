/** @format */

var tileLayer;
var playerSpawn;

class MapManager {
	constructor() {
		this.createMap();
	}

	createMap() {
		let theMap = mapData[g_levelDef.map];
		let w = theMap.w;
		let h = theMap.h;

		g_doors = {};

		// TileLayer is an EngineObject and will render with the other engineObjects (and respect renderOrder if given)
		tileLayer = new TileLayer(vec2(0), vec2(w, h), TILE_SIZE);
		initTileCollision(vec2(w, h));

		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				// floor
				let floorTile = new TileLayerData(
					tileNumbers_floorStone,
					randInt(4),
					false,
					new Color(1, 1, 1, rand(0.2, 0.5))
				);
				tileLayer.setData(vec2(x, h - 1 - y), floorTile);

				let t = theMap.data[x + y * w];
				if (t) {
					t -= 1;

					let offsetVec = vec2(x + 0.5, h - 1 - y + 0.5);

					if (t == tileNumbers_player) {
						playerSpawn = offsetVec;
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
					} else if (t == tileNumbers_smg) {
						new MachinePistol(offsetVec);
						continue;
					} else if (t == tileNumbers_bossPlaceholder) {
						g_enemies.push(new BossZombie(offsetVec));
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
						g_doors[x + "_" + (h - 1 - y)] = { hp: 3 };
					} else {
						// pushers on all collision stuff except doors
						pushers.push(new Pusher(offsetVec, 0.02, 0.7, 1.05, 0, PushTo.ALL));

						// moss (not on doors)
						g_moss.push({
							pos: offsetVec.add(randInCircle(5 / 12)),
							tileIndex: miniTileNumbers_moss + randInt(11),
							angle: rand(PI * 2),
						});
					}

					setTileCollisionData(vec2(x, h - 1 - y), t);
					/*let tint = new Color(rand(0.8, 1), rand(0.8, 1), rand(0.8, 1));
					if (g_level % 2 == 0) {
						// brown houses
						tint = tint.add(new Color(217 / 255, 160 / 255, 102 / 255));
					}
					if (g_level % mapData.length == 2 || g_level % mapData.length == 3) {
						// swap wall and roof tiles
						if (t == 9) t = 13;
						else if (t == 13) t = 9;
						else if (t == 14) t = 24;
						else if (t == 24) t = 14;
					}*/
					// roofs and hedgdetops
					try {
						if ((t == 14 || t == 9) && t == theMap.data[x + (y + 1) * w] - 1) {
							t = t == 14 ? 24 : 13;
						}
					} catch (ex) {} // off edge of map

					let tld = new TileLayerData(t, 0, t == 24 ? false : rand() < 0.5);
					tileLayer.setData(vec2(x, h - 1 - y), tld);
				}
			}
		}

		// Draw the whole tilemap to the offscreen buffer
		tileLayer.redraw();
	}

	render() {
		tileLayer.renderNow();
	}

	// STUPID FOG OF WAR / LINE OF SIGHT
	renderFOW() {
		let theMap = mapData[g_levelDef.map];

		let pos = vec2(0);
		for (let x = 0; x < theMap.w; x++) {
			for (let y = 0; y < theMap.h; y++) {
				let cx = x + 0.5;
				let cy = y + 0.5;
				// check if this tile is onscreen
				if (
					abs(cx - cameraPos.x) - 1 > overlayCanvas.width / (cameraScale * 2) ||
					abs(cy - cameraPos.y) - 1 > overlayCanvas.height / (cameraScale * 2)
				) {
					continue;
				}

				let dVec = vec2(g_player.pos.x - cx, g_player.pos.y - cy);
				dVec = dVec.clampLength(min(1.5, dVec.length()));
				pos.x = cx + dVec.x;
				pos.y = cy + dVec.y;
				let pos2 = tileCollisionRaycast(g_player.pos, pos);
				// if collision and the collision is not this tile
				if (pos2 && !(pos2.x == cx && pos2.y == cy)) {
					let shadow = g_shadows[x + "_" + y] || {
						x: cx,
						y: cy,
						alpha: 1,
					};
					shadow.alpha = min(1, shadow.alpha + 0.1);

					g_shadows[x + "_" + y] = shadow;
					//drawRect(pos, vec2(0.1), new Color(1, 0, 0));
				} else {
					//drawRect(pos, vec2(0.1), new Color(0, 1, 0));
				}
			}
		}

		const shadowSize = vec2(1.01);
		let color = colorBlack.copy();
		for (let key in g_shadows) {
			let shadow = g_shadows[key];
			// fade
			shadow.alpha -= (0.01 * 60) / frameRate;
			if (shadow.alpha <= 0) {
				delete g_shadows[key];
			} else {
				pos.x = shadow.x;
				pos.y = shadow.y;
				color.a = shadow.alpha;
				drawRect(pos, shadowSize, color);
			}
		}
	}
}
