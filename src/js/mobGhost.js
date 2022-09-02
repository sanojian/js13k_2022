/** @format */

class Ghost extends Enemy {
	constructor(pos) {
		super(pos, MOB_SIZE, tileNumbers_ghost, mobDefs.Ghost);

		this.miniFace = miniTileNumbers_miniFaceGhost;
		this.mass = 2;

		this.color = new Color(1, 1, 1, 0.3);
		this._myColor = new Color(155 / 255, 173 / 255, 183 / 255, 0.3);

		this.counter = rand(0, Math.PI * 2);

		this.transformCount = rand(30, 120);
		this.solid = false;
	}

	update() {
		this.transformCount--;

		// transform
		if (this.transformCount < 0) {
			this.transformCount = rand(30, 120);
			this.solid = !this.solid;
			this.color = new Color(1, 1, 1, this.solid ? 1 : 0.3);
		}

		this.setCollision(this.solid, this.solid, this.solid);

		// float
		this.counter += PI / 64;
		this.bumpWalk = (Math.sin(this.counter) * 5) / 12;

		super.update();
	}

	postRender() {
		this.drawReachingArms();

		super.postRender();
	}
}
