/** @format */

class BossZombie extends Enemy {
	constructor(pos) {
		super(pos, vec2(2), g_game.tileNumbers.beefyZombie);

		this.mass = 12;

		this._maxSpeed = mobDefs.BossZombie.maxSpeed + mobDefs.BossZombie.maxSpeed * 1.1 * g_game.difficulty;
		this.hp = mobDefs.BossZombie.hp + Math.floor(g_game.difficulty * mobDefs.BossZombie.hpGainPerlevel);

		this.oldMirror = false;
		this.throwing = false;
		this.tearing = false;
		this.boulder = undefined;

		this.soundStep = new Sound([3.5, , 15, 0.02, 0.1, 0.05, , 3.67, , 0.6, , , 0.13, 1.8, , 0.3, , 0.35, 0.01]);
		this.soundThrow = new Sound([, , 1650, 0.01, 0.09, 0.02, 4, 0.5, 1, , , 0.06, , , 13, , , 0.9, 0.1]);
		this.soundTearing = new Sound([1.08, , 50, , 0.18, 0.45, 4, 0, , , , , 0.01, 0.3, , 1.2, , 0.3, 0.11]);
	}

	update() {
		if (g_game.state == STATE_DEAD) return;

		if (this.tearing) {
			this.boulder.pos = this.pos.copy();
			if (!this.tearingTimer.elapsed()) return;

			// throw chunk
			this.tearing = false;
			this.throwing = true;
			this.throwingTimer = new Timer(1);
			this.boulder.velocity = g_game.player.pos.subtract(this.pos).clampLength(0.3);
			this.boulder.angleVelocity = rand(-0.1, 0.1);
			this.soundThrow.play();
		}

		if (this.throwing) {
			if (!this.throwingTimer.elapsed()) return;
			this.thowing = false;
		}

		super.update();

		if (this.mirror != this.oldMirror) {
			fx.shakeScreen(0.5);
			this.soundStep.play();
			this.oldMirror = this.mirror;
		}
	}

	collideWithTile(tileData, pos) {
		if (this.tearing) return;

		g_game.tileLayer.setData(pos, 0, true);
		setTileCollisionData(pos, 0);

		this.tearing = true;
		this.soundTearing.play();

		// tear out chunk
		this.boulder = new Boulder(this.pos.copy(), tileData);

		this.tearingTimer = new Timer(1);

		return false; // no more col resolve
	}
}
