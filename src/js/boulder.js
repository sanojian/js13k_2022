/** @format */

class Boulder extends EngineObject {
	static destroyAllBoulders() {
		var c = 0;
		for (const o of engineObjects) {
			if (o instanceof Boulder) o.collideWithTile();
		}
	}

	constructor(pos, tileIndex) {
		super(pos, vec2(1), tileIndex, TILE_SIZE, rand(-PI / 8, PI / 8), colorWhite);

		//vibrate(100);
		this.setCollision(true, true);
		this.isThrown = false;
		this.damping = 1;
	}

	collideWithTile() {
		fx_shakeScreen(0.5);
		//vibrate(200);

		soundBoulderDestroy.play();
		makeParticles(this.pos, rand(0.4, 0.8), colorGrey);
		this.destroy();
		return false;
	}
}
