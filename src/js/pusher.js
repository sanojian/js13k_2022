/** @format */

const enableDrawPushers = false;

const PushTo = {
	PLAYER: 1,
	ENEMIES: 2,
	ALL: 3,
};

class Pusher {
	/**
	 * At minDist the strenght of the push is pushStrength at maxDist it is zero.
	 *
	 * @param {Vector2} pos
	 * @param {number} pushStrength
	 * @param {number} minDist
	 * @param {number} maxDist
	 * @param {number} secs Seconds to live. If 0 or negative, live for ever.
	 * @param {number} whoIsAffected (Affects)
	 */
	constructor(pos, pushStrength, minDist, maxDist, secs = 0, whoIsAffected = PushTo.ALL) {
		this.pos = pos;
		this.minDist = minDist;
		this.maxDist = maxDist;
		this.pushStrength = pushStrength;
		this.tics = Math.round(secs * 60);
		this.affects = whoIsAffected;
	}

	affectMob(e) {
		if (!e.collideWithTile) return;

		let toMob = e.pos.subtract(this.pos);

		let dist = toMob.length();

		if (dist > this.maxDist) return;

		let strenght = this.pushStrength;

		if (dist > this.minDist) {
			let p = 1 - percent(dist, this.minDist, this.maxDist);
			//strenght *= p; // lineary falloff
			//strenght *= 1 + Math.cos(p * PI); // sigmoidal falloff
			strenght *= 2 * p * p; // squared falloff
		}

		// console.log("strenght", strenght);

		let force = toMob.normalize(rand(strenght));

		e.applyForce(force);
	}

	update() {
		this.tics = this.tics - 1;

		if (this.affects & PushTo.ENEMIES) {
			for (const e of g_enemies) {
				this.affectMob(e);
			}
		}

		if (this.affects & PushTo.PLAYER) {
			this.affectMob(g_player);
		}
	}

	// draw() {
	// 	debugCircle(this.pos, this.minDist, "#f00", 1 / 60, false);
	// 	debugCircle(this.pos, this.maxDist, "#0f0", 1 / 60, false);
	// }
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
	if (!enableDrawPushers) return;
	for (const p of pushers) {
		p.draw();
	}
}

function clearPushers() {
	pushers = [];
}
