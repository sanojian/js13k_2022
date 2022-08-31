/** @format */

// this draws the ui on top of everything (in theory)

var ui_fadeTarget = 0;
var ui_fadeBlacness = 1;
var ui_onFaded = undefined;

function uiFadeOutAndCall(fadeFunc) {
	if (!ui_onFaded) {
		ui_onFaded = fadeFunc;
		ui_fadeTarget = 1;
	}
}

function uiIsFading() {
	return ui_fadeBlacness > 0.01;
}

function uiFading() {
	// fade
	const FADE_TIME = 1;
	const fadeSpeed = 1 / (FADE_TIME * 60);
	let dFade = ui_fadeTarget == 0 ? -fadeSpeed : fadeSpeed;

	ui_fadeBlacness = clamp(ui_fadeBlacness + dFade, 0, 1);

	if (ui_fadeBlacness == 1) {
		ui_fadeTarget = 0;
		if (ui_onFaded) {
			ui_onFaded();
			ui_onFaded = undefined;
		}
	}
}

function gameRenderPost() {
	// called after objects are rendered
	// draw effects or hud that appear above all objects
	scaleCameraToScreenSize();

	if (g_game.player) {
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

		// score texts
		for (let i = 0; i < g_game.corpses.length; i++) {
			g_game.corpses[i].postRender();
		}

		// make sure UI can fit onto screen
		let scaleUI = min(1, overlayCanvas.width / (12 * cameraScale));

		let pos = vec2(
			cameraPos.x - overlayCanvas.width / (cameraScale * 2) + 6 * scaleUI,
			cameraPos.y - overlayCanvas.height / (cameraScale * 2) + 1 * scaleUI
		);

		// UI background
		drawRect(pos, vec2(8, 2).scale(scaleUI), new Color(0.3, 0.3, 0.3, 0.4));

		// portrait
		let scaleX = frame % 240 > 200 ? -2 : 2;
		drawTile(
			vec2(pos.x - 5 * scaleUI, pos.y),
			vec2(scaleX, 2).scale(scaleUI),
			g_game.tileNumbers.facePlayer,
			TILE_SIZE,
			new Color(1, 1, 1, 0.7)
		);

		// total ammo
		const rectCol = new Color(0.2, 0.2, 0.2);
		const boxSize = vec2(1.5, 0.5).scale(scaleUI);
		drawRect(vec2(pos.x - 3 * scaleUI, pos.y + 0.6 * scaleUI), boxSize, rectCol);
		drawRect(vec2(pos.x - 3 * scaleUI, pos.y), boxSize, rectCol);
		drawRect(vec2(pos.x - 3 * scaleUI, pos.y - 0.6 * scaleUI), boxSize, rectCol);

		const iconSize = vec2(0.45).scale(scaleUI);
		drawTile(vec2(pos.x - 3.5 * scaleUI, pos.y + 0.6 * scaleUI), iconSize, g_game.tileNumbers.bulletIcon, TILE_SIZE);
		drawTile(vec2(pos.x - 3.5 * scaleUI, pos.y), iconSize, g_game.tileNumbers.rifleAmmoIcon, TILE_SIZE);
		drawTile(vec2(pos.x - 3.5 * scaleUI, pos.y - 0.6 * scaleUI), iconSize, g_game.tileNumbers.shellIcon, TILE_SIZE);

		const txtSize = 0.4 * scaleUI;
		const txtCol = new Color(0.9, 0.9, 0.9);
		const txtDx = 2.5 * scaleUI;
		let y = pos.y - 0.025;

		drawText(
			g_game.player.ammoBullets,
			vec2(pos.x - txtDx, y + 0.6 * scaleUI),
			txtSize,
			txtCol,
			-1,
			undefined,
			"right"
		);
		drawText(g_game.player.ammoRifle, vec2(pos.x - txtDx, y), txtSize, txtCol, -1, undefined, "right");
		drawText(g_game.player.ammoShells, vec2(pos.x - txtDx, y - 0.6 * scaleUI), txtSize, txtCol, -1, undefined, "right");

		// ammo
		const colorHere = new Color(1, 1, 1);
		const colorGone = new Color(0.3, 0.3, 0.3);
		if (g_game.player.gun) {
			for (let i = 0; i < g_game.player.gun._maxAmmo; i++) {
				drawTile(
					vec2(pos.x - 1.4 * scaleUI + i * 0.95 * scaleUI, pos.y),
					vec2(scaleUI),
					g_game.player.gun._ammoIconTile,
					TILE_SIZE,
					i + 1 > g_game.player.gun.ammo ? colorGone : colorHere
				);
			}
		}

		// score
		drawTextScreen(
			g_score.toString(),
			vec2(overlayCanvas.width - 2 * cameraScale * scaleUI, overlayCanvas.height - 1 * cameraScale * scaleUI),
			100 * scaleUI,
			g_game.colorBlood
		);
	}

	textsDraw();

	drawTileScreenSpace(vec2(0), vec2(10000), -1, tileSizeDefault, new Color(0, 0, 0, ui_fadeBlacness));
}
