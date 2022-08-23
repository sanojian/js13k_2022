/** @format */

class AmmoBox extends EngineObject {
	constructor(pos, size, tileIndex) {
		super(pos, size, tileIndex, TILE_SIZE);
		this._hitbox = vec2(0.4);
	}

	update() {
		if (isOverlapping(this.pos, this._hitbox, g_game.player.pos, g_game.player._hitbox)) {
			switch (this.tileIndex) {
				case g_game.tileNumbers.boxBullets:
					g_game.player.ammoBullets += 24;
					break;
				case g_game.tileNumbers.boxShells:
					g_game.player.ammoShells += 12;
					break;
				case g_game.tileNumbers.boxRifleAmmo:
					g_game.player.ammoRifle += 4;
					break;
				default:
					// i dunno, bullets?
					g_game.player.ammoBullets += 24;
			}
			g_soundPickup.play(this.pos);
			this.destroy();
		}
	}
}
