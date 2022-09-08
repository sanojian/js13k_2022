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
		this.timeAlive++;
		if (this.timeAlive > this._lifetime) {
			this.destroy();
			return;
		}
		super.update();
	}

	hitWall(big) {
		// bullet holes
		let pos = this.pos.add(this.velocity.normalize(rand(0.2, 0.6)));
		g_holes.push({ pos: pos, color: colorBlack });
		for (let i = 0; i < 4; i++) {
			g_holes.push({
				size: big ? 3 : 1,
				pos: pos.add(randInCircle(1 / 12)),
				color: new Color(0, 0, 0, rand(0.1, 0.5)),
			});
		}

		fx.addSpark(pos.copy());
	}

	collideWithTile(tileData, pos) {
		if (tileData == tileNumbers_door) {
			let idx = pos.x + "_" + pos.y;
			g_doors[idx].hp--;
			this.hitWall(true);
			soundBoulderDestroy.play(pos, 1.5);
			makeParticles(pos.add(vec2(0.5)), 0.1, colorWhite, 0.25);
			if (g_doors[idx].hp <= 0) {
				let floorTile = new TileLayerData(
					tileNumbers_floorStone,
					randInt(4),
					false,
					new Color(1, 1, 1, rand(0.2, 0.5))
				);
				tileLayer.setData(pos, floorTile, true);
				tileLayer.redraw(); // TODO: Could be SLOW ... find better solution !
				soundBoulderDestroy.play(pos, 3);
				makeParticles(pos.add(vec2(0.5)), 0.3, colorWhite, 0.5);
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
		if (this.penetration <= 0) return;

		if (o instanceof Enemy) {
			//console.log("bullet hit zombie:", o);
			o.hit(this.velocity.copy(), this.pos.copy());
			this.penetration--;
			if (this.penetration == 0) {
				this.destroy();
				return;
			}
			this.hitSound.play();
		}

		return false; // no auto resolve of collision
	}
}
