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
	 * @param {number} tics Game ticks to live. If 0 or negative, live "for ever".
	 */
	constructor(pos, pushStrength, minDist, maxDist, tics = 0) {
		this.pos = pos;
		this.minDist = minDist;
		this.maxDist = maxDist;
		this.pushStrength = pushStrength;
		this.tics = tics;

		ASSERT(this.minDist < this.maxDist);
		ASSERT(this.pushStrength > 0);
	}

	update() {
		this.tics--;

		for (const e of g_game.enemies) {
			let toEnemy = e.pos.subtract(this.pos);

			let dist = toEnemy.length();

			if (dist > this.maxDist) continue;

			let strenght = this.pushStrength;

			if (dist > this.minDist) {
				dist -= this.minDist;
				dist /= this.maxDist - this.minDist;
				dist *= 10;
				strenght = this.pushStrength / (dist * dist + 1);
			}

			// console.log("strenght", strenght);

			let force = toEnemy.normalize(strenght);

			e.applyForce(force);
			// debugLine(e.pos, e.pos + force.scale(100), "#ff00ff", 10, 1000);
		}
	}

	draw() {
		// drawRect(this.pos, vec2(1), new Color(1, 0, 1, 0.5));

		debugCircle(this.pos, this.minDist, "#f00", 1 / 60, false);
		debugCircle(this.pos, this.maxDist, "#0f0", 1 / 60, false);
	}
}

var pushers = [];

function updatePushers() {
	for (const p of pushers) {
		p.update();
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
