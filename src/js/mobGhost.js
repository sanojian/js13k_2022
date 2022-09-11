/** @format */

class Ghost extends Enemy {
	constructor(pos) {
		super(pos, MOB_SIZE, tileNumbers_ghost, mobDefs.Ghost);

		this.miniFace = miniTileNumbers_miniFaceGhost;
		this.mass = 2;

		// this.color = new Color(1, 1, 1, 0.3);
		this._armColor = new Color(155 / 255, 173 / 255, 183 / 255, 0.3);
		this.color = this._armColor;
		this.transformCount = rand(30, 120);
		this.solid = false;

		this.soundGroan = soundGhostGroan;
	}

	update() {
		this.transformCount--;

		// transform
		if (this.transformCount < 0) {
			this.transformCount = rand(30, 120);
			this.solid = !this.solid;
			this.color.a = this.solid ? 1 : 0.3;
			this._armColor.a = this.color.a;
		}

		this.setCollision(this.solid, this.solid, this.solid);

		super.update();
	}

	postRender() {
		this.drawReachingArms();

		super.postRender();
	}
}
