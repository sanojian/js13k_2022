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
}
