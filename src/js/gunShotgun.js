/** @format */
class ShotGun extends Gun {
	constructor(pos, size, tileSize, angle, color) {
		super(pos, size, g_game.tileNumbers.shotgun, tileSize, angle, color);
		// your object init code here
		this._distance = 0.3;
		this._mysize = size.y;
		this._speed = 0.3;
		this._maxAmmo = 2;
		this._ammoIconTile = g_game.tileNumbers.shellIcon;

		this.ammo = this._maxAmmo;
		this.reloadTimePerBullet = 0.75;

		this.soundFire = new Sound([2.45, , 352, 0.07, 0.01, 0.2, 4, 3.04, , 0.4, , , 0.15, 1.5, , 0.7, 0.12, 0.2]);
	}

	fire() {
		if (this.reloading) {
			//this.soundEmpty.play();
			return;
		}

		this.ammo--;

		this.soundFire.play();

		var bulletColor = new Color(1, 1, 0);
		var bulletLife = 20;

		let angle = -this.angle;
		let bullet = new Bullet(this.pos.copy(), -angle, bulletColor, bulletLife);
		bullet.velocity.x = Math.cos(angle) * this._speed;
		bullet.velocity.y = Math.sin(angle) * this._speed;

		angle = -this.angle + Math.PI / 24;
		bullet = new Bullet(this.pos.copy(), -angle, bulletColor, bulletLife);
		bullet.velocity.x = Math.cos(angle) * this._speed;
		bullet.velocity.y = Math.sin(angle) * this._speed;

		angle = -this.angle - Math.PI / 24;
		bullet = new Bullet(this.pos.copy(), -angle, bulletColor, bulletLife);
		bullet.velocity.x = Math.cos(angle) * this._speed;
		bullet.velocity.y = Math.sin(angle) * this._speed;
	}
}
