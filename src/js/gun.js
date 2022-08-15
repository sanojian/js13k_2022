class Gun extends EngineObject {


	constructor(pos, size, tileIndex, tileSize, angle, color) {
		super(pos, size, tileIndex, tileSize, angle, color);
		// your object init code here
		this._distance = 2;
		this._mysize = size.y;
		this._speed = 1;

	}

	update() {
		// your object update code here

		if (this.owner) {
			let angle = Math.atan2(mousePos.y - this.owner.pos.y, mousePos.x - this.owner.pos.x);

			this.pos.x = this.owner.pos.x + this._distance * Math.cos(angle);
			this.pos.y = this.owner.pos.y + this._distance * Math.sin(angle);

			this.angle = -angle;
			this.size.y = Math.abs(this.angle) > Math.PI / 2 ? -this._mysize : this._mysize;
		
			if (mouseWasPressed(0)) {

				let bullet = new Bullet(this.pos.copy(), this.size.copy(), 4, this.tileSize.copy(), this.angle);
				bullet.velocity.x = Math.cos(angle) * this._speed;
				bullet.velocity.y = Math.sin(angle) * this._speed;
			}
			
			
		}

		super.update(); // update object physics and position
 
	}

	render() {
		super.render(); // draw object as a sprite
		// your object render code here
	}

	setOwner(player) {
		this.owner = player;
	}

}