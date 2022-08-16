class Enemy extends EngineObject  {


	constructor(pos, size, tileIndex, tileSize, angle, color) {
		super(pos, size, tileIndex, tileSize, angle, color);
		// your object init code here
		this._speed = 0.3;
		this.walkCyclePlace = 0;
		this._walkCycleFrames = 30;
		this._hitbox = vec2(0.5);

		this.tileIndex = 6;
		this.setCollision(1, 1);
		this.mass = 1
		this.damping = 0.1;
		this.maxSpeed = 1;
	}

	update() {
		// your object update code here
		let toPlayer = g_game.player.pos.subtract(this.pos).normalize(.1);


		this.applyForce(toPlayer)

		if (this.velocity.length() > .1) {
			this.walkCyclePlace = (this.walkCyclePlace + 1) % this._walkCycleFrames;
			this.tileIndex = this.walkCyclePlace > this._walkCycleFrames / 2 ? 8 : 7;
		}
		else {
			this.tileIndex = 6;
			this.walkCyclePlace = 0;
		}

		super.update(); // update object physics and position
 
	}

	render() {
		//super.render(); // draw object as a sprite
		// your object render code here

		drawTile(this.pos, this.size, this.tileIndex, this.tileSize, this.color, this.angle, this.mirror);
 
	}

	kill(velocity, pos) {
		let corpse = new Corpse(this.pos.copy(), this.size.copy(), this.tileIndex, this.tileSize.copy());
		corpse.push(velocity);
		this.destroy();
	}

}