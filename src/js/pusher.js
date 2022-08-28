/** @format */

class Pusher {
	/**
	 *
	 * @param {Vector2} pos
	 * @param {number} pushStrenght
	 * @param {number} minDist
	 * @param {number} maxDist
	 * @param {number} tics
	 */
	constructor(pos, pushStrenght, minDist, maxDist, tics) {
		this.pos = pos;
		this.minDist = minDist;
		this.maxDist = maxDist;
		this.force = pushStrenght;
		this.tics = tics;
	}

	update() {
		this.tics--;

		for (const e of g_game.enemies) {
			let toEnemy = e.pos.subtract(this.pos);

			let dist = toEnemy.length();

			if (dist > this.maxDist) continue;

			let strenght = this.force / (dist * dist + 1);

			let force = toEnemy.normalize(strenght);

			e.applyForce(force);
		}
	}

	draw() {
		drawRect(this.pos, vec2(1), new Color(1, 0, 1));
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
