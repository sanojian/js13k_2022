/** @format */
class Corpse extends EngineObject {
	constructor(pos, size, tileIndex, tileSize, angle, color) {
		super(pos, size, tileIndex, tileSize, angle, new Color(0.7, 0.5, 0.5));
		// your object init code here

		this._animLifetime = 10;

		this.timeAlive = 0;
		this.fallDirection = 1;
		this.setCollision(0, 0, 1);

		this.soundDie = new Sound([2.37, 0.5, 40, , 0.18, 0.54, 2, 3.83, 0.5, 2, , , 0.06, 0.8, , 0.5, , 0.33, 0.06, 0.22]);
		this.soundDie.play();

		var radius = 2;

		// prettier-ignore
		this.bloodEmitter = new ParticleEmitter(
			pos, 0, radius/2, .2, 50*radius, PI, // pos, angle, emitSize, emitTime, emitRate, emiteCone
			0, undefined,        // tileIndex, tileSize
			new Color(.8,.1,.1), new Color(1,0,0), // colorStartA, colorStartB
			new Color(0,0,0,0), new Color(0,0,0,0), // colorEndA, colorEndB
			1, .5, 2, .1, .05,   // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
			.9, 1, -.3, PI, .1,  // damping, angleDamping, gravityScale, particleCone, fadeRate, 
			.5, 0, 0, 0, 1e8     // randomness, collide, additive, randomColorLinear, renderOrder
		);
	}

	update() {
		// your object update code here

		this.timeAlive++;

		this.angle = (this.fallDirection * Math.min(1, this.timeAlive / this._animLifetime) * Math.PI) / 2;

		this.velocity.x = this.velocity.x * 0.9;
		this.velocity.y = this.velocity.y * 0.9;

		this.bloodEmitter.pos = this.pos;

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
