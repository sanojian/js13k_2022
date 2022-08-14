class Player extends EngineObject  {


	constructor(pos, size, tileIndex, tileSize, angle, color) {
		super(pos, size, tileIndex, tileSize, angle, color);
		// your object init code here
		this._speed = 0.3;

	}

	update() {
		// your object update code here
		let dx = 0;
		let dy = 0;
		if (keyIsDown(38)) {	// w 
			dy += this._speed;
		}
		if (keyIsDown(37)) {	// a
			dx += -this._speed;
		}
		if (keyIsDown(40)) {	// s
			dy += -this._speed;
		}
		if (keyIsDown(39)) {	// d
			dx += this._speed;
		}

		this.velocity.x = dx;
		this.velocity.y = dy;

		super.update(); // update object physics and position
 
	}

	render() {
		super.render(); // draw object as a sprite
		// your object render code here
	}

}