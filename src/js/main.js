/** @format */

function init() {
	// startup LittleJS with your game functions after the tile image is loaded
	engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, "tiles.png");
}

function gameInit() {
	scaleCameraToScreenSize();
	document.body.style.cursor = "crosshair";

	//touchGamepadEnable = 1;
	//touchGamepadSize = 160;
	//touchGamepadAnalog = 0;
	startNewGame();
}

function scaleCameraToScreenSize() {
	let smallest = Math.min(overlayCanvas.height, overlayCanvas.width);

	cameraScale = (TILE_SIZE.x * smallest) / 30;
}

function startNewGame() {
	g_score = 0;
	g_level = 0;
}

function startNextLevel() {
	engineObjectsDestroy(); // destroy all objects handled by the engine

	g_game.moss = [];

	g_game.mapMan = new MapManager();

	g_game.mapMan.render();

	g_game.enemies = [];
	g_game.splatter = [];
	g_game.holes = [];
	g_game.sparks = [];
	g_game.corpses = [];
	g_game.shells = [];

	enemiesSpawned = 0;

	g_game.player = new MobPlayer(vec2(15, 10));

	new Pistol(findFreePos(), vec2(1));
	new ShotGun(findFreePos(), vec2(1));
	new Rifle(findFreePos(), vec2(1));

	new AmmoBox(findFreePos(), vec2(1), g_game.tileNumbers.boxBullets);
	new AmmoBox(findFreePos(), vec2(1), g_game.tileNumbers.boxShells);

	if (g_CHEATMODE) new Pistol(g_game.player.pos, vec2(1));

	g_game.state = STATE_PLAYING;

	musicStart();
}

function findFreePos(minDistToPlayer) {
	let pos, dist2player, inTileCol;

	do {
		pos = vec2(rand(mapData[g_level % mapData.length].w), rand(mapData[g_level % mapData.length].h));
		dist2player = pos.distance(g_game.player.pos);
		inTileCol = tileCollisionTest(pos, vec2(1));
	} while (dist2player < minDistToPlayer || inTileCol);

	return pos;
}

var enemiesSpawned = 0;
function spawnEnemy() {
	var p = findFreePos(5);
	let enemyClass = getNextEnemySpawnClass();
	//let enemy = g_level == 1 ? new Vampire(p) : new Zombie(p);
	let enemy;
	switch (enemyClass) {
		case "Vampire":
			enemy = new Vampire(p);
			break;
		default:
			enemy = new Zombie(p);
	}
	g_game.enemies.push(enemy);
	enemiesSpawned++;
}

function gameUpdate() {
	if (keyIsDown(18) && keyWasReleased(67)) {
		g_CHEATMODE = 1 - g_CHEATMODE;
	}

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
		case STATE_CLEARED:
			updateStateCleared();
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

	if (g_score) {
		drawTextScreen(
			"Score: " + g_score,
			vec2(mainCanvas.width / 2, mainCanvas.height / 2 - cameraScale),
			mainCanvas.width / 20,
			g_game.colorBlood
		);
		drawTextScreen(
			"  Top: " + localStorage.daScore,
			vec2(mainCanvas.width / 2, mainCanvas.height / 2 + cameraScale),
			mainCanvas.width / 20,
			g_game.colorBlood
		);
	}

	let amt = 0.5 + Math.sin(frame / 15) / 2;
	let col = new Color((amt * 172) / 255, (amt * 50) / 255, (amt * 50) / 255);

	drawTextScreen("Click to start", vec2(mainCanvas.width / 2, (3 * mainCanvas.height) / 4), mainCanvas.width / 20, col);

	if (mouseWasReleased(0)) {
		startNewGame();
		startNextLevel();
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

var clearedEnterTime;
function updateStateCleared() {
	drawTextScreen("Level cleared !", vec2(mainCanvas.width / 2, mainCanvas.height / 2), 100, g_game.colorBlood);

	if (!clearedEnterTime) {
		clearedEnterTime = new Date().getTime();
	}

	if (new Date().getTime() - clearedEnterTime > 2000) {
		drawTextScreen(
			"Click to continue",
			vec2(mainCanvas.width / 2, (3 * mainCanvas.height) / 4),
			mainCanvas.width / 20,
			g_game.colorBlood
		);

		if (mouseWasPressed(0)) {
			clearedEnterTime = undefined;
			startNextLevel();
			g_game.state = STATE_PLAYING;
		}
	}
}

var ticsToSpawn = 0;

function updateStatePlaying() {
	ticsToSpawn--;
	if (g_game.enemies.length < ENMIES_MAX_ALIVE && enemiesSpawned < ENEMIES_TO_SPAWN && ticsToSpawn <= 0) {
		spawnEnemy();
		ticsToSpawn = rand(0, 120);
	}

	if (g_game.player.hp <= 0) {
		g_game.state = STATE_DEAD;
		localStorage.daScore = localStorage.daScore ? Math.max(g_score, localStorage.daScore) : g_score;
		return;
	}

	if (enemiesSpawned == ENEMIES_TO_SPAWN && g_game.enemies.length == 0) {
		g_game.state = STATE_CLEARED;
		g_level++;
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

	if (g_CHEATMODE && mouseWasPressed(1)) {
		g_level++;
		startNextLevel();
		g_game.state = STATE_PLAYING;
	}
}

function gameUpdatePost() {
	// called after physics and objects are updated
	// setup camera and prepare for render
}

function drawStats() {
	let l = 1;
	// drawTextScreen(
	// 	"enemies in list " + g_game.enemies.length,
	// 	vec2(100, 25 * l++),
	// 	20,
	// 	new Color(1, 1, 1),
	// 	0,
	// 	undefined,
	// 	"left"
	// );

	// let e = 0;
	// for (const o of engineObjects) {
	// 	if (o instanceof Enemy) e++;
	// }

	// drawTextScreen("enemies in engine " + e, vec2(100, 25 * l++), 20, new Color(1, 1, 1), 0, undefined, "left");

	// if (e != g_game.enemies.length) {
	// 	debugger;
	// }

	// drawTextScreen(
	// 	"enemies spawned " + enemiesSpawned,
	// 	vec2(100, 25 * l++),
	// 	20,
	// 	new Color(1, 1, 1),
	// 	0,
	// 	undefined,
	// 	"left"
	// );

	if (g_CHEATMODE) drawTextScreen("CHEAT MODE ON ", vec2(100, 25 * l++), 20, new Color(1, 1, 1), 0, undefined, "left");
}

function gameRender() {
	// called before objects are rendered
	// draw any background effects that appear behind objects

	for (let i = 0; i < g_game.corpses.length; i++) {
		g_game.corpses[i].renderNow();
	}

	if (g_game.shells.length > 32) {
		// clean up old casings
		g_game.shells.splice(0, 1);
	}
	for (let i = 0; i < g_game.shells.length; i++) {
		let shell = g_game.shells[i];
		drawRect(shell.pos, vec2(1 / 12, 2 / 12), shell.color, shell.angle);
		if (shell.life > 0) {
			shell.pos.x += shell.velocity.x;
			shell.pos.y += shell.velocity.y;
			shell.velocity.y -= 1 / 144;
			shell.angle += shell.angularVelocity;
			shell.life--;
		}
	}

	if (g_game.splatter.length > 1024) {
		// clean up old splatter
		g_game.splatter.splice(0, 1);
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

	// moss
	for (let i = 0; i < g_game.moss.length; i++) {
		let moss = g_game.moss[i];
		drawTile(moss.pos, vec2(1 / 3), moss.tileIndex, vec2(4), g_game.colorWhite, moss.angle);
	}

	// bullet holes
	for (let i = 0; i < g_game.holes.length; i++) {
		let hole = g_game.holes[i];
		drawRect(hole.pos, vec2(1 / 12), hole.color);
	}

	// sparks
	for (let i = 0; i < g_game.sparks.length; i++) {
		let spark = g_game.sparks[i];
		spark.pos.x += Math.cos(spark.angle) / 32;
		spark.pos.y += Math.sin(spark.angle) / 32;
		drawRect(spark.pos, vec2(1 / 24), g_game.colorSpark);
		if (--spark.life <= 0) {
			g_game.sparks.splice(i, 1);
		}
	}

	drawStats && drawStats();
}
