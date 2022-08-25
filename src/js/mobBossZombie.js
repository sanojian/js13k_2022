/** @format */

class BossZombie extends Enemy {
	constructor(pos) {
		super(pos, vec2(2), g_game.tileNumbers.beefyZombie);

		this.soundGroan = new Sound([
			1, 0.5, 329.6276, 0.16, 0.62, 0.33, 0, 0.5, 0, 0, -50, 0.14, 0.13, 2.5, 28, 0, 0, 0.9, 0.07, 0.12,
		]);

		this.hp = 22;

		this.oldMirror = false;
		this.throwing = false;
		this.tearing = false;
		this.boulder = undefined;
	}

	update() {
		if (g_game.state == STATE_DEAD) return;

		if (this.tearing) {
			if (!this.tearingTimer.elapsed()) return;

			// throw chunk
			this.tearing = false;
			this.throwing = true;
			this.throwingTimer = new Timer(1);
			this.boulder.velocity = g_game.player.pos.subtract(this.pos).clampLength(0.15);
			this.boulder.angleVelocity = rand(-0.1, 0.1);
		}

		if (this.throwing) {
			if (!this.throwingTimer.elapsed()) return;
			this.thowing = false;
		}

		super.update();

		if (this.mirror != this.oldMirror) {
			fx.shakeScreen(0.5);
			this.oldMirror = this.mirror;
		}
	}

	collideWithTile(tileData, pos) {
		g_game.tileLayer.setData(pos, 0, true);
		setTileCollisionData(pos, 0);

		this.tearing = true;

		// tear out chunk
		this.boulder = new Boulder(this.pos.copy(), tileData);

		this.tearingTimer = new Timer(1);

		return false; // no more col resolve
	}
}
