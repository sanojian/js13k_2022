class Player extends EngineObject  {


	constructor(pos, size, tileIndex, tileSize, angle, color) {
		super(pos, size, tileIndex, tileSize, angle, color);
		// your object init code here
		this._speed = 0.1;

		this._walkCycleFrames = 30;

		this.tileIndex = 0;
		this.setCollision(1, 1);
		this.mass = 1;
		this.damping = 0.4;
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


		// this.velocity.x = dx;
		// this.velocity.y = dy;

		this.applyForce(new Vector2(dx, dy));

		if (dx || dy) {
			this.walkCyclePlace = (this.walkCyclePlace + 1) % this._walkCycleFrames;
			this.tileIndex = this.walkCyclePlace > this._walkCycleFrames / 2 ? 2 : 1;

		}
		else {
			this.tileIndex = 0;
			this.walkCyclePlace = 0;
		}
 
		
		// camera follow player
		if (this.pos.x > cameraPos.x + g_game.CAMERA_LAG) {
			cameraPos.x = this.pos.x - g_game.CAMERA_LAG;
		}
		if (this.pos.x < cameraPos.x - g_game.CAMERA_LAG) {
			cameraPos.x = this.pos.x + g_game.CAMERA_LAG;
		}
		if (this.pos.y > cameraPos.y + g_game.CAMERA_LAG) {
			cameraPos.y = this.pos.y - g_game.CAMERA_LAG;
		}
		if (this.pos.y < cameraPos.y - g_game.CAMERA_LAG) {
			cameraPos.y = this.pos.y + g_game.CAMERA_LAG;
		}

		super.update(); // update object physics and position
 
	}

	render() {
		//super.render(); // draw object as a sprite
		// your object render code here

		drawTile(this.pos, this.size, this.tileIndex, this.tileSize, this.color, this.angle, this.mirror);
 
	}

}