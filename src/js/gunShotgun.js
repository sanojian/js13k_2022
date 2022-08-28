/** @format */
class Shotgun extends Gun {
	constructor(pos) {
		super(pos, g_game.tileNumbers.shotgun);
		this._distance = 0.3;
		this._speed = 0.3;
		this._maxAmmo = 2;
		this._ammoIconTile = g_game.tileNumbers.shellIcon;

		this.ammo = this._maxAmmo;
		this.reloadTimePerBullet = 0.6;

		this._soundFire = new Sound([3, , 352, 0.07, 0.01, 0.2, 4, 3.04, , 0.4, , , 0.15, 1.5, , 0.7, 0.12, 0.2]);
	}

	fire() {
		if (super.fire(g_game.colorShellCasing)) {
			var bulletColor = new Color(217 / 255, 87 / 255, 99 / 255);
			var bulletLife = 22;

			const bullets = 4;
			const spread = PI / 6;
			let angle = -this.angle - spread / 2;
			for (let i = 0; i < bullets; i++) {
				let bullet = new Bullet(this.pos.copy(), 0, bulletColor, bulletLife);
				bullet.velocity.x = Math.cos(angle) * this._speed;
				bullet.velocity.y = Math.sin(angle) * this._speed;
				angle += spread / bullets;
			}
		}
		return true;
	}
}
