/** @format */

class Enemy extends Mob {
	enemyThinkPause = 0;
	enemyThinkMin = 20;
	enemyThinkMax = 100;
	enemyMoveSpeed = 0.1;
	enemyJitterForce = 0.01;
	enemyDrag = 1.5;
	enemyMaxSpeed = 0.5;
	enemyToTarget = undefined;

	constructor(pos, size, tileIndex) {
		super(pos, size, tileIndex);
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
