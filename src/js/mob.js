/** @format */
class Mob extends EngineObject {
	constructor(pos, size, tileIndex, tileSize, angle, color) {
		super(pos, size, tileIndex, tileSize, angle, color);

		this.walkCyclePlace = 0;
		this._walkCycleFrames = 60;
		this._hitbox = vec2(0.5);

		this.setCollision(1, 1);
		this.mass = 1;
		this.damping = 1;
		this.elasticity = 1;

		this._maxSpeed = 0.3;

		this.bumpWalk = 0;
	}

	applyDrag(dragConst) {
		let speed = this.velocity.length();

		let drag = speed * speed * dragConst;

		let dragForce = this.velocity.normalize(drag);

		this.velocity = this.velocity.subtract(dragForce);
	}

	update() {

		if (this.velocity.length() > 0.01) {
			this.walkCyclePlace = (this.walkCyclePlace + 1) % this._walkCycleFrames;
			this.mirror = this.walkCyclePlace > this._walkCycleFrames / 2 ? true : false;
			this.bumpWalk = this.walkCyclePlace > this._walkCycleFrames / 2 ? 1/12 : 0;
		} else {
			this.walkCyclePlace = 0;
			this.mirror = false;
		}

		super.update(); // update object physics and position
	}

	render() {

		drawTile(
			vec2(this.pos.x, this.pos.y + this.bumpWalk),
			this.size,
			this.tileIndex,
			this.tileSize,
			this.color,
			this.angle,
			this.mirror
		);
	}

	hit(velocity, pos) {
		this.hp--;

		this.applyForce(velocity);

		let radius = 0.5;

		// prettier-ignore
		this.bloodEmitter = new ParticleEmitter(
			this.pos, 0, radius/2, .02, 50*radius, PI, // pos, angle, emitSize, emitTime, emitRate, emiteCone
			0, undefined,        // tileIndex, tileSize
			new Color(.8,.1,.1), new Color(1,0,0), // colorStartA, colorStartB
			new Color(0,0,0,0), new Color(0,0,0,0), // colorEndA, colorEndB
			1, .5, 2, .1, .05,   // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
			.9, 1, -.3, PI, .1,  // damping, angleDamping, gravityScale, particleCone, fadeRate, 
			.5, 0, 0, 0, 1e8     // randomness, collide, additive, randomColorLinear, renderOrder
		);

		if (this.hp <= 0) {
			let corpse = new Corpse(this.pos.copy(), this.size.copy(), this.tileIndex, this.tileSize.copy());
			corpse.push(velocity);
			this.destroy();
			return true;
		}

		return false;
	}
}
