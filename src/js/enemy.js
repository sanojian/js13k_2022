class Enemy extends EngineObject  {


	constructor(pos, size, tileIndex, tileSize, angle, color) {
		super(pos, size, tileIndex, tileSize, angle, color);
		// your object init code here
		this._speed = 0.3;
		this._walkCycleFrames = 30;
		this._hitbox = vec2(0.5);

		this.tileIndex = 6;
		this.setCollision(1, 1);

	}

	update() {
		// your object update code here
		let dx = 0;
		let dy = 0;

		this.velocity.x = dx;
		this.velocity.y = dy;

		if (dx || dy) {
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

		/*const angle = Math.atan2(velocity.y, velocity.x);

		// create a particle emitter
		let particleEmiter = new ParticleEmitter (
			pos,					// pos
			0,						// angle
			1,						// emitSize
			0,						// emitTime
			500,					// emitRate
			angle - Math.PI/6,  					// emiteCone
			-1,						// tileIndex
			vec2(12),  				// tileSize
			new Color(1, 0, 0),		// colorStartA
			new Color(1, 0, 0), 	// colorStartB
			new Color(1, 0, 0),		//colorEndA
			new Color(1, 0, 0), 	// colorEndB
			2,						// particleTime
			0.2,					// sizeStart
			0.2,					// sizeEnd
			0.1,					// particleSpeed
			0.05,  					// particleAngleSpeed
			0.99,					// damping
			1,						// angleDamping
			1,						// gravityScale
			angle + Math.PI/6,						// particleCone
			0.05,  					// fadeRate, 
			0.5,						// randomness
			1                // collide, additive, randomColorLinear, renderOrder
		);*/

		let corpse = new Corpse(this.pos.copy(), this.size.copy(), this.tileIndex, this.tileSize.copy());
		corpse.push(velocity);
		this.destroy();
	}

}