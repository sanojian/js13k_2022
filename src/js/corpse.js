class Corpse extends EngineObject {


	constructor(pos, size, tileIndex, tileSize, angle, color) {
		super(pos, size, tileIndex, tileSize, angle, color);
		// your object init code here

		this._animLifetime = 10;

		this.timeAlive = 0;
		this.fallDirection = 1;
		this.setCollision(0, 0, 1);

		this.soundDie = new Sound([2.37, 0.5, 100, 0.06, 0.18, 0.54, 2, 3.83, 0.5, , , , 0.06, 0.8, , 0.5, , 0.33, , 0.22]);
		this.soundDie.play();

		this.particleEmiter = new ParticleEmitter (
			pos,					// pos
			0,						// angle
			1,						// emitSize
			1000,						// emitTime
			500,					// emitRate
			angle - Math.PI/6,  					// emiteCone
			-1,						// tileIndex
			vec2(12),  				// tileSize
			new Color(1, 0, 0),		// colorStartA
			new Color(0.9, 0, 0), 	// colorStartB
			new Color(0, 0, 0),		//colorEndA
			new Color(0, 0, 0), 	// colorEndB
			2,						// particleTime
			6.6,					// sizeStart
			0.2,					// sizeEnd
			0.01,					// particleSpeed
			0.05,  					// particleAngleSpeed
			0.99,					// damping
			1,						// angleDamping
			0,						// gravityScale
			angle + Math.PI/6,						// particleCone
			0.05,  					// fadeRate, 
			0.5,						// randomness
			0                // collide, additive, randomColorLinear, renderOrder
		);

	}

	update() {
		// your object update code here
		
		this.timeAlive++;

		this.angle = this.fallDirection * Math.min(1, this.timeAlive / this._animLifetime) * Math.PI / 2;

		this.velocity.x = this.velocity.x * 0.9;
		this.velocity.y = this.velocity.y  * 0.9;


		super.update(); // update object physics and position
 
	}

	render() {
		super.render(); // draw object as a sprite
		// your object render code here
	}

	push(velocity) {
		this.velocity.x = velocity.x / 3;
		this.velocity.y = velocity.y / 3;
		this.fallDirection = velocity.x > 0 ? 1 : -1;
	}

}