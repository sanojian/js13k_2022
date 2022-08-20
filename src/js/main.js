/** @format */

function init() {
	console.log("LOADIN!");

	// startup LittleJS with your game functions after the tile image is loaded
	engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, "tiles.png");
}

function gameInit() {
	cameraScale = TILE_SIZE.x * 4;
	//touchGamepadEnable = 1;
	//touchGamepadSize = 160;
	//touchGamepadAnalog = 0;
}

function startGame() {
	engineObjectsDestroy(); // destroy all objects handled by the engine

	g_game.mapMan = new MapManager();

	g_game.mapMan.render();

	g_game.enemies = [];
	g_game.splatter = [];
	g_game.corpses = [];

	enemiesSpawned = 0;

	g_game.player = new MobPlayer(vec2(15, 10));

	new Gun(findFreePos(), vec2(1), g_game.tileNumbers.pistol);
	if (g_CHEATMODE) new Gun(g_game.player.pos, vec2(1), g_game.tileNumbers.pistol);

	new ShotGun(findFreePos(), vec2(1));
	//	new ShotGun(g_game.player.pos.add(vec2(2)), vec2(1));

	g_game.state = STATE_PLAYING;

	musicStart();
}

function findFreePos(minDistToPlayer) {
	let pos, dist2player, inTileCol;

	do {
		pos = vec2(rand(mapWidth), rand(mapHeight));
		dist2player = pos.distance(g_game.player.pos);
		inTileCol = tileCollisionTest(pos);
	} while (dist2player < minDistToPlayer || inTileCol);

	return pos;
}

const ENEMIES_TO_SPAWN = 20;
const ENMIES_MAX_ALIVE = 10;

var enemiesSpawned = 0;

function spawnEnemy() {
	var p = findFreePos(5);
	let enemy = new Zombie(p);
	g_game.enemies.push(enemy);
	enemiesSpawned++;
}

function gameUpdate() {
	switch (g_game.state) {
		case STATE_CLICK_TO_START:
			updateStateClickToStart();
			break;
		case STATE_PLAYING:
			updateStatePlaying();
			break;
		case STATE_DEAD:
			updateStateDead();
			break;
		case STATE_WON:
			updateStateWon();
			break;

		default:
			break;
	}
}

var black = new Color(0, 0, 0);

function updateStateClickToStart() {
	for (let i = 0; i < 10; i++) {
		drawTextScreen(
			"DEAD AGAIN",
			vec2((rand(0.99, 1.01) * mainCanvas.width) / 2, (rand(0.99, 1.01) * mainCanvas.height) / 3),
			mainCanvas.width / 10,
			black.lerp(g_game.colorBlood, i / 10)
		);
	}

	let amt = 0.5 + Math.sin(frame / 15) / 2;
	let col = new Color((amt * 172) / 255, (amt * 50) / 255, (amt * 50) / 255);

	drawTextScreen("Click to start", vec2(mainCanvas.width / 2, (3 * mainCanvas.height) / 4), mainCanvas.width / 20, col);

	if (mouseWasReleased(0)) {
		startGame();
	}
}

var deadTimer;
function updateStateDead() {
	drawTextScreen("YOU DIED !", vec2(mainCanvas.width / 2, mainCanvas.height / 2), 100, g_game.colorBlood);
	if (!deadTimer) {
		deadTimer = setTimeout(() => {
			deadTimer = undefined;
			g_game.state = STATE_CLICK_TO_START;
		}, 2000);
	}
}

var wonTimer;
function updateStateWon() {
	drawTextScreen("YOU WON !", vec2(mainCanvas.width / 2, mainCanvas.height / 2), 100, g_game.colorBlood);
	if (!wonTimer) {
		wonTimer = setTimeout(() => {
			wonTimer = undefined;
			g_game.state = STATE_CLICK_TO_START;
		}, 2000);
	}
}

function updateStatePlaying() {
	if (g_game.enemies.length < ENMIES_MAX_ALIVE && enemiesSpawned < ENEMIES_TO_SPAWN) {
		spawnEnemy();
	}

	if (g_game.player.hp <= 0) {
		g_game.state = STATE_DEAD;
		return;
	}

	if (enemiesSpawned == ENEMIES_TO_SPAWN && g_game.enemies.length == 0) {
		g_game.state = STATE_WON;
		return;
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

	for (let i = 0; i < g_game.corpses.length; i++) {
		g_game.corpses[i].renderNow();
	}

	for (let i = 0; i < g_game.splatter.length; i++) {
		for (let j = 0; j < g_game.splatter[i].pattern.length; j++) {
			if (g_game.splatter[i].pattern[j]) {
				let x = g_game.splatter[i].pos.x - (2 + (j % 4)) / 12;
				let y = g_game.splatter[i].pos.y - (2 + Math.floor(j / 4)) / 12;
				drawRect(vec2(x, y), vec2(1 / 12), g_game.splatter[i].color);
			}
		}
	}
}

function gameRenderPost() {
	// called after objects are rendered
	// draw effects or hud that appear above all objects

	if (!g_game.player) return;

	let pos = vec2(cameraPos.x, cameraPos.y - overlayCanvas.height / (cameraScale * 2) + 2);

	// UI background
	drawRect(vec2(pos.x, pos.y), vec2(10, 2), new Color(132 / 255, 126 / 255, 135 / 255));

	// portrait
	let scaleX = frame % 240 > 200 ? -2 : 2;
	drawTile(vec2(pos.x - 3, pos.y), vec2(scaleX, 2), g_game.tileNumbers.facePlayer, vec2(12));

	// ammo
	if (g_game.player.gun) {
		const colorHere = new Color(1, 1, 1);
		const colorGone = new Color(0.3, 0.3, 0.3);
		for (let i = 0; i < g_game.player.gun._maxAmmo; i++) {
			drawTile(
				vec2(pos.x - 1 + i, pos.y),
				vec2(1),
				g_game.player.gun._ammoIconTile,
				vec2(12),
				i + 1 > g_game.player.gun.ammo ? colorGone : colorHere
			);
		}
	}

	for (let i = 0; i < g_game.enemies.length; i++) {
		g_game.enemies[i].drawBlood();
	}
}
