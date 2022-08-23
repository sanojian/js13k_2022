// this draws the ui on top of everything (in theory)

function gameRenderPost() {
	// called after objects are rendered
	// draw effects or hud that appear above all objects



	if (!g_game.player) return;

	// draw blood on creatures so it is on top of their sprite
	for (let i = 0; i < g_game.enemies.length; i++) {
		g_game.enemies[i].drawBlood();
	}


	for (const e of g_game.enemies) {
		e.postRender && e.postRender();
	}
	g_game.player.postRender();


	// scary transforms
	for (let i = 0; i < g_game.transforms.length; i++) {
		let trans = g_game.transforms[i];
		drawTile(trans.pos, vec2((60 - trans.life) / 6), trans.tileIndex, TILE_SIZE, new Color(0.8, 0.8, 0.8, 0.15));
		trans.life--;
		if (trans.life <= 0) {
			g_game.transforms.splice(i, 1);
			i--;
		}
	}

	// TODO: make sure UI can fit onto screen
	//let scaleUI = (overlayCanvas.width < 500) ? 0.5 : 1;

	let pos = vec2(cameraPos.x, cameraPos.y - overlayCanvas.height / (cameraScale * 2) + 2);

	// UI background
	drawRect(vec2(pos.x, pos.y), vec2(10, 2), new Color(105 / 255, 106 / 255, 106 / 255));

	// portrait
	let scaleX = frame % 240 > 200 ? -2 : 2;
	drawTile(vec2(pos.x - 4, pos.y), vec2(scaleX, 2), g_game.tileNumbers.facePlayer, vec2(12));

	// total ammo
	drawRect(vec2(pos.x - 2, pos.y + 0.5), vec2(1.5, 0.6), new Color(132 / 255, 126 / 255, 135 / 255));
	drawRect(vec2(pos.x - 2, pos.y - 0.5), vec2(1.5, 0.6), new Color(132 / 255, 126 / 255, 135 / 255));
	drawTile(vec2(pos.x - 2.5, pos.y + 0.5), vec2(0.5), g_game.tileNumbers.bulletIcon, vec2(12));
	drawTile(vec2(pos.x - 2.5, pos.y - 0.5), vec2(0.5), g_game.tileNumbers.shellIcon, vec2(12));

	drawTextScreen(
		g_game.player.ammoBullets,
		vec2(overlayCanvas.width / 2 - 1.55 * cameraScale, overlayCanvas.height - 2.45 * cameraScale),
		24,
		g_game.colorBlack,
		0,
		g_game.colorBlack,
		"right"
	);
	drawTextScreen(
		g_game.player.ammoShells,
		vec2(overlayCanvas.width / 2 - 1.55 * cameraScale, overlayCanvas.height - 1.45 * cameraScale),
		24,
		g_game.colorBlack,
		0,
		g_game.colorBlack,
		"right"
	);

	// ammo
	if (g_game.player.gun) {
		const colorHere = new Color(1, 1, 1);
		const colorGone = new Color(0.3, 0.3, 0.3);
		for (let i = 0; i < g_game.player.gun._maxAmmo; i++) {
			drawTile(
				vec2(pos.x - 0.4 + i * 0.95, pos.y),
				vec2(1),
				g_game.player.gun._ammoIconTile,
				vec2(12),
				i + 1 > g_game.player.gun.ammo ? colorGone : colorHere
			);
		}
	}

	// score
	drawTextScreen(
		g_score.toString(),
		vec2( 2 * cameraScale, overlayCanvas.height - 2 * cameraScale),
		100,
		g_game.colorBlood
	);


}
