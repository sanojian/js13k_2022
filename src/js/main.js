/** @format */
function init() {
	console.log("LOADIN!");
	// startup LittleJS with your game functions after the tile image is loaded
	engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, "tiles.png");
}

const tileSize = vec2(12, 12);

function gameInit() {
	// called once after the engine starts up
	// setup the game

	cameraScale = 12 * 4;
	g_game.mapMan = new MapManager();

	g_game.player = new MobPlayer(vec2(0, 0), vec2(1), tileSize);

	let gun = new Gun(vec2(0, 0), vec2(1), g_game.tileNumbers.pistol, tileSize);
	gun.setOwner(g_game.player);

	while (g_game.enemies.length < 5) {
		spawnEnemy(20, 5);
	}

	setTimeout(musicStart, 1000);
}

const ENEMIES_TO_SPAWN = 20;
const ENMIES_MAX_ALIVE = 10;

var enemiesSpawned = 0;

function spawnEnemy(maxAxisDist, minDistToPlayer) {
	let p, len;

	// todo: do not spwan in collision

	do {
		p = vec2(rand(-maxAxisDist, maxAxisDist), rand(-maxAxisDist, maxAxisDist));
		len = p.length();
	} while (len < minDistToPlayer);

	let enemy = new Zombie(p.add(g_game.player.pos), vec2(1), tileSize);
	g_game.enemies.push(enemy);

	enemiesSpawned++;
}

function gameUpdate() {
  // called every frame at 60 frames per second
  // handle input and update the game state

  if (
    g_game.enemies.length < ENMIES_MAX_ALIVE &&
    enemiesSpawned < ENEMIES_TO_SPAWN
  ) {
    spawnEnemy(20, 5);
  }

  if (enemiesSpawned == ENEMIES_TO_SPAWN && g_game.enemies.length == 0) {
	  console.log("YOU WIN");
    //debugger;
  }

    // camera follow player
  if (g_game.player.pos.x > cameraPos.x + g_game.CAMERA_LAG) {
    cameraPos.x = g_game.player.pos.x - g_game.CAMERA_LAG;
  }
  if (g_game.player.pos.x < cameraPos.x - g_game.CAMERA_LAG) {
    cameraPos.x = g_game.player.pos.x + g_game.CAMERA_LAG;
  }
  if (g_game.player.pos.y > cameraPos.y + g_game.CAMERA_LAG) {
    cameraPos.y = g_game.player.pos.y - g_game.CAMERA_LAG;
  }
  if (g_game.player.pos.y < cameraPos.y - g_game.CAMERA_LAG) {
    cameraPos.y = g_game.player.pos.y + g_game.CAMERA_LAG;
  }

}

function gameUpdatePost() {
	// called after physics and objects are updated
	// setup camera and prepare for render
}

function gameRender() {
	// called before objects are rendered
	// draw any background effects that appear behind objects
}

function gameRenderPost() {
	// called after objects are rendered
	// draw effects or hud that appear above all objects

	let pos = vec2(cameraPos.x, cameraPos.y - overlayCanvas.height / (cameraScale * 2) + 2);

	// background
	drawRect(vec2(pos.x, pos.y), vec2(10, 2), new Color(132 / 255, 126 / 255, 135 / 255));

	// portrait
	let scaleX = frame % 240 > 200 ? -2 : 2;
	drawTile(vec2(pos.x - 3, pos.y), vec2(scaleX, 2), g_game.tileNumbers.facePlayer, vec2(12));

	// ammo
	const colorHere = new Color(1, 1, 1);
	const colorGone = new Color(0.3, 0.3, 0.3);
	for (let i = 0; i < g_game.player.gun._maxAmmo; i++) {
		drawTile(vec2(pos.x - 1 + i, pos.y), vec2(1), 5, vec2(12), i + 1 > g_game.player.gun.ammo ? colorGone : colorHere);
	}
}
