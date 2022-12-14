/** @format */

class Vampire extends Enemy {
	constructor(pos) {
		super(pos, MOB_SIZE, tileNumbers_bat, mobDefs.Vampire);

		this.mass = 2;

		// before transform! ... BAT STATS

		this.enemyToTarget = undefined;
		this.enemyAccel = rand(0.3, 0.5);
		this.enemyJitterForce = 0.5;
		this._walkCycleFrames = 20;

		this.transformTimer = undefined;
		this.transforming = false;
		this.transformed = false;

		//this.pos.y -= 0.5; //

		this.soundGroan = soundVampireGroan;
	}

	update() {
		if (!this.transformed) {
			// flap wings
			this.angle = this.walkCyclePlace > this._walkCycleFrames / 2 ? 0 : PI;

			if (this.transforming) {
				if (this.transformTimer.elapsed()) {
					// transform! ... VAMPIRE STATS
					this.angle = 0;
					this.miniFace = miniTileNumbers_miniFaceVampire;
					this._walkCycleFrames = 15;
					makeParticles(this.pos, rand(), colorRifleRound);
					this.tileIndex = tileNumbers_vampire;
					this.hp += mobDefs.Vampire.addTransformHp + g_difficulty;
					this.mass = 2;
					this.enemyAccel = rand(0.4, 0.5);
					this.enemyThinkMin = 20;
					this.enemyThinkMax = 50;
					this.enemyJitterForce = 0;
					this.transformed = true;
					this.soundGroan = soundEnemyGroan;
					this.damping = 0.95; // on ground
				}
			} else {
				if (isOverlapping(this.pos, this._hitbox, g_player.pos, g_player._hitbox)) {
					// scary foreboding hint at what is coming
					g_transforms.push({ pos: this.pos.copy(), life: 60, tileIndex: tileNumbers_faceVampire });
					this.transformTimer = new Timer(2);
					this.transforming = true;
					this.enemyAccel = -this.enemyAccel; // run from player while transforming !
				}
			}
		}

		super.update(); // update object physics and position
	}

	render() {
		super.render();
	}

	hit(velocity, pos, dam) {
		this.enemyToTarget = undefined;
		this.groan(1, this.transformed ? 1 : 0.3);
		return super.hit(velocity, pos, dam);
	}
}
