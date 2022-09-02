/** @format */

class AmmoBox extends EngineObject {
	constructor(pos, gunType) {
		super(pos, vec2(1), getAmmoForGunType(gunType), TILE_SIZE);

		this._hitbox = vec2(0.5);
	}

	update() {
		if (isOverlapping(this.pos, this._hitbox, g_player.pos, g_player._hitbox)) {
			if (this.tileIndex == tileNumbers_boxShells) {
				g_player.ammoShells += 12;
			} else if (this.tileIndex == tileNumbers_boxRifleAmmo) {
				g_player.ammoRifle += 6;
			} else {
				g_player.ammoBullets += 24;
			}

			soundPickup.play(this.pos);
			this.destroy();
		}
	}
}
