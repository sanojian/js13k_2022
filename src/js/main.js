
function init() {
	console.log('LOADIN!');
	// startup LittleJS with your game functions after the tile image is loaded
	engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, 'assets/gfx/tiles.png');

}

function gameInit() {
    // called once after the engine starts up
    // setup the game

    cameraScale = 12 * 4;

    let myMap = [
        [10, 9,  9,  9, 9, 10],
        [10,  ,   ,   ,  , 10],
        [10,  ,   ,   ,  , 10],
        [10,  ,   ,   ,  , 10],
        [9,  9,   ,   , 9,  9],
        [  ,   ,   ,   ,  ,  ],
        [  ,   ,   ,   ,  ,  ],
        [ 9,   ,   ,   ,  ,  ],
        [  ,  9,   ,   ,  ,  ],
        [  ,   ,  9, 10,  ,  ],
        [  ,   ,   , 10,  ,  ],
        [  ,   ,   ,  9,  9, ],
    ];

    let w = myMap[0].length;
    let h = myMap.length;


    const size = 1;
	const tileSize = vec2(12, 12);

    g_game.tileLayer = new TileLayer(vec2(0, 0), vec2(w, h), tileSize, vec2(size, size));

    initTileCollision(vec2(w, h));
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let t = myMap[y][x];
            if (t) {
                setTileCollisionData(vec2(x, h - 1 - y), t);
                g_game.tileLayer.setData(vec2(x, h - 1 - y), new TileLayerData(t));
            }
        }
    }
    g_game.tileLayer.redraw();

    g_game.player = new Player(vec2(0, 0), vec2(size, size), 0, tileSize);
 
	let gun = new Gun(vec2(0, 0), vec2(size, size), 3, tileSize);
    gun.setOwner(g_game.player);
    
    let enemy = new Enemy(vec2(6, 6), vec2(size, size), 6, tileSize);
    g_game.enemies.push(enemy);

    enemy = new Enemy(vec2(-6, 6), vec2(size, size), 6, tileSize);
    g_game.enemies.push(enemy);


}

function gameUpdate()
{
    // called every frame at 60 frames per second
    // handle input and update the game state

}

function gameUpdatePost()
{
    // called after physics and objects are updated
    // setup camera and prepare for render
}

function gameRender()
{
    // called before objects are rendered
    // draw any background effects that appear behind objects
}

function gameRenderPost()
{
    // called after objects are rendered
    // draw effects or hud that appear above all objects

    let pos = vec2(cameraPos.x, cameraPos.y - overlayCanvas.height/(cameraScale*2) + 2);

    
    // background
    drawRect(pos, vec2(16, 2), new Color(132 / 255, 126 / 255, 135 / 255));

    // portrait
    let scaleX = frame % 240 > 200 ? -2 : 2;
    drawTile(pos, vec2(scaleX, 2), 12, vec2(12));

    // ammo
    const colorHere = new Color(1, 1, 1);
    const colorGone = new Color(0.3, 0.3, 0.3);
    for (let i = 0; i < 6; i++) {
        drawTile(vec2(pos.x + 2 + i, pos.y), vec2(1), 5, vec2(12), i + 1 > g_game.player.gun.ammo ? colorGone : colorHere);
    }
}

