/** @format */

const enableDrawPushers = false;

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
	}

	update() {
		this.tics = this.tics - 1;

		for (const e of g_enemies) {
			if (!e.collideWithTile) continue;

			let toMob = e.pos.subtract(this.pos);

			let dist = toMob.length();

			if (dist > this.maxDist) continue;

			let strenght = this.pushStrength;

			if (dist > this.minDist) {
				let p = 1 - percent(dist, this.minDist, this.maxDist);
				//strenght *= p; // lineary falloff
				strenght *= (1 + Math.cos(p * PI)) / 2; // sigmoidal falloff
			}

			// console.log("strenght", strenght);

			let force = toMob.normalize(rand(strenght));

			e.applyForce(force);
		}
	}

	draw() {
		enableDrawPushers && debugCircle(this.pos, this.minDist, "#f00", 1 / 60000, false);
		enableDrawPushers && debugCircle(this.pos, this.maxDist, "#0f0", 1 / 60000, false);
	}
}

var pushers = [];

var pushersDoDraw = false;

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
	if (!enableDrawPushers) return;
	if (!pushersDoDraw) return;

	for (const p of pushers) {
		p.draw();
	}
}

function clearPushers() {
	pushers = [];
}
