/** @format */
class Corpse extends EngineObject {
	constructor(pos, size, tileIndex) {
		super(pos, size, tileIndex, TILE_SIZE, 0, new Color(0.7, 0.5, 0.5));
		// your object init code here

		this._animLifetime = 10;

		this.timeAlive = 0;
		this.fallDirection = 1;
		this.finalAngle = Math.PI;
		this.setCollision(false, false, true);

		var radius = 2;

		// prettier-ignore
		/*this.bloodEmitter = new ParticleEmitter(
			pos, 0, radius/2, .2, 50*radius, PI, // pos, angle, emitSize, emitTime, emitRate, emiteCone
			0, undefined,        // tileIndex, tileSize
			new Color(.8,.1,.1), g_game.colorBlood, // colorStartA, colorStartB
			new Color(0,0,0,0), new Color(0,0,0,0), // colorEndA, colorEndB
			1, .5, 2, .1, .05,   // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
			.9, 1, -.3, PI, .1,  // damping, angleDamping, gravityScale, particleCone, fadeRate, 
			.5, false, false, false, 1e8     // randomness, collide, additive, randomColorLinear, renderOrder
		);*/
	}

	update() {
		// your object update code here

		this.timeAlive++;

		this.angle = (this.fallDirection * Math.min(1, this.timeAlive / this._animLifetime) * this.finalAngle) / 2;

		this.velocity.x = this.velocity.x * 0.9;
		this.velocity.y = this.velocity.y * 0.9;

		//this.bloodEmitter.pos = this.pos;

		super.update(); // update object physics and position
	}

	render() {}

	renderNow() {
		super.render(); // draw object as a sprite
		// your object render code here
	}

	push(velocity) {
		this.velocity.x = velocity.x / 3;
		this.velocity.y = velocity.y / 3;
		this.fallDirection = velocity.x > 0 ? 1 : -1;
		this.finalAngle = -Math.PI / 2 + Math.random() * Math.PI + Math.PI;
	}
}
