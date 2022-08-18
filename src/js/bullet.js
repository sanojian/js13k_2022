/** @format */

class Bullet extends EngineObject {
	constructor(pos, angle, color, lifetime) {
		let tileIndex = g_game.tileNumbers.bulletShotgun;
		let size = vec2(0.15);
		super(pos, size, tileIndex, tileSize, angle, color);

		this._lifetime = lifetime;
		this._hitbox = vec2(0.25);

		this.timeAlive = 0;
		this.setCollision(true, true, true);
	}

	update() {
		// your object update code here

		/*
		for (let i = 0; i < g_game.enemies.length; i++) {
			let enemy = g_game.enemies[i];
			if (isOverlapping(this.pos, this._hitbox, enemy.pos, enemy._hitbox)) {
				if (enemy.hit(this.velocity.copy(), this.pos.copy())) {
					g_game.enemies.splice(i, 1);
					i--;
				}
				this.destroy();
				return;
			}
		}
*/
		// for (let i = 0; i < g_game.walls.length; i++) {
		// 	let wall = g_game.walls[i];
		// 	if (isOverlapping(this.pos, this._hitbox, wall.pos, vec2(1))) {
		// 		this.destroy();
		// 		return;
		// 	}
		// }

		this.timeAlive++;
		if (this.timeAlive > this._lifetime) {
			this.destroy();
			return;
		}

		super.update(); // update object physics and position
	}

	render() {
		super.render(); // draw object as a sprite
		// your object render code here
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
		return false; // no more col resolve
	}

	collideWithObject(o) {
		//console.log("bullet hit : ", o);

		if (o instanceof Zombie) {
			//console.log("bullet hit zombie:", o);
			o.hit(this.velocity.copy(), this.pos.copy());
			this.destroy();
		}

		return false; // no auto resolve of collision
	}
}
