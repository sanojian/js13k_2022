class Player extends EngineObject 
{
    constructor(pos, size, tileIndex, tileSize, angle, color)
    {
        super(pos, size, tileIndex, tileSize, angle, color);
        // your object init code here
    }

    update()
    {
        super.update(); // update object physics and position
        // your object update code here
    }

    render()
    {
        super.render(); // draw object as a sprite
        // your object render code here
    }
}