/** @format */

class Boulder extends EngineObject {
	constructor(pos, tileIndex) {
		super(pos, vec2(1), tileIndex, TILE_SIZE, rand(-PI / 8, PI / 8), new Color(0.7, 0.7, 0.7));

		this.setCollision(true, true);

		this.soundDestroy = soundBoulderDestroy;
	}

	collideWithTile() {
		fx.shakeScreen(0.5);

		this.soundDestroy.play();
		makeParticles(this.pos, rand(0.4, 0.8), new Color(105 / 255, 106 / 255, 106 / 255));
		this.destroy();
		return false;
	}
}
