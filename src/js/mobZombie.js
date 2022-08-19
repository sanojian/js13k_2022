/** @format */

const JIT = 0.01;

class Zombie extends Mob {
	constructor(pos, angle, color) {
		super(pos, vec2(0.9), g_game.tileNumbers.zombie, tileSize, angle, color);

		this._maxSpeed = 0.5;

		this.hp = 3;
		this.mass = 2;
		this.thinkPause = 0;
		this.toPlayer = undefined;
		this.walkingSpeed = rand(0.05, 0.2);
	}

	update() {
		// think and look
		if (this.thinkPause-- <= 0) {
			this.toPlayer = g_game.player.pos.subtract(this.pos);
			this.thinkPause = rand(20, 100);
		}

		// take a step
		if (rand(0, 100) < 10) {
			let force = vec2(0);
			if (this.toPlayer) force = this.toPlayer.normalize(this.walkingSpeed);

			let jitter = vec2(rand(-JIT, JIT), rand(-JIT, JIT));

			force = force.add(jitter);

			this.applyForce(force);
		}

		this.applyDrag(1.5);
		this.velocity = this.velocity.clampLength(this._maxSpeed);

		super.update(); // update object physics and position

		// zombie limp
		this.bumpWalk = (0.2 * this.walkCyclePlace) / (this._walkCycleFrames * 2);
	}

	hit(velocity, pos) {
		//this.thinkPause += rand(0, 30);
		this.toPlayer = undefined;
		//console.log("HIT", this.thinkPause);
		return super.hit(velocity, pos);
	}

	collideWithObject(o) {
		if (o instanceof Zombie) {
			const TOO_CLOSE = 0.7;

			let toOther = o.pos.subtract(this.pos);
			if (toOther.length() < TOO_CLOSE) {
				let pushForce = toOther.normalize(rand(0, 0.2) / (toOther.length() + 0.001));
				o.applyForce(pushForce);
			}
		}

		return false;
	}
}
