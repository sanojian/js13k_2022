class Gun extends EngineObject {


	constructor(pos, size, tileIndex, tileSize, angle, color) {
		super(pos, size, tileIndex, tileSize, angle, color);
		// your object init code here
		this._distance = 0.7;
		this._mysize = size.y;
		this._speed = 0.4;

		this.ammo = 6;
		this.reloading = false;
		this.reloadTimer = undefined;
		this.reloadTimePerBullet = 0.25;

		this.soundFire = new Sound([2.21, , 164.8138, , , , 4, , , , , , , , , -0.3]);			
		
		//this.soundEmpty = new Sound([, .3, 0, .01, , .01, 4, 0, 20, 6.6, -600, .07, .32, 3.6, 12, , , , , .12]);
		this.soundReload = new Sound([, 0.3, 0, 0.01, , 0.01, 4, 0, 20, 6.6, 600, 0.07, 0.32, 3.6, 12, , , , , 0.12]);
	}

	update() {
		// your object update code here

		if (keyIsDown(82)) // r
		{ 
			this.reload();
			return;
		}


		if (this.owner) {
			let angle = Math.atan2(mousePos.y - this.owner.pos.y, mousePos.x - this.owner.pos.x);

			this.pos.x = this.owner.pos.x + this._distance * Math.cos(angle);
			this.pos.y = this.owner.pos.y + this._distance * Math.sin(angle);

			this.angle = -angle;
			this.size.y = Math.abs(this.angle) > Math.PI / 2 ? -this._mysize : this._mysize;
		
			if (mouseWasPressed(0)) {
				musicResume();
				this.fire();
			}
		
			if (this.reloading) {
				if (this.reloadTimer.elapsed()) {
					this.soundReload.play();

					this.ammo = Math.min(6, this.ammo + 1);
					this.reloadTimer.set(this.reloadTimePerBullet);
					if (this.ammo == 6) {
						this.reloadTimer.unset();
						this.reloading = false;
					}
				}
			}
		}

		if (!this.ammo && !this.reloading) {
			//this.soundEmpty.play();
    	  	this.reload();
    	}


		super.update(); // update object physics and position
 
	}

	render() {
		super.render(); // draw object as a sprite
		// your object render code here
	}

	setOwner(player) {
		this.owner = player;
		player.gun = this;
	}

	fire() {

		if (this.reloading) {
			//this.soundEmpty.play();
			return;
		}


		this.ammo--;

		this.soundFire.play();

		let bullet = new Bullet(this.pos.copy(), this.size.copy(), 4, this.tileSize.copy(), this.angle);
		bullet.velocity.x = Math.cos(-this.angle) * this._speed;
		bullet.velocity.y = Math.sin(-this.angle) * this._speed;

	}

	reload() {
		if (this.reloading) {
			return;
		}
		this.reloadTimer = new Timer(this.reloadTimePerBullet);
		this.reloading = true;
	}

}