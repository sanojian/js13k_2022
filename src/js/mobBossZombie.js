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

		this.miniFace = miniTileNumbers_miniFaceBoss;
	}

	update() {
		if (g_state == STATE_DEAD) return;

		if (this.tearing) {
			this.miniFace = miniTileNumbers_miniFaceBossAngry;
			this.boulder.pos = this.pos.copy();
			if (!this.tearingTimer.elapsed()) return;

			// throw chunk
			this.tearing = false;
			this.throwing = true;
			this.throwingTimer = new Timer(1);
			this.boulder.velocity = g_player.pos.subtract(this.pos).normalize(0.2);
			this.boulder.angleVelocity = rand(0.1, 0.2);
			this.boulder.isThrown = true;
			this.soundThrow.play(this.pos);
		}

		if (this.throwing) {
			if (!this.throwingTimer.elapsed()) return;
			this.thowing = false;
			this.miniFace = miniTileNumbers_miniFaceBoss;
		}

		super.update();

		if (this.mirror != this.oldMirror) {
			fx_shakeScreen(0.5);
			//vibrate(200);
			this.soundStep.play(this.pos);
			this.oldMirror = this.mirror;
		}
	}

	postRender() {
		// draw face
		drawTile(
			this.pos.add(vec2((g_player.pos.subtract(this.pos).x > -1 ? 1 : 0) / 12, 7 / 12 + this.bumpWalk)),
			vec2(1 / 2),
			this.miniFace,
			vec2(6)
		);
		this.drawBlood();
	}

	collideWithObject(o) {
		return true;
	}

	collideWithTile(tileData, pos) {
		if (this.tearing) return;

		if (pos.x > 0 && pos.y > 0 && pos.x < tileLayer.size.x - 1 && pos.y < tileLayer.size.y - 1) {
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
