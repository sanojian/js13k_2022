/** @format */

class Boulder extends EngineObject {
	constructor(pos, tileIndex) {
		super(pos, vec2(1), tileIndex, TILE_SIZE, rand(-Math.PI / 8, Math.PI / 8), new Color(0.7, 0.7, 0.7));
	}

	collideWithTile() {
		fx.shakeScreen(1);

		this.destroy();
		return false;
	}
}
