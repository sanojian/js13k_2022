/** @format */
class MobPlayer extends Mob {
	constructor(pos, size, tileSize, angle, color) {
		super(pos, size, g_game.tileNumbers.player, tileSize, angle, color);
		// your object init code here
		this._speed = 0.1;

		this._walkCycleFrames = 30;

		this.setCollision(true, true);
		this.mass = 1;
		this.damping = 0.4;
		this.mirror = false;
		this.gun = undefined;
	}

	update() {
		// your object update code here
		let dx = 0;
		let dy = 0;
		if (keyIsDown(38)) {
			// w
			dy += this._speed;
		}
		if (keyIsDown(37)) {
			// a
			dx += -this._speed;
		}
		if (keyIsDown(40)) {
			// s
			dy += -this._speed;
		}
		if (keyIsDown(39)) {
			// d
			dx += this._speed;
		}

		this.applyForce(new Vector2(dx, dy));
		
		super.update(); // update object physics and position
	}

	render() {
		super.render(); // draw object as a sprite

		// arms
		drawLine(vec2(this.pos.x + 3/12, this.pos.y + 1/16), this.gun.pos, 1/12, new Color(172/255, 50/255, 50/255));
		drawLine(vec2(this.pos.x - 3/12, this.pos.y + 1/16), this.gun.pos, 1/12, new Color(172/255, 50/255, 50/255));

	}
}
