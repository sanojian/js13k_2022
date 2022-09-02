/** @format */

const JIT = 0.01;
const RISE_FRAMES = 240;

class Zombie extends Enemy {
	constructor(pos) {
		super(pos, vec2(0.8), tileNumbers_zombie);

		this._maxSpeed = mobDefs.Zombie.maxSpeed + mobDefs.Zombie.maxSpeed * 0.1 * g_difficulty;
		this.hp = mobDefs.Zombie.hp + Math.floor(g_difficulty * mobDefs.Zombie.hpGainPerlevel);
		this.miniFace = g_miniTileNumbers.miniFaceZombie;

		this.mass = 2;
		this._myColor = new Color(55 / 255, 148 / 255, 110 / 255);

		this.riseFrames = RISE_FRAMES;
		this.pos.y -= 0.5; // for the rising to look good-ish

		this.enemyJitterForce = 0.1;
		this.enemyMoveSpeed = rand(0.05, 0.1);

		this.pointingAngle = rand(2 * PI);

		this.groan(1, rand(0.9, 1.1), 1);
	}

	update() {
		if (this.riseFrames > 0) {
			this.riseFrames--;
			let frac = 1 - this.riseFrames / RISE_FRAMES;
			this.tileSize = vec2(11, 12 * frac);
			this.size = vec2(0.8, 0.8 * frac);
			this.pos.y += 0.5 / RISE_FRAMES;

			if (this.riseFrames == 0) this.groan(1, 1, 1.5);
			return;
		}

		super.update();

		// zombie limp
		this.bumpWalk = (0.2 * this.walkCyclePlace) / (this._walkCycleFrames * 2);
	}

	hit(velocity, pos) {
		//this.moveSpeed = rand(0.05, 0.2);
		this.enemyThinkPause += rand(10, 30);
		this.enemyToTarget = undefined;
		this.groan(1, 2, rand(2, 3));
		return super.hit(velocity, pos);
	}

	postRender() {
		if (this.riseFrames > 0) {
			this.enemyToTarget = vec2(0, 1);
			this.pointingAngle = PI;
		} else {
			super.postRender();
		}

		this.drawReachingArms();
	}
}

function angleNormalize(angleRad) {
	return (angleRad + 100 * PI) % (2 * PI);
}

function turnTowards(toRad, maxTurnRad) {
	toRad = angleNormalize(toRad);

	if (abs(toRad) < maxTurnRad) return toRad;

	if (toRad > 0 && abs(toRad) < PI) {
		return maxTurnRad;
	} else {
		return -maxTurnRad;
	}
}
