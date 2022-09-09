/** @format */

class Boulder extends EngineObject {
	constructor(pos, tileIndex) {
		super(pos, vec2(1), tileIndex, TILE_SIZE, rand(-PI / 8, PI / 8), new Color(0.7, 0.7, 0.7));

		vibrate(100);
		this.setCollision(true, true);
		this.isThrown = false;
	}

	collideWithTile() {
		fx.shakeScreen(0.5);
		vibrate(200);

		soundBoulderDestroy.play();
		makeParticles(this.pos, rand(0.4, 0.8), new Color(105 / 255, 106 / 255, 106 / 255));
		this.destroy();
		return false;
	}
}
