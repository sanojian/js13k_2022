/** @format */

class MapManager {
	constructor() {
		this.createMap();
	}

	createMap() {
		let myMap = TileMaps.world.layers[0].data;
		let w = TileMaps.world.width;
		let h = TileMaps.world.height;

		const tileSize = vec2(12, 12);

		if (g_game.TILE_LAYER_COLLISION) {
			g_game.tileLayer = new TileLayer(vec2(0, 0), vec2(w, h), tileSize, vec2(1));
			initTileCollision(vec2(w, h));
		}

		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				let t = myMap[x + y * w];
				if (t) {
					if (g_game.TILE_LAYER_COLLISION) {
						setTileCollisionData(vec2(x, h - 1 - y), t - 1);
						g_game.tileLayer.setData(vec2(x, h - 1 - y), new TileLayerData(t - 1));
					}
					else {
						// individual maptiles
						let tile = new MapTile(vec2(x, h - 1 - y), vec2(1), t - 1, tileSize);
						g_game.walls.push(tile);
					}
				} else {
					// floor
					//new EngineObject(vec2(x, h - 1 - y), vec2(1), 11, tileSize);
				}
			}
		}
		if (g_game.TILE_LAYER_COLLISION) {
			g_game.tileLayer.redraw();
		}
	}
}
