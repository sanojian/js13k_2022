
class MapManager {

	constructor() {

		this.createMap(g_game.worldMap);
	}

	createMap(myMap) {

		let w = myMap[0].length;
		let h = myMap.length;


		const tileSize = vec2(12, 12);

		//g_game.tileLayer = new TileLayer(vec2(0, 0), vec2(w, h), tileSize, vec2(1));

		//initTileCollision(vec2(w, h));
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				let t = myMap[y][x];
				if (t) {
					let tile = new MapTile(vec2(x, h - 1 - y), vec2(1), t, tileSize);
					g_game.walls.push(tile);
					//setTileCollisionData(vec2(x, h - 1 - y), t);
					//g_game.tileLayer.setData(vec2(x, h - 1 - y), new TileLayerData(t));
				}
			}
		}
		//g_game.tileLayer.redraw();


	}
}