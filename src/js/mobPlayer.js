/** @format */
class MobPlayer extends Mob {
	constructor(pos) {
		super(pos, vec2(0.8), g_game.tileNumbers.player);
		// your object init code here

		this.miniFace = g_game.miniTileNumbers.miniFacePlayer;

		this._walkCycleFrames = 20;

		this.setCollision(true, true);
		this.mass = 1;
		this.damping = 0.95;
		this.mirror = false;
		this.gun = undefined;

		this.ammoBullets = 3;
		this.ammoShells = 0;
		this.ammoRifle = 0;

		this.hp = 1;

		this.soundScream = new Sound([
			1, 0, 440, 0, 0.1, 1, 3, 1, -0.2, 0, 50, 0, 0, 0.4, 0, 0.05, 0.05, 0.9, 0.5, 0,
			//1, 0, 523.2511, 0, 1, 1, 0, 0, -0.1, 0, 0, 0, 0, 0.5, 0, 0.05, 0.5, 0.8, 1, 0
		]);
	}

	getAmmoForGunType(gunType) {
		switch (gunType) {
			case g_game.tileNumbers.shotgun:
				return this.ammoShells;
			case g_game.tileNumbers.rifle:
				return this.ammoRifle;
			default:
				return this.ammoBullets;
		}
	}

	update() {
		const speed = 0.01;

		if (this.hp > 0) {
			let dx = 0;
			let dy = 0;

			//if (isUsingGamepad) {
			//	dx = gamepadStick(0).x * this._speed;
			//	dy = gamepadStick(0).y * this._speed;
			//} else {
			if (keyIsDown(38)) {
				// key w
				dy = speed;
			}
			if (keyIsDown(37)) {
				// key a
				dx = -speed;
			}
			if (keyIsDown(40)) {
				// key s
				dy = -speed;
			}
			if (keyIsDown(39)) {
				// key d
				dx = speed;
			}
			//}

			this.applyForce(new Vector2(dx, dy));

			this.applyDrag(1.1);
		} else {
			if (this.gun) {
				this.gun.owner = null;
				this.gun = null;
			}
			this.applyDrag(1.7);
		}

		super.update(); // update object physics and position
	}

	collideWithObject(o) {
		if (
			(o instanceof Vampire && o.transformed) ||
			o instanceof Zombie ||
			o instanceof Ghost ||
			o instanceof BossZombie ||
			o instanceof Boulder
		) {
			let v = this.pos.subtract(o.pos);
			let d = v.length();
			if (d < 0.5) {
				if (!g_CHEATMODE) this.hp--;
				v.normalize(0.01);
				this.applyForce(v);

				makeParticles(this.pos, 0.05);
				if (Math.random() < 0.3) {
					this.splatter(this.pos.copy());
				}

				if (this.hp == 0) {
					for (let i = 0; i < 10; i++) {
						this.splatter(this.pos);
						makeParticles(this.pos, rand(1));
					}

					this.angle = PI / 2;
					this.color = new Color(0.7, 0.5, 0.5);
					this.soundScream.play(this.pos);
				}
			}
		}

		return false; // no auto resolve of collision
	}

	render() {
		super.render(); // draw object as a sprite

		if (this.hp > 0) {
			// arms
			let toPos = this.gun ? this.gun.pos : this.pos.add(vec2((this.mirror ? 3 : 6) / 12, 7 / 16 + this.bumpWalk));
			drawLine(
				this.pos.add(vec2(3 / 12, 2 / 16 + this.bumpWalk)),
				toPos,
				1 / 12,
				new Color(172 / 255, 50 / 255, 50 / 255),
				!!glEnable
			);
			toPos = this.gun ? this.gun.pos : this.pos.add(vec2(-(this.mirror ? 6 : 3) / 12, 7 / 16 + this.bumpWalk));
			drawLine(
				this.pos.add(vec2(-3 / 12, 2 / 16 + this.bumpWalk)),
				toPos,
				1 / 12,
				new Color(172 / 255, 50 / 255, 50 / 255),
				!!glEnable
			);
		}
	}

	postRender() {
		// draw face
		let toCursor = mousePos.subtract(this.pos);
		if (toCursor.y <= 0) {
			drawTile(
				this.pos.add(vec2((toCursor.x > 0 ? 1 : 0) / 12, 3 / 12 + this.bumpWalk)),
				vec2(1 / 3),
				this.miniFace,
				MINI_TILE_SIZE
			);
		}
	}
}
