/** @format */

class Gun extends EngineObject {
	constructor(pos, tileIndex) {
		super(pos, vec2(1), tileIndex, TILE_SIZE);
		// your object init code here
		this._distance = 0.7;
		this._mysize = this.size.y;
		this._speed = 0.4;

		this._maxAmmo = 6;
		this._ammoIconTile = tileNumbers_bulletIcon;
		this._hitbox = vec2(0.4);

		this.ammo = this._maxAmmo;
		this.reloading = false;
		this.reloadTimer = undefined;
		this.reloadTimePerBullet = 0.25;

		this._soundFire = undefined;
		this.noExtraAmmo = false;

		this.soundReload = soundGunReload;
		this.soundEmpty = soundGunEmpty;
	}

	update() {
		// your object update code here

		if (this.owner && this.owner.hp > 0) {
			// key r or space
			if (isTouchDevice && gamepadWasPressed(2)) {
				this.reload();
				return;
			} else if (keyWasReleased(82) || keyWasReleased(32)) {
				this.reload();
				return;
			}

			let angle = -this.angle;

			if (isUsingGamepad) {
				angle = Math.atan2(gamepadStick(0).y, gamepadStick(0).x);
			} else if (!isTouchDevice) {
				// use mouse position
				angle = Math.atan2(mousePos.y - this.owner.pos.y, mousePos.x - this.owner.pos.x);
			}

			this.pos.x = this.owner.pos.x + this._distance * Math.cos(angle);
			this.pos.y = this.owner.pos.y + this._distance * Math.sin(angle);

			this.angle = -angle;
			this.size.y = abs(this.angle) > PI / 2 ? -this._mysize : this._mysize;

			if (isTouchDevice) {
				if (gamepadWasPressed(1)) {
					musicResume();
					this.fire();
				}
			} else if (mouseWasPressed(0) && g_state == STATE_PLAYING) {
				musicResume();
				this.fire();
			}

			if (this.reloading) {
				if (this.reloadTimer.elapsed()) {
					this.noExtraAmmo = false;

					if (this.tileIndex == tileNumbers_rifle) {
						this.noExtraAmmo = g_player.ammoRifle <= 0;
						g_player.ammoRifle = max(0, g_player.ammoRifle - 1);
					} else if (this.tileIndex == tileNumbers_shotgun) {
						this.noExtraAmmo = g_player.ammoShells <= 0;
						g_player.ammoShells = max(0, g_player.ammoShells - 1);
					} else {
						// pistol
						this.noExtraAmmo = g_player.ammoBullets <= 0;
						g_player.ammoBullets = max(0, g_player.ammoBullets - 1);
					}

					if (!this.noExtraAmmo) {
						this.soundReload.play();
						this.ammo = min(this._maxAmmo, this.ammo + 1);
						this.reloadTimer.set(this.reloadTimePerBullet);
					}
					if (this.ammo == this._maxAmmo || this.noExtraAmmo) {
						this.reloadTimer.unset();
						this.reloading = false;
					}
				}
			}

			if (this.ammo <= 0 && !this.reloading) {
				//this.soundEmpty.play();
				this.reload();
			}
		} else if (!this.owner) {
			// look for owner

			let playerTouch = isOverlapping(this.pos, this._hitbox, g_player.pos, g_player._hitbox);

			if (g_player.hp > 0 && playerTouch && !this.playerTouchLastFrame) {
				this.setOwner(g_player);
			}

			this.playerTouchLastFrame = playerTouch;
		}

		super.update(); // update object physics and position
	}

	setOwner(player) {
		if (player.gun) {
			// throw current gun
			player.gun.size.y = this._mysize;
			player.gun.angle = 0;
			player.gun.owner = null;
			player.gun.pos = this.pos.copy();
			soundPickup.play(this.pos);
		}
		this.owner = player;
		player.gun = this;
	}

	fire(color) {
		if (this.reloading || this.ammo <= 0) {
			this.soundEmpty.play(this.pos);
			return false;
		}

		uiflashScreen("#fff", 1);

		//fx.shakeScreen(0.1);
		fx.addSpark(this.pos.add(this.pos.subtract(this.owner.pos).normalize(1 - this._distance)));

		if (!g_CHEATMODE) this.ammo--;

		const shotVol = 3;

		// playing the sound multiple times to make it "bigger" and louder
		this._soundFire.play(this.pos, shotVol, 0.5);
		this._soundFire.play(this.pos, shotVol, 1);
		this._soundFire.play(this.pos, shotVol, 1.02);

		// eject shell
		g_shells.push({
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
