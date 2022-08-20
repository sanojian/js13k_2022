/** @format */

class Npc extends Mob {
	constructor(pos, size) {
		super(pos, size, g_game.tileNumbers.npc);

		this._maxSpeed = 0.3;

		this.hp = 3;
		this.mass = 2;
		this.thinkPause = 0;
		this.toPlayer = undefined;
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
			if (this.toPlayer) force = this.toPlayer.normalize(0.04);

			let jitter = vec2(rand(-JIT, JIT), rand(-JIT, JIT));

			force = force.add(jitter);

			this.applyForce(force);
		}

		this.applyDrag(2);
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
}
