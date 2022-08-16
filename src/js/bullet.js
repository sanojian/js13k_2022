class Bullet extends EngineObject {


	constructor(pos, size, tileIndex, tileSize, angle, color) {
		super(pos, size, tileIndex, tileSize, angle, color);
		// your object init code here

		this._lifetime = 30;
		this._hitbox = vec2(0.25);

		this.timeAlive = 0;
		//this.setCollision(0, 0);
	}

	update() {
		// your object update code here

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

		for (let i = 0; i < g_game.walls.length; i++) {
			let wall = g_game.walls[i];
			if (isOverlapping(this.pos, this._hitbox, wall.pos, vec2(1))) {
				this.destroy();
				return;
			}
		}


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

}