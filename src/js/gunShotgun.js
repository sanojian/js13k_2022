/** @format */
class ShotGun extends Gun {
	constructor(pos, size) {
		super(pos, size, g_game.tileNumbers.shotgun);
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

		var bulletColor = new Color(217 / 255, 87 / 255, 99 / 255);
		var bulletLife = 20;

		let angle = -this.angle;
		let bullet = new Bullet(this.pos.copy(), 0, bulletColor, bulletLife);
		bullet.velocity.x = Math.cos(angle) * this._speed;
		bullet.velocity.y = Math.sin(angle) * this._speed;

		angle = -this.angle + Math.PI / 24;
		bullet = new Bullet(this.pos.copy(), 0, bulletColor, bulletLife);
		bullet.velocity.x = Math.cos(angle) * this._speed;
		bullet.velocity.y = Math.sin(angle) * this._speed;

		angle = -this.angle - Math.PI / 24;
		bullet = new Bullet(this.pos.copy(), 0, bulletColor, bulletLife);
		bullet.velocity.x = Math.cos(angle) * this._speed;
		bullet.velocity.y = Math.sin(angle) * this._speed;
	}
}
