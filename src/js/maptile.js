/** @format */
class MapTile extends EngineObject {
	constructor(pos, size, tileIndex, tileSize, angle, color) {
		super(pos, size, tileIndex, tileSize, angle, color);
		// your object init code here

		this.setCollision(1, 1);
	}

	update() {
		this.velocity.x = 0;
		this.velocity.y = 0;

		super.update(); // update object physics and position
	}

	render() {
		super.render(); // draw object as a sprite
		// your object render code here
	}
}
