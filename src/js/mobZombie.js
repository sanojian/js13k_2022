/** @format */

const JIT = 0.01;

class Zombie extends Mob {
	constructor(pos) {
		super(pos, vec2(0.9), g_game.tileNumbers.zombie);

		this._maxSpeed = 0.5;

		this.hp = 3;
		this.mass = 2;
		this.thinkPause = 0;
		this.toPlayer = undefined;
		this.walkingSpeed = rand(0.05, 0.2);

		this._soundSpeak = new Sound([
			0.3,
			0.5,
			40,
			,
			0.18,
			0.54,
			2,
			3.83,
			0.5,
			2,
			,
			,
			0.06,
			0.8,
			,
			0.5,
			,
			0.33,
			0.06,
			0.22,
		]);

		this.speakTimer = new Timer();
		this.setSpeakTimer();

		this.soundGroan = new Sound([
			1, 0.5, 329.6276, 0.16, 0.62, 0.33, 0, 0.5, 0, 0, -50, 0.14, 0.13, 2.5, 28, 0, 0, 0.9, 0.07, 0.12,
			//			1, 0.05, 261.6256, 0.08, 0.24, 0.11, 0, 1, 0, 0, 0, 0.14, 0, 3.6, -11, 0, 0.51, 1, 0.07, 0,
		]);
	}

	groan(chance, strength) {
		if (rand(1) > chance) return;

		const MAX_VOL = 0.5;

		let vol = MAX_VOL;

		if (this.toPlayer) {
			let d = this.toPlayer.length() / 10;
			vol = d < 1 ? MAX_VOL : MAX_VOL / (d * d);
		}

		this.soundGroan.play(this.pos, strength * vol, strength * rand(1, 2), 0.5);
	}

	update() {
		// think and look
		if (this.thinkPause-- <= 0) {
			this.toPlayer = g_game.player.pos.subtract(this.pos);
			this.thinkPause = rand(20, 100);
			this.groan(0.3, rand(1));
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

		if (this.speakTimer.elapsed()) {
			//this._soundSpeak.play();
			this.setSpeakTimer();
		}
	}

	hit(velocity, pos) {
		this.thinkPause += rand(10, 30);
		this.toPlayer = undefined;
		this.groan(1, 1.2);
		return super.hit(velocity, pos);
	}

	collideWithObject(o) {
		if (o instanceof Zombie) {
			const TOO_CLOSE = 0.7;

			let toOther = o.pos.subtract(this.pos);
			if (toOther.length() < TOO_CLOSE) {
				let pushForce = toOther.normalize(rand(0, 0.1) / (toOther.length() + 0.001));
				o.applyForce(pushForce);
				this.groan(0.1, 0.1);
			}
		}

		if (o instanceof MobPlayer) {
			this.groan(0.01, 1);
		}

		return false;
	}

	setSpeakTimer() {
		this.speakTimer.set(rand(1, 20));
	}
}
