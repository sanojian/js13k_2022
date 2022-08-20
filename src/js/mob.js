/** @format */
class Mob extends EngineObject {
	constructor(pos, size, tileIndex) {
		super(pos, size, tileIndex, MOB_SIZE);

		this.walkCyclePlace = 0;
		this._walkCycleFrames = 60;
		this._hitbox = vec2(0.5);

		this.setCollision(true, true);
		this.mass = 1;
		this.damping = 1;
		this.elasticity = 1;

		this._maxSpeed = 0.3;

		this.bumpWalk = 0;
		this.mirror = false;
		this.hp = 3;

		this.blood = [];
	}

	applyDrag(dragConst) {
		let speed = this.velocity.length();

		let drag = speed * speed * dragConst;

		if (drag > speed) drag = speed;

		let dragForce = this.velocity.normalize(drag);

		this.velocity = this.velocity.subtract(dragForce);
	}

	update() {
		if (this.velocity.length() > 0.01) {
			this.walkCyclePlace = (this.walkCyclePlace + 1) % this._walkCycleFrames;
			this.mirror = this.walkCyclePlace > this._walkCycleFrames / 2 ? true : false;
			this.bumpWalk = this.walkCyclePlace > this._walkCycleFrames / 2 ? 1 / 12 : 0;
		} else {
			this.walkCyclePlace = 0;
			this.mirror = false;
		}

		if (this.bloodEmitter) this.bloodEmitter.pos = this.pos;

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

	drawBlood() {
		// blood
		for (let i = 0; i < this.blood.length; i++) {
			let blood = this.blood[i];
			for (let j = 0; j < blood.pattern.length; j++) {
				if (blood.pattern[j]) {
					let x = this.pos.x + blood.pos.x - (j % 2) / 12;
					let y = this.pos.y + blood.pos.y - Math.floor(j / 2) / 12;
					drawRect(vec2(x, y), vec2(1 / 12), g_game.colorBlood);
				}
			}
		}
	}

	hit(velocity, pos) {
		this.hp--;

		this.applyForce(velocity);

		this.bloodEmitter = bloodParticles(this.pos, 0.1);

		if (this.hp <= 0) {
			let corpse = new Corpse(this.pos.copy(), this.size.copy(), this.tileIndex);
			corpse.push(velocity);
			g_game.corpses.push(corpse);
			this.destroy();

			let i = g_game.enemies.indexOf(this);
			g_game.enemies.splice(i, 1);

			return true;
		}

		// splatter on floor
		let splatterPattern = { pos: pos, pattern: [] };
		for (let i = 0; i < 16; i++) {
			splatterPattern.pattern.push(Math.random() > 0.5 ? 1 : 0);
		}
		g_game.splatter.push(splatterPattern);

		// splatter on mob
		let wound = { pos: vec2((this.pos.x - pos.x) / 2, (this.pos.y - pos.y) / 2), pattern: [] };
		for (let i = 0; i < 4; i++) {
			wound.pattern.push(Math.random() > 0.5 ? 1 : 0);
		}
		this.blood.push(wound);

		return false;
	}
}
