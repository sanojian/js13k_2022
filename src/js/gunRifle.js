/** @format */

class Rifle extends Gun {
	constructor(pos, size) {
		super(pos, size, g_game.tileNumbers.rifle);
		// your object init code here
		this._distance = 0.3;
		this._mysize = size.y;
		this._speed = 0.5;

		this._maxAmmo = 1;
		this._ammoIconTile = g_game.tileNumbers.rifleAmmoIcon;
		this._hitbox = vec2(0.4);

		this.ammo = this._maxAmmo;
		this.reloading = false;
		this.reloadTimer = undefined;
		this.reloadTimePerBullet = 2;

		this._soundFire = new Sound([3, , 164.8138, , , , 4, , , , , , , , , -0.3]);
	}

	fire() {
		if (super.fire(g_game.colorBulletCasing)) {
			const penetration = 12;

			let bullet = new Bullet(this.pos.copy(), 0, g_game.colorRifleRound, 40, penetration);
			bullet.velocity.x = Math.cos(-this.angle) * this._speed;
			bullet.velocity.y = Math.sin(-this.angle) * this._speed;
		}
		return true;
	}
}
