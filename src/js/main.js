
function init() {
	console.log('LOADIN!');
	// startup LittleJS with your game functions after the tile image is loaded
	engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, 'assets/gfx/tiles.png');

}

const tileSize = vec2(12, 12);


function gameInit() {
    // called once after the engine starts up
    // setup the game

    cameraScale = 12 * 4;
    g_game.mapMan = new MapManager();
 
    g_game.player = new Player(vec2(0, 0), vec2(1), 0, tileSize);
 
	let gun = new Gun(vec2(0, 0), vec2(1), 3, tileSize);
    gun.setOwner(g_game.player);
    
    // let enemy = new Enemy(vec2(6, 6), vec2(1), 6, tileSize);
    // g_game.enemies.push(enemy);

    // enemy = new Enemy(vec2(-6, 6), vec2(1), 6, tileSize);
    // g_game.enemies.push(enemy);


}


function spawnEnemy() { 

	let p, distToPlayer;

	do { 
		p = vec2(rand(-10, 10), rand(-10, 10));
		distToPlayer = g_game.player.pos.distance(p);
	} while (distToPlayer < 2)

	let enemy = new Enemy(p, vec2(1), 6, tileSize);
    g_game.enemies.push(enemy);
}

function gameUpdate()
{
    // called every frame at 60 frames per second
    // handle input and update the game state

	console.log(g_game.enemies.length);

	if (g_game.enemies.length < 5) { 
		spawnEnemy();
	}


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
    drawRect(vec2(pos.x, pos.y), vec2(10, 2), new Color(132 / 255, 126 / 255, 135 / 255));

    // portrait
    let scaleX = frame % 240 > 200 ? -2 : 2;
    drawTile(vec2(pos.x - 3, pos.y), vec2(scaleX, 2), 12, vec2(12));

    // ammo
    const colorHere = new Color(1, 1, 1);
    const colorGone = new Color(0.3, 0.3, 0.3);
    for (let i = 0; i < 6; i++) {
        drawTile(vec2(pos.x - 1 + i, pos.y), vec2(1), 5, vec2(12), i + 1 > g_game.player.gun.ammo ? colorGone : colorHere);
    }
}

