/** @format */
class Zombie extends Mob {
	constructor(pos, size, tileSize, angle, color) {
		super(pos, size, g_game.tileNumbers.zombie, tileSize, angle, color);

		this._maxSpeed = 0.3;

		this.hp = 3;
	}

	update() {
		if (rand(0, 100) < 10) {
			let toPlayer = g_game.player.pos.subtract(this.pos).normalize(0.02);

			let force = toPlayer.add(vec2(rand(-0.01, 0.01), rand(-0.01, 0.01))); // jitter

			this.applyForce(force);
		}

		this.applyDrag(1.5);
		this.velocity = this.velocity.clampLength(this._maxSpeed);

		super.update(); // update object physics and position

		// zombie limp
		this.bumpWalk = (0.2 * this.walkCyclePlace) / (this._walkCycleFrames * 2);

	}

}
