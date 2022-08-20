/** @format */

class Pistol extends Gun {
	constructor(pos, size, tileIndex) {
		super(pos, size, g_game.tileNumbers.pistol);
		// your object init code here
		this._distance = 0.7;
		this._mysize = size.y;
		this._speed = 0.4;

		this._maxAmmo = 6;
		this._ammoIconTile = g_game.tileNumbers.bulletIcon;
		this._hitbox = vec2(0.4);

		this.ammo = this._maxAmmo;
		this.reloading = false;
		this.reloadTimer = undefined;
		this.reloadTimePerBullet = 0.25;

		this._soundFire = new Sound([2.21, , 164.8138, , , , 4, , , , , , , , , -0.3]);
	}

	fire() {
		if (super.fire()) {
			let bullet = new Bullet(this.pos.copy(), 0, new Color(251 / 255, 242 / 255, 54 / 255), 30);
			bullet.velocity.x = Math.cos(-this.angle) * this._speed;
			bullet.velocity.y = Math.sin(-this.angle) * this._speed;
		}
		return true;
	}
}
