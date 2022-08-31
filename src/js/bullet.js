/** @format */

class Bullet extends EngineObject {
	constructor(pos, angle, color, lifetime, penetration) {
		let size = vec2(0.15);
		super(pos, size, -1, TILE_SIZE, angle, color);

		this._lifetime = lifetime;
		this._hitbox = vec2(0.25);

		this.penetration = penetration || 1;
		this.timeAlive = 0;
		this.setCollision(true, true, true);

		this.hitSound = soundBulletHit;
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

	hitWall() {
		// bullet holes
		let pos = this.pos.add(this.velocity.normalize(rand(0.2, 0.6)));
		g_game.holes.push({ pos: pos, color: g_game.colorBlack });
		for (let i = 0; i < 4; i++) {
			g_game.holes.push({
				pos: pos.add(randInCircle(1 / 12)),
				color: new Color(0, 0, 0, rand(0.1, 0.5)),
			});
		}

		fx.addSpark(pos.copy());
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
		this.hitWall();
		this.destroy();
		this.hitSound.play();
		return false; // no more col resolve
	}

	collideWithObject(o) {
		//console.log("bullet hit : ", o);

		if (o instanceof Enemy) {
			//console.log("bullet hit zombie:", o);
			o.hit(this.velocity.copy(), this.pos.copy());
			this.penetration--;
			if (this.penetration <= 0) this.destroy();
			this.hitSound.play();
		}

		return false; // no auto resolve of collision
	}
}
