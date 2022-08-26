/** @format */

class Boulder extends EngineObject {
	constructor(pos, tileIndex) {
		super(pos, vec2(1), tileIndex, TILE_SIZE, rand(-Math.PI / 8, Math.PI / 8), new Color(0.7, 0.7, 0.7));

		this.setCollision(true, true);

		this.soundDestroy = new Sound([1.08, , 50, , 0.18, 0.45, 4, 0, , , , , 0.01, 0.3, , 1.7, , 0.3, 0.11]);
	}

	collideWithTile() {
		fx.shakeScreen(0.5);

		this.soundDestroy.play();
		this.destroy();
		return false;
	}
}
