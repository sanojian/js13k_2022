/** @format */

class AmmoBox extends EngineObject {
	constructor(pos, gunType) {
		let tileIndex = 0;
		switch (gunType) {
			case tileNumbers_rifle:
				tileIndex = tileNumbers_boxRifleAmmo;
				break;
			case tileNumbers_shotgun:
				tileIndex = tileNumbers_boxShells;
				break;
			default:
				tileIndex = tileNumbers_boxBullets;
		}
		super(pos, vec2(1), tileIndex, TILE_SIZE);

		this._hitbox = vec2(0.5);
	}

	update() {
		if (isOverlapping(this.pos, this._hitbox, g_player.pos, g_player._hitbox)) {
			switch (this.tileIndex) {
				case tileNumbers_boxShells:
					g_player.ammoShells += 12;
					break;
				case tileNumbers_boxRifleAmmo:
					g_player.ammoRifle += 6;
					break;
				default:
					g_player.ammoBullets += 24;
			}
			soundPickup.play(this.pos);
			this.destroy();
		}
	}
}
