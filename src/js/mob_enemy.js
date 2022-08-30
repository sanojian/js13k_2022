/** @format */

class Enemy extends Mob {
	constructor(pos, size, tileIndex) {
		super(pos, size, tileIndex);

		this.enemyThinkPause = 0;
		this.enemyThinkMin = 20;
		this.enemyThinkMax = 100;
		this.enemyMoveSpeed = 0.1;
		this.enemyJitterForce = 0.01;
		this.enemyDrag = 1.5;
		this.enemyMaxSpeed = 0.5;
		this.enemyToTarget = undefined;
		this.lastTilePos = undefined;

		let def = mobDefs[this.constructor.name];
		this.hp = def.hp + Math.floor(g_game.difficulty * def.hpGainPerlevel);

		this.soundGroan = new Sound([
			1, 0.5, 329.6276, 0.16, 0.62, 0.33, 0, 0.5, 0, 0, -50, 0.14, 0.13, 2.5, 28, 0, 0, 0.9, 0.07, 0.12,
		]);
	}

	update() {
		// think and look
		if (this.enemyThinkPause-- <= 0) {
			this.enemyToTarget = g_game.player.pos.subtract(this.pos);
			this.enemyThinkPause = rand(this.enemyThinkMin, this.enemyThinkMax);
			this.groan(0.3, rand(0.8, 1.2));
		}

		// take a step
		if (rand(0, 100) < 10) {
			let force = vec2(0);
			if (this.enemyToTarget) force = this.enemyToTarget.normalize(this.enemyMoveSpeed);

			let jitter = randInCircle(this.enemyJitterForce);
			force = force.add(jitter);

			this.applyForce(force);
		}

		this.applyDrag(this.enemyDrag);
		this.velocity = this.velocity.clampLength(this.enemyMaxSpeed);

		super.update();
	}

	collideWithTile(tileData, tilePos) {
		if (this.lastTilePos && tilePos.distanceSquared(this.lastTilePos) < 0.01) {
			if (rand(0, 100) < 10) {
				let colPos = tilePos.add(vec2(0.5));
				colPos = colPos.lerp(this.pos, 0.5);
				pushers.push(new Pusher(colPos, 0.01, 0, 1, rand(1, 2)));
			}
		}

		this.lastTilePos = tilePos.copy();
		return true;
	}

	collideWithObject(o) {
		if (o instanceof Enemy) {
			const TOO_CLOSE = 0.7;

			let toOther = o.pos.subtract(this.pos);
			if (toOther.length() < TOO_CLOSE) {
				let pushForce = toOther.normalize(rand(0, 0.1) / (toOther.length() + 0.001));
				o.applyForce(pushForce);
				this.groan(0.1, 0.8);
			}
		}

		if (o instanceof MobPlayer) {
			this.groan(0.01, 1);
		}

		return false;
	}
}
