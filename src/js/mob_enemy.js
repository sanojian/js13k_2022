/** @format */

class Enemy extends Mob {
	constructor(pos, size, tileIndex, mobDef) {
		super(pos, size, tileIndex);

		this._maxSpeed = mobDef.maxSpeed + mobDef.maxSpeed * 0.1 * g_difficulty;
		this.hp = mobDef.hp + Math.floor(g_difficulty * mobDef.hpGainPerlevel);

		this.enemyThinkPause = 0;
		this.enemyThinkMin = 20;
		this.enemyThinkMax = 100;
		this.enemyMoveSpeed = 0.1;
		this.enemyJitterForce = 0.01;
		this.enemyDrag = 1.5;
		this.enemyToTarget = undefined;
		this.lastTilePos = undefined;

		this.soundGroan = soundEnemyGroan;
	}

	update() {
		// think and look
		if (this.enemyThinkPause-- <= 0) {
			this.enemyToTarget = g_player.pos.subtract(this.pos);
			this.enemyThinkPause = rand(this.enemyThinkMin, this.enemyThinkMax);
			this.groan(0.3, rand(0.9, 1.2));
		}

		// take a step
		if (rand(100) < 10) {
			let force = vec2(0);
			if (this.enemyToTarget) force = this.enemyToTarget.normalize(this.enemyMoveSpeed);

			let jitter = randInCircle(this.enemyJitterForce);
			force = force.add(jitter);

			this.applyForce(force);
		}

		this.applyDrag(this.enemyDrag);
		this.velocity = this.velocity.clampLength(this._maxSpeed);

		super.update();
	}

	collideWithTile(tileData, tilePos) {
		if (this.lastTilePos && tilePos.distanceSquared(this.lastTilePos) < 0.01) {
			if (rand(100) < 10) {
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
				let pushForce = toOther.normalize(rand(0.1) / (toOther.length() + 0.001));
				o.applyForce(pushForce);
				this.groan(0.1, 0.9, 1);
			}
		}

		if (o instanceof MobPlayer) {
			// eating the corpse
			this.groan(0.1, 0.3, rand(2, 3));
		}

		return false;
	}

	hit(velocity, pos) {
		this.hp--;

		this.applyForce(velocity.scale(2));

		this.bloodEmitter = makeParticles(this.pos, rand(1));

		this.splatter(pos);

		if (this.hp == 0) {
			// Needs be equal or else we get enemy miscounts !
			this.groan(1, 3, rand(2, 2.5), rand(5));

			let corpse = new Corpse(this.pos.copy(), this.size.copy(), this.tileIndex, this.tileSize);
			corpse.pushCorpse(velocity /* 1 + g_difficulty */);
			g_corpses.push(corpse);

			let i = g_enemies.indexOf(this);
			g_enemies.splice(i, 1);

			if (this instanceof BossZombie) {
				// kill all enemies and level complete
				while (g_enemies.length > 0) {
					g_enemies[0].hp = 1;
					g_enemies[0].hit(velocity, g_enemies[0].pos);
				}
				changeState(STATE_CLEARED);
				g_level++;
			}

			this.destroy();

			g_score++;
			return true;
		}

		// splatter on mob
		let wound = { pos: vec2((pos.x - this.pos.x) / 3, (pos.y - this.pos.y) / 3), pattern: [] };
		for (let i = 0; i < 4; i++) {
			wound.pattern.push(Math.random() > 0.5 ? 1 : 0);
		}
		this.blood.push(wound);

		return false;
	}

	drawReachingArms() {
		const armLenght = 4 / 12;

		let toPlayer = this.enemyToTarget || g_player.pos.subtract(this.pos);
		let toPlayerAngle = toPlayer.angle();

		this.pointingAngle += turnTowards(toPlayerAngle - this.pointingAngle, (2 * PI) / 100); //turnTowards(this.pointingAngle, toPlayerAngle, rand(2 * PI) / 100);
		let pointing = vec2(1).setAngle(this.pointingAngle, armLenght);

		// draw arms
		let pos = this.pos.add(vec2(3 / 12, 2.3 / 12 + this.bumpWalk));
		drawLine(pos, pos.add(pointing), 1.2 / 12, this._myColor, !!glEnable);
		pos = this.pos.add(vec2(-3 / 12, 2.3 / 12 + this.bumpWalk));
		drawLine(pos, pos.add(pointing), 1.2 / 12, this._myColor, !!glEnable);
	}
}
