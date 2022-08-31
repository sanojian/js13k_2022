/** @format */

class Vampire extends Enemy {
	constructor(pos) {
		super(pos, vec2(0.8), g_game.tileNumbers.bat);

		this.mass = 2;

		// before transform! ... BAT STATS

		this._maxSpeed = mobDefs.Vampire.maxSpeed + mobDefs.Ghost.maxSpeed * 1.1 * g_game.difficulty;
		this.hp = mobDefs.Vampire.hp + Math.floor(g_game.difficulty * mobDefs.Vampire.hpGainPerlevel);

		this.enemyToTarget = undefined;
		this.enemyMoveSpeed = rand(0.3, 0.5);
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
					this.miniFace = g_game.miniTileNumbers.miniFaceVampire;
					this._walkCycleFrames = 15;
					makeParticles(this.pos, rand(1), new Color(155 / 255, 173 / 255, 183 / 255));
					this.tileIndex = g_game.tileNumbers.vampire;
					this.hp += mobDefs.Vampire.addTransformHp + g_game.difficulty;
					this.mass = 2;
					this.enemyMoveSpeed = rand(0.3, 0.4);
					this.enemyThinkMin = 20;
					this.enemyThinkMax = 50;
					this.enemyJitterForce = 0;
					this.transformed = true;
				}
			} else {
				if (isOverlapping(this.pos, this._hitbox, g_game.player.pos, g_game.player._hitbox)) {
					// scary foreboding hint at what is coming
					g_game.transforms.push({ pos: this.pos.copy(), life: 60, tileIndex: g_game.tileNumbers.faceVampire });
					this.transformTimer = new Timer(2);
					this.transforming = true;
				}
			}
		}

		super.update(); // update object physics and position
	}

	render() {
		super.render();
	}

	postRender() {
		super.postRender();
	}

	hit(velocity, pos) {
		//this.enemyMoveSpeed = rand(0.05, 0.2) * (this.transformed ? this._vampPower : 1);
		this.enemyThinkPause += rand(10, 30);
		this.enemyToTarget = undefined;
		this.groan(1, this.transformed ? 1 : 0.3);
		return super.hit(velocity, pos);
	}
}
