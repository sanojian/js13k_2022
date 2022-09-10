/** @format */

class BossZombie extends Enemy {
	constructor(pos) {
		super(pos, vec2(1.5, 2), tileNumbers_beefyZombie, mobDefs.BossZombie);

		this.mass = 12;

		this.oldMirror = false;
		this.throwing = false;
		this.tearing = false;
		this.boulder = undefined;

		this.soundStep = soundBossStep;
		this.soundThrow = soundBossThrow;
		this.soundTearing = soundBossTearing;
	}

	update() {
		if (g_state == STATE_DEAD) return;

		if (this.tearing) {
			this.boulder.pos = this.pos.copy();
			if (!this.tearingTimer.elapsed()) return;

			// throw chunk
			this.tearing = false;
			this.throwing = true;
			this.throwingTimer = new Timer(1);
			this.boulder.velocity = g_player.pos.subtract(this.pos).clampLength(0.3);
			this.boulder.angleVelocity = rand(-0.1, 0.1);
			this.boulder.isThrown = true;
			this.soundThrow.play(this.pos);
		}

		if (this.throwing) {
			if (!this.throwingTimer.elapsed()) return;
			this.thowing = false;
		}

		super.update();

		if (this.mirror != this.oldMirror) {
			fx.shakeScreen(0.5);
			//vibrate(200);
			this.soundStep.play(this.pos);
			this.oldMirror = this.mirror;
		}
	}

	collideWithObject(o) {
		return true;
	}

	collideWithTile(tileData, pos) {
		if (this.tearing) return;

		if (pos.x > 0 && pos.y > 0 && pos.x < tileLayer.size.x && pos.y < tileLayer.size.y) {
			tileLayer.setData(pos, 0, true);
			setTileCollisionData(pos, 0);
		}

		this.tearing = true;
		this.soundTearing.play(this.pos);

		// tear out chunk
		this.boulder = new Boulder(this.pos.copy(), tileData);

		this.tearingTimer = new Timer(1);

		return true;
	}
}
