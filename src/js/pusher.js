/** @format */

class Pusher {
	/**
	 * At minDist the strenght of the push is pushStrength at maxDist it is zero.
	 *
	 * Tics is nof tics to live.
	 *
	 * @param {Vector2} pos
	 * @param {number} pushStrength
	 * @param {number} minDist
	 * @param {number} maxDist
	 * @param {number} secs Game ticks to live. If 0 or negative, live "for ever".
	 */
	constructor(pos, pushStrength, minDist, maxDist, secs = 0) {
		this.pos = pos;
		this.minDist = minDist;
		this.maxDist = maxDist;
		this.pushStrength = pushStrength;
		this.tics = Math.round(secs * 60);

		ASSERT(this.minDist < this.maxDist);
		ASSERT(this.pushStrength > 0);
	}

	update() {
		this.tics = this.tics - 1;

		for (const e of g_game.enemies) {
			let toEnemy = e.pos.subtract(this.pos);

			let dist = toEnemy.length();

			if (dist > this.maxDist) continue;

			let strenght = this.pushStrength;

			if (dist > this.minDist) {
				let p = 1 - percent(dist, this.minDist, this.maxDist);
				//strenght *= p; // lineary falloff

				strenght *= (1 + Math.cos(p * PI)) / 2; // sigmoidal falloff

				// dist -= this.minDist;
				// dist /= this.maxDist - this.minDist;
				// dist *= 10;
				// strenght = this.pushStrength / (dist * dist + 1);
			}

			// console.log("strenght", strenght);

			let force = toEnemy.normalize(strenght);

			e.applyForce(force);
			// debugLine(e.pos, e.pos + force.scale(100), "#ff00ff", 10, 1000);
		}
	}

	draw() {
		debugCircle(this.pos, this.minDist, "#f00", 1 / 60000, false);
		debugCircle(this.pos, this.maxDist, "#0f0", 1 / 60000, false);
	}
}

var pushers = [];

function updatePushers() {
	for (let i = 0; i < pushers.length; i++) {
		let p = pushers[i];
		p.update();
		if (p.tics === 0) {
			pushers.splice(i, 1);
			i--;
		}
	}
}

function drawPushers() {
	for (const p of pushers) {
		p.draw();
	}
}

function clearPushers() {
	pushers = [];
}
