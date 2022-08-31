/** @format */

class AmmoBox extends EngineObject {
	constructor(pos, gunType) {
		let tileIndex = 0;
		switch (gunType) {
			case g_game.tileNumbers.rifle:
				tileIndex = g_game.tileNumbers.boxRifleAmmo;
				break;
			case g_game.tileNumbers.shotgun:
				tileIndex = g_game.tileNumbers.boxShells;
				break;
			default:
				tileIndex = g_game.tileNumbers.boxBullets;
		}
		super(pos, vec2(1), tileIndex, TILE_SIZE);

		this._hitbox = vec2(0.5);
	}

	update() {
		if (isOverlapping(this.pos, this._hitbox, g_game.player.pos, g_game.player._hitbox)) {
			switch (this.tileIndex) {
				case g_game.tileNumbers.boxShells:
					g_game.player.ammoShells += 12;
					break;
				case g_game.tileNumbers.boxRifleAmmo:
					g_game.player.ammoRifle += 6;
					break;
				default:
					g_game.player.ammoBullets += 24;
			}
			soundPickup.play(this.pos);
			this.destroy();
		}
	}
}
