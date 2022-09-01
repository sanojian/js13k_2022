/** @format */

function init() {
	// generate new maps
	generateMapFromLevel(0);
	generateMapFromLevel(1);

	// startup LittleJS with your game functions after the tile image is loaded
	engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, "t.png");
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
	// try to fit same tiles on a screen
	cameraScale = Math.min(window.innerWidth, window.innerHeight) / TILES_PER_SCREEN;
}

function startNewGame() {
	g_score = 0;
	g_level = 0;
	delete g_game.player;
}

function startNextLevel() {
	// save gun and ammo
	let ammoPistol = 0;
	let ammoShotgun = 0;
	let ammoRifle = 0;
	let currentGun = g_game.tileNumbers.pistol; // default
	let gunAmmo = 0;
	if (g_game.player) {
		ammoPistol = g_game.player.ammoBullets;
		ammoShotgun = g_game.player.ammoShells;
		ammoRifle = g_game.player.ammoRifle;
		currentGun = g_game.player.gun?.tileIndex;
		gunAmmo = g_game.player.gun?.ammo;
	} else {
		// starting ammo
		ammoPistol = 12;
	}

	engineObjectsDestroy(); // destroy all objects handled by the engine

	g_levelDef = levelDefs[g_level % levelDefs.length];

	g_game.moss = [];
	g_game.shadows = {};

	g_game.player = new MobPlayer(vec2(1));

	g_game.enemies = [];

	clearPushers();

	g_game.mapMan = new MapManager();

	g_game.mapMan.render();

	g_game.splatter = [];
	g_game.holes = [];
	g_game.sparks = [];
	g_game.corpses = [];
	g_game.shells = [];

	enemiesSpawned = 0;

	g_game.player.pos = g_game.playerSpawn;
	cameraPos = g_game.playerSpawn.copy();

	// give player saved equipment
	g_game.player.ammoBullets = ammoPistol;
	g_game.player.ammoShells = ammoShotgun;
	g_game.player.ammoRifle = ammoRifle;
	let theGun;
	switch (currentGun) {
		case g_game.tileNumbers.pistol:
			theGun = new Pistol(g_game.player.pos);
			break;
		case g_game.tileNumbers.shotgun:
			theGun = new Shotgun(g_game.player.pos);
			break;
		case g_game.tileNumbers.rifle:
			theGun = new Rifle(g_game.player.pos);
			break;
	}
	if (theGun) {
		theGun.ammo = gunAmmo;
	}

	musicStart();
}

function findFreePos(minDistToPlayer) {
	let pos, dist2player, inTileCol;

	do {
		pos = vec2(rand(mapData[g_levelDef.map].w), rand(mapData[g_levelDef.map].h));
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
		case "v":
			enemy = new Vampire(p);
			break;
		case "g":
			enemy = new Ghost(p);
			break;
		default:
			enemy = new Zombie(p);
	}
	g_game.enemies.push(enemy);
	enemiesSpawned++;
}

function handleDebugKeys() {
	if (keyIsDown(18)) {
		if (keyWasReleased(67)) g_CHEATMODE = 1 - g_CHEATMODE; // c

		if (keyWasReleased(80)) pushersDoDraw = !pushersDoDraw; // p
	}
}

function gameUpdate() {
	debug && handleDebugKeys();

	//if (uiIsFading()) return;
	uiFading();

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

function uiSound(f = 5) {
	// soundPlayExtra(soundRifle, vec2(10, 0), 1, 1, 0.5, 100, 1);
	// soundPlayExtra(soundEnemyGroan, vec2(-10, 0), 1, 1, 1, 200, 5);

	for (let i = 0; i < f; i++) {
		soundRifle.play(cameraPos.add(vec2(10, 0)), 1, 0.5 + i / 10);
		setTimeout(() => soundEnemyGroan.play(cameraPos.add(vec2(-10, 0)), 0.5, 1 + i / 5, 0.1), 300 + i * 100);
	}
}

function updateStateClickToStart() {
	drawTile(
		cameraPos,
		vec2(4),
		g_game.tileNumbers.faceZombie,
		TILE_SIZE,
		new Color(1, 1, 1, Math.max(0, 0.2 * Math.sin((frame * PI) / 1000)))
	);

	textTitle = "DEAD AGAIN";

	if (g_score) {
		textMiddle = "Score: " + g_score + "  Top: " + localStorage.daScore;
	}

	textBottom = "Click to start";

	if (mouseWasReleased(0)) {
		uiSound();
		uiFadeOutAndCall(() => {
			startNewGame();
			startNextLevel();
			changeState(STATE_PLAYING);
		});
	}
}

function updateStateDead() {
	textMiddle = "YOU DIED";

	if (getMsSinceStateChange() > 4000) {
		changeState(STATE_CLICK_TO_START);
	}
}

function updateStateCleared() {
	textMiddle = "Level " + g_level + " cleared";

	if (getMsSinceStateChange() > 2000) {
		textBottom = "Click to continue";

		if (mouseWasPressed(0)) {
			uiSound(3);
			uiFadeOutAndCall(() => {
				startNextLevel();
				changeState(STATE_PLAYING);
			});
		}
	}
}

var stateChangedTime = new Date().getTime();
function changeState(newState) {
	textsClear();
	stateChangedTime = new Date().getTime();
	g_game.state = newState;
}

function getMsSinceStateChange() {
	return new Date().getTime() - stateChangedTime;
}

var ticsToSpawn = 0;

function updateStatePlaying() {
	updatePushers();

	textMiddle = getMsSinceStateChange() > 2000 ? "" : "Level " + (g_level + 1);

	ticsToSpawn--;

	if (enemiesSpawned == g_levelDef.enemiesToSpawn + g_game.difficulty && g_game.enemies.length == 0) {
		changeState(STATE_CLEARED);
		g_game.player.gun.reload();
		g_level++;
		return;
	}

	// game gets more difficult as you play
	g_game.difficulty = Math.floor(g_level / levelDefs.length);

	if (
		g_game.enemies.length < g_levelDef.enemiesMaxAlive + g_game.difficulty &&
		enemiesSpawned < g_levelDef.enemiesToSpawn + g_game.difficulty &&
		ticsToSpawn <= 0
	) {
		spawnEnemy();
		ticsToSpawn = rand(0, 120);
	}

	if (g_game.player.hp <= 0) {
		changeState(STATE_DEAD);
		localStorage.daScore = localStorage.daScore ? Math.max(g_score, localStorage.daScore) : g_score;
		return;
	}

	if (g_game.player.gun) {
		if (!g_game.ammoSpawned && g_game.player.getAmmoForGunType(g_game.player.gun.tileIndex) == 0) {
			// spawn more ammo
			new AmmoBox(findFreePos(), g_game.player.gun.tileIndex);
			g_game.ammoSpawned = true;
		} else if (g_game.player.getAmmoForGunType(g_game.player.gun.tileIndex) != 0) {
			// allow ammo to spawn again when player is empty
			g_game.ammoSpawned = false;
		}
	}

	// camera goes halfway between player and mouse
	cameraPos = cameraPos.lerp(g_game.player.pos.add(mousePos.subtract(g_game.player.pos).scale(0.5)), 0.03);

	fx.updateScreenShake();

	cameraPos = cameraPos.add(g_screenShake);

	if (g_CHEATMODE && mouseWasPressed(1)) {
		changeState(STATE_CLEARED);
		g_level++;
	}
}

function gameUpdatePost() {
	// called after physics and objects are updated
	// setup camera and prepare for render
}

var textTitle;
var textMiddle;
var textBottom;

function textsClear() {
	textTitle = undefined;
	textMiddle = undefined;
	textBottom = undefined;
}

function drawTextWithOutline(text, pos, size, textColor, outlineColor = g_game.colorBlack) {
	drawTextScreen(text, pos, size, textColor, size / 15, outlineColor);
}

function textsDraw() {
	if (g_CHEATMODE) {
		drawTextScreen("CHEAT MODE ON ", vec2(100, 25), 20, new Color(1, 1, 1), 0, undefined, "left");
		drawTextScreen("enemies: " + g_game.enemies.length, vec2(100, 50), 20, new Color(1, 1, 1), 0, undefined, "left");
	}

	if (textTitle) {
		let flicker = (1.5 + Math.sin(frame / 50)) * 0.01;

		for (let i = 0; i < 10; i++) {
			drawTextScreen(
				textTitle,
				vec2(
					(rand(1 - flicker, 1 + flicker) * mainCanvas.width) / 2,
					(rand(1 - flicker, 1 + flicker) * mainCanvas.height) / 3
				),
				mainCanvas.width / 10,
				g_game.colorBlack.lerp(g_game.colorBlood, i / 10)
			);
		}
	}

	if (textMiddle) {
		drawTextWithOutline(
			textMiddle,
			vec2(mainCanvas.width / 2, mainCanvas.height / 2),
			mainCanvas.width / 20,
			g_game.colorBlood
		);
	}

	if (textBottom) {
		let amt = 0.5 + Math.sin(frame / 10) / 2;
		let col = new Color((amt * 172) / 255, (amt * 50) / 255, (amt * 50) / 255);

		drawTextWithOutline(
			textBottom,
			vec2(mainCanvas.width / 2, (4 * mainCanvas.height) / 5),
			mainCanvas.width / 30,
			col
		);
	}
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
			shell.pos = shell.pos.add(shell.velocity);
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

	//textsDraw();

	drawPushers();
}
