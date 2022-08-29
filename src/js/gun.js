/** @format */

class Gun extends EngineObject {
	constructor(pos, tileIndex) {
		super(pos, vec2(1), tileIndex, TILE_SIZE);
		// your object init code here
		this._distance = 0.7;
		this._mysize = this.size.y;
		this._speed = 0.4;

		this._maxAmmo = 6;
		this._ammoIconTile = g_game.tileNumbers.bulletIcon;
		this._hitbox = vec2(0.4);

		this.ammo = this._maxAmmo;
		this.reloading = false;
		this.reloadTimer = undefined;
		this.reloadTimePerBullet = 0.25;

		this._soundFire = undefined;
		this.noExtraAmmo = false;

		this.soundReload = new Sound([, 0.3, 0, 0.01, , 0.01, 4, 0, 20, 6.6, 600, 0.07, 0.32, 3.6, 12, , , , , 0.12]);
		this.soundEmpty = new Sound([1, 0, 65, 0, 0, 0.02, 4, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0]);
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

			if (mouseWasPressed(0) && g_game.state == STATE_PLAYING) {
				musicResume();
				this.fire();
			}

			if (this.reloading) {
				if (this.reloadTimer.elapsed()) {
					this.noExtraAmmo = false;

					switch (this.tileIndex) {
						case g_game.tileNumbers.pistol:
							this.noExtraAmmo = g_game.player.ammoBullets <= 0;
							g_game.player.ammoBullets = Math.max(0, g_game.player.ammoBullets - 1);
							break;
						case g_game.tileNumbers.rifle:
							this.noExtraAmmo = g_game.player.ammoRifle <= 0;
							g_game.player.ammoRifle = Math.max(0, g_game.player.ammoRifle - 1);
							break;
						case g_game.tileNumbers.shotgun:
							this.noExtraAmmo = g_game.player.ammoShells <= 0;
							g_game.player.ammoShells = Math.max(0, g_game.player.ammoShells - 1);
							break;
					}

					if (!this.noExtraAmmo) {
						this.soundReload.play();
						this.ammo = Math.min(this._maxAmmo, this.ammo + 1);
						this.reloadTimer.set(this.reloadTimePerBullet);
					}
					if (this.ammo == this._maxAmmo || this.noExtraAmmo) {
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

			let playerTouch = isOverlapping(this.pos, this._hitbox, g_game.player.pos, g_game.player._hitbox);

			if (g_game.player.hp > 0 && playerTouch && !this.playerTouchLastFrame) {
				this.setOwner(g_game.player);
			}

			this.playerTouchLastFrame = playerTouch;
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
			player.gun.size.y = this._mysize;
			player.gun.angle = 0;
			player.gun.owner = null;
			player.gun.pos = this.pos.copy();
		}
		this.owner = player;
		player.gun = this;
		g_soundPickup.play(this.pos);
	}

	fire(color) {
		if (this.noExtraAmmo && this.ammo <= 0) {
			this.soundEmpty.play(this.pos);
			return false;
		}

		if (this.reloading) {
			// this.soundEmpty.play(this.pos, .5, 1);
			return false;
		}
		//fx.shakeScreen(0.1);
		fx.addSpark(this.pos.add(this.pos.subtract(this.owner.pos).normalize(1 - this._distance)));

		if (!g_CHEATMODE) this.ammo--;

		const shotVol = 3;

		// playing the sound multiple times to make it "bigger" and louder
		this._soundFire.play(this.pos, shotVol, 0.5);
		this._soundFire.play(this.pos, shotVol, 1);
		this._soundFire.play(this.pos, shotVol, 1.02);

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

		if (this.reloading || this.ammo == this._maxAmmo) {
			return;
		}

		this.reloadTimer = new Timer(this.reloadTimePerBullet);
		this.reloading = true;
	}
}
