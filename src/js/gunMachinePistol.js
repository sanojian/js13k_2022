/** @format */

class MachinePistol extends Gun {
	constructor(pos) {
		super(pos, tileNumbers_pistol);
		// your object init code here
		this._distance = 0.7;
		this._speed = 0.4;

		this._maxAmmo = 20;
		this.ammo = this._maxAmmo;
		this._ammoIconTile = tileNumbers_bulletIcon;

		this.reloadTimePerBullet = 0.02;

		this._soundFire = soundPistol;
		this.autoFire = true;

		this.fireDelay = 100; // ms between shots
		this.lastFireTime = 0;
	}

	fire() {
		var now = new Date().getTime();

		if (now - this.lastFireTime < this.fireDelay) return;

		this.lastFireTime = now;

		if (super.fire(colorBullet)) {
			let bullet = new Bullet(this.pos.copy(), 0, colorBullet, 28);
			bullet.velocity.x = Math.cos(-this.angle) * this._speed;
			bullet.velocity.y = Math.sin(-this.angle) * this._speed;
		}
		return true;
	}
}
