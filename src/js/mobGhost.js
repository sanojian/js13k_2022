/** @format */

class Ghost extends Enemy {
	constructor(pos) {
		super(pos, vec2(0.8), g_game.tileNumbers.ghost);

		this.hp = mobDefs.Ghost.hp + g_game.difficulty;
		this.miniFace = g_game.miniTileNumbers.miniFaceGhost;
		this.mass = 2;

		this.color = new Color(1, 1, 1, 0.3);
		this._myColor = new Color(155 / 255, 173 / 255, 183 / 255, 0.3);

		this.counter = rand(0, Math.PI * 2);

		this.setCollision(false, false, false);
	}

	update() {
		// transform
		if (rand(0, 1) < 0.01) {
			let solid = rand(0, 1) > 0.5;
			this.setCollision(solid, solid, solid);
			this.color = new Color(1, 1, 1, solid ? 1 : 0.3);
		}

		// float
		this.counter += Math.PI / 64;
		this.bumpWalk = (Math.sin(this.counter) * 5) / 12;

		super.update();
	}

	postRender() {
		this.drawReachingArms();

		super.postRender();
	}
}
