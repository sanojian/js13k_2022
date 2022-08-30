/** @format */
class Corpse extends EngineObject {
	constructor(pos, size, tileIndex, tileSize) {
		super(pos, size, tileIndex, tileSize, 0, new Color(0.7, 0.5, 0.5));
		// your object init code here

		this._animLifetime = 10;

		this.timeAlive = 0;
		this.fallDirection = 1;
		this.finalAngle = PI;
		this.setCollision(false, false, true);

		this.bloodEmitter = makeParticles(this.pos, rand(0.5, 1));
	}

	update() {
		this.timeAlive++;

		this.angle = (this.fallDirection * min(1, this.timeAlive / this._animLifetime) * this.finalAngle) / 2;

		this.velocity.x = this.velocity.x * 0.9;
		this.velocity.y = this.velocity.y * 0.9;

		this.bloodEmitter.pos = this.pos;
		super.update(); // update object physics and position
	}

	// skip render so it stays in background
	render() {}

	renderNow() {
		super.render(); // draw object as a sprite
	}

	postRender() {
		// draw score
		if (this.scoreObj && this.scoreObj.life) {
			drawText(
				"+" + this.scoreObj.score,
				this.pos.add(vec2(0, this.scoreObj.y)),
				0.5,
				g_game.colorScoreText,
				1 / 6,
				undefined,
				"center"
			);
			this.scoreObj.y += (1 - (3 * this.scoreObj.y) / 4) / 12;
			this.scoreObj.life--;
		}
	}

	push(velocity, score) {
		this.velocity.x = velocity.x / 3;
		this.velocity.y = velocity.y / 3;
		this.fallDirection = velocity.x > 0 ? 1 : -1;
		this.finalAngle = -PI / 2 + rand(0, PI) + PI;

		if (score) {
			this.scoreObj = {
				score: score,
				y: 0,
				life: 60,
			};
		}
	}
}
