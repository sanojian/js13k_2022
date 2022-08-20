/** @format */
class MobPlayer extends Mob {
	constructor(pos) {
		super(pos, vec2(0.9), g_game.tileNumbers.player);
		// your object init code here
		this._speed = 0.1;

		this._walkCycleFrames = 20;

		this.setCollision(true, true);
		this.mass = 1;
		this.damping = 0.4;
		this.mirror = false;
		this.gun = undefined;

		this.hp = 1;
	}

	update() {
		if (this.hp > 0) {
			let dx = 0;
			let dy = 0;
			if (keyIsDown(38)) {
				// key w
				dy = this._speed;
			}
			if (keyIsDown(37)) {
				// key a
				dx = -this._speed;
			}
			if (keyIsDown(40)) {
				// key s
				dy = -this._speed;
			}
			if (keyIsDown(39)) {
				// key d
				dx = this._speed;
			}

			this.applyForce(new Vector2(dx, dy));
		} else {
			if (this.gun) {
				this.gun.owner = null;
				this.gun = null;
			}
		}

		this.applyDrag(1.1);

		super.update(); // update object physics and position
	}

	collideWithObject(o) {
		if (o instanceof Zombie) {
			let v = this.pos.subtract(o.pos);
			let d = v.length();
			if (d < 0.5) {
				this.hp--;
				v.normalize(0.1);
				this.applyForce(v);

				bloodParticles(this.pos, 0.1);
			}
		}

		return false; // no auto resolve of collision
	}

	render() {
		super.render(); // draw object as a sprite

		// arms
		let toPos = this.gun
			? this.gun.pos
			: vec2(this.pos.x + (this.mirror ? 3 : 6) / 12, this.pos.y + 7 / 16 + this.bumpWalk);
		drawLine(
			vec2(this.pos.x + 3 / 12, this.pos.y + 2 / 16 + this.bumpWalk),
			toPos,
			1 / 12,
			new Color(172 / 255, 50 / 255, 50 / 255)
		);
		toPos = this.gun
			? this.gun.pos
			: vec2(this.pos.x - (this.mirror ? 6 : 3) / 12, this.pos.y + 7 / 16 + this.bumpWalk);
		drawLine(
			vec2(this.pos.x - 3 / 12, this.pos.y + 2 / 16 + this.bumpWalk),
			toPos,
			1 / 12,
			new Color(172 / 255, 50 / 255, 50 / 255)
		);
	}
}
