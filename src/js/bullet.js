/** @format */

class Bullet extends EngineObject {
	constructor(pos, angle, color, lifetime, penetration) {
		let tileIndex = g_game.tileNumbers.bulletShotgun;
		let size = vec2(0.15);
		super(pos, size, tileIndex, TILE_SIZE, angle, color);

		this._lifetime = lifetime;
		this._hitbox = vec2(0.25);

		this.penetration = penetration || 1;
		this.timeAlive = 0;
		this.setCollision(true, true, true);

		this.hitSound = new Sound([
			1.05, 0.05, 208, 0.01, 0, 0.09, 0, 0, -9.9, 0, 0, 0, 0, 0.4, 0, 0.1, 0.02, 0.75, 0.05, 0.04,
		]);
	}

	update() {
		// your object update code here

		this.timeAlive++;
		if (this.timeAlive > this._lifetime) {
			this.destroy();
			return;
		}

		super.update(); // update object physics and position
	}

	collideWithTile(tileData, pos) {
		if (tileData == g_game.tileNumbers.door) {
			let idx = pos.x + "_" + pos.y;
			g_game.doors[idx].hp--;
			if (g_game.doors[idx].hp <= 0) {
				g_game.tileLayer.setData(pos, 0, true);
				setTileCollisionData(pos, 0);
			}
		}
		this.destroy();
		//this.hitSound.play();
		return false; // no more col resolve
	}

	collideWithObject(o) {
		//console.log("bullet hit : ", o);

		if (o instanceof Zombie || o instanceof Vampire) {
			//console.log("bullet hit zombie:", o);
			o.hit(this.velocity.copy(), this.pos.copy());
			if (!g_CHEATMODE) {
				this.penetration--;
				if (this.penetration <= 0) this.destroy();
			}
			this.hitSound.play();
		}

		return false; // no auto resolve of collision
	}
}
