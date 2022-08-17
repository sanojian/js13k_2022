class ShotGun extends Gun {


	constructor(pos, size, tileIndex, tileSize, angle, color) {
		super(pos, size, 15, tileSize, angle, color);
		// your object init code here
		this._distance = 0.3;
		this._mysize = size.y;
		this._speed = 0.3;
		this._maxAmmo = 2;

		this.ammo = this._maxAmmo;
		this.reloadTimePerBullet = 0.75;

		this.soundFire = new Sound([2.45,,352,.07,.01,.2,4,3.04,,.4,,,.15,1.5,,.7,.12,.2]);			
		
	}

	fire() {

		if (this.reloading) {
			//this.soundEmpty.play();
			return;
		}


		this.ammo--;

		this.soundFire.play();

		let angle = -this.angle;
		let bullet = new Bullet(this.pos.copy(), this.size.copy(), 16, this.tileSize.copy(), -angle);
		bullet.velocity.x = Math.cos(angle) * this._speed;
		bullet.velocity.y = Math.sin(angle) * this._speed;

		angle = -this.angle + Math.PI/24;
		bullet = new Bullet(this.pos.copy(), this.size.copy(), 16, this.tileSize.copy(), -angle);
		bullet.velocity.x = Math.cos(angle) * this._speed;
		bullet.velocity.y = Math.sin(angle) * this._speed;

		angle = -this.angle - Math.PI/24;
		bullet = new Bullet(this.pos.copy(), this.size.copy(), 16, this.tileSize.copy(), -angle);
		bullet.velocity.x = Math.cos(angle) * this._speed;
		bullet.velocity.y = Math.sin(angle) * this._speed;

	}


}