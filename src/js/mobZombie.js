/** @format */

const JIT = 0.01;
const RISE_FRAMES = 240;

class Zombie extends Enemy {
	constructor(pos) {
		super(pos, MOB_SIZE, tileNumbers_zombie, mobDefs.Zombie);

		this.miniFace = miniTileNumbers_miniFaceZombie;

		this.mass = 2;
		this._armColor = colorZombie;

		this.riseFrames = RISE_FRAMES;
		this.pos.y -= 0.5; // for the rising to look good-ish

		this.enemyJitterForce = 0.01;
		this.enemyAccel = rand(0.2, 0.3);

		//this.pointingAngle = rand(2 * PI);
		this.damping = 0; // stand still until first move

		this.groan(1, rand(0.9, 1.1), 1);
	}

	update() {
		if (this.riseFrames > 0) {
			// dirt particles when rising
			if (this.riseFrames % 20 == 0) makeParticles(this.pos.subtract(vec2(0, this.size.y / 2)), 0.4, colorEarth);

			this.riseFrames--;
			let frac = 1 - this.riseFrames / RISE_FRAMES;
			this.tileSize = vec2(9, 12 * frac);
			this.size = vec2(this.size.x, 0.8 * frac);
			this.pos.y += 0.5 / RISE_FRAMES;

			if (this.riseFrames == 0) {
				this.groan(1, 1, 1.5);
				this.velocity = vec2(0);
			}
			return;
		}

		if (this.enemyToTarget) this.damping = 0.95; // now you can move

		super.update();
	}

	hit(velocity, pos, dam) {
		//this.moveSpeed = rand(0.05, 0.2);
		this.enemyThinkPause += rand(10, 30);
		this.enemyToTarget = undefined;
		this.groan(1, 2, rand(2, 3));
		return super.hit(velocity, pos, dam);
	}

	postRender() {
		if (this.riseFrames <= 0) {
			super.postRender(); // render face (and blood)
		}

		if (!this.enemyToTarget) this.pointingAngle = PI;

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
