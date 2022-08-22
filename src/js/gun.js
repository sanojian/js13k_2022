/** @format */

class Gun extends EngineObject {
	constructor(pos, size, tileIndex) {
		super(pos, size, tileIndex, TILE_SIZE);
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

		this._soundFire = undefined;

		this.soundReload = new Sound([, 0.3, 0, 0.01, , 0.01, 4, 0, 20, 6.6, 600, 0.07, 0.32, 3.6, 12, , , , , 0.12]);
	}

	update() {
		// your object update code here

		if (this.owner && this.owner.hp > 0) {
			// key r or space
			if (keyWasReleased(82) || keyWasReleased(32)) {
				this.reload();
				return;
			}

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
					let empty = false;
					if (this.tileIndex == g_game.tileNumbers.pistol || this.tileIndex == g_game.tileNumbers.rifle) {
						empty = g_game.player.ammoBullets <= 0;
						g_game.player.ammoBullets = Math.max(0, g_game.player.ammoBullets - 1);
					} else if (this.tileIndex == g_game.tileNumbers.shotgun) {
						empty = g_game.player.ammoShells <= 0;
						g_game.player.ammoShells = Math.max(0, g_game.player.ammoShells - 1);
					}
					if (!empty) {
						this.soundReload.play();
						this.ammo = Math.min(this._maxAmmo, this.ammo + 1);
						this.reloadTimer.set(this.reloadTimePerBullet);
					}
					if (this.ammo == this._maxAmmo || empty) {
						this.reloadTimer.unset();
						this.reloading = false;
					}
				}
			}

			if (!this.ammo && !this.reloading) {
				//this.soundEmpty.play();
				this.reload();
			}
		} else if (!this.owner) {
			// look for owner

			if (g_game.player.hp > 0 && isOverlapping(this.pos, this._hitbox, g_game.player.pos, g_game.player._hitbox)) {
				this.ammo = 0;
				this.setOwner(g_game.player);
			}
		}

		super.update(); // update object physics and position
	}

	render() {
		super.render(); // draw object as a sprite
		// your object render code here
	}

	setOwner(player) {
		if (player.gun) {
			// throw current gun
			player.gun.pos.x += 2;
			player.gun.pos.y += 2;
			player.gun.owner = null;
		}
		this.owner = player;
		player.gun = this;
		g_soundPickup.play(this.pos);
	}

	fire(color) {
		if (this.reloading) {
			//this.soundEmpty.play();
			return false;
		}

		this.ammo--;
		this._soundFire.play();

		// eject shell
		g_game.shells.push({
			pos: this.pos.copy(),
			velocity: vec2(rand(-1 / 30, 1 / 30), 1.1 / 12),
			angularVelocity: 0.3,
			angle: 0,
			color: color,
			life: Math.floor(rand(20, 40)),
		});

		return true;
	}

	reload() {
		if (g_CHEATMODE) this.reloadTimePerBullet = 0.1;

		if (this.reloading) {
			return;
		}

		this.reloadTimer = new Timer(this.reloadTimePerBullet);
		this.reloading = true;
	}
}
