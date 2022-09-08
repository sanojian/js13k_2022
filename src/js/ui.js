/** @format */

// this draws the ui on top of everything (in theory)

var ui_fadeTarget = 0;
var ui_fade = 1;
var ui_onFaded = undefined;

const ui_clearColors = [
	[0.5, 0, 0, 0.3],
	[0.25, 0.25, 0, 0.3],
	[0.5, 0.5, 0, 0.3],
	[0, 0, 0.5, 0.3],
	[0, 0.5, 0.5, 0.3],
];

//const ui_clearCol = new Color(0, 0.5, 0.5, 0.5);

const ui_fadeCol = new Color(0.2, 0, 0, 1);

function uiFadeOutAndCall(fadeFunc) {
	if (!ui_onFaded) {
		ui_onFaded = fadeFunc;
		ui_fadeTarget = 1;
	}
}

function uiIsFading() {
	return ui_fade > 0.01;
}

function uiFading() {
	// fade
	const FADE_TIME = 0.5;
	const fadeSpeed = 1 / (FADE_TIME * 60);
	let dFade = ui_fadeTarget == 0 ? -fadeSpeed / 1.5 : fadeSpeed; // fading in looks slower somehow ... strange but true

	ui_fade = clamp(ui_fade + dFade, 0, 1);

	if (ui_fade == 1) {
		ui_fadeTarget = 0;
		if (ui_onFaded) {
			ui_onFaded();
			ui_onFaded = undefined;
		}
	}
}

var ui_flashColor = undefined;
var ui_flashFrames = 0;

function uiflashScreen(colorString, frames) {
	ui_flashColor = colorString;
	ui_flashFrames = frames;
}

function gameRenderPost() {
	// called after objects are rendered
	// draw effects or hud that appear above all objects
	scaleCameraToScreenSize();

	if (g_player) {
		let pos = vec2(0);

		mapMan.renderFOW();

		// scary transforms
		for (let i = 0; i < g_transforms.length; i++) {
			let trans = g_transforms[i];
			drawTile(trans.pos, vec2((60 - trans.life) / 6), trans.tileIndex, TILE_SIZE, new Color(0.8, 0.8, 0.8, 0.15));
			trans.life--;
			if (trans.life <= 0) {
				g_transforms.splice(i, 1);
				i--;
			}
		}

		// score texts
		// for (let i = 0; i < g_corpses.length; i++) {
		// 	g_corpses[i].postRender();
		// }

		// make sure UI can fit onto screen
		let scaleUI = min(1, overlayCanvas.width / (12 * cameraScale));

		pos = vec2(
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
			tileNumbers_facePlayer,
			TILE_SIZE,
			new Color(1, 1, 1, 0.7)
		);

		// total ammo
		const rectCol = new Color(0.2, 0.2, 0.2);
		const boxSize = vec2(1.5, 0.5).scale(scaleUI);
		drawRect(pos.subtract(vec2(3 * scaleUI, -0.6 * scaleUI)), boxSize, rectCol);
		drawRect(pos.subtract(vec2(3 * scaleUI, 0)), boxSize, rectCol);
		drawRect(pos.subtract(vec2(3 * scaleUI, 0.6 * scaleUI)), boxSize, rectCol);

		const iconSize = vec2(0.45).scale(scaleUI);
		drawTile(pos.subtract(vec2(3.5 * scaleUI, -0.6 * scaleUI)), iconSize, tileNumbers_bulletIcon, TILE_SIZE);
		drawTile(pos.subtract(vec2(3.5 * scaleUI, 0)), iconSize, tileNumbers_rifleAmmoIcon, TILE_SIZE);
		drawTile(pos.subtract(vec2(3.5 * scaleUI, 0.6 * scaleUI)), iconSize, tileNumbers_shellIcon, TILE_SIZE);

		const txtSize = 0.4 * scaleUI;
		const txtCol = new Color(0.9, 0.9, 0.9);
		const txtDx = 2.5 * scaleUI;
		let y = pos.y - 0.025;

		drawText(g_player.ammoBullets, vec2(pos.x - txtDx, y + 0.6 * scaleUI), txtSize, txtCol, -1, undefined, "right");
		drawText(g_player.ammoRifle, vec2(pos.x - txtDx, y), txtSize, txtCol, -1, undefined, "right");
		drawText(g_player.ammoShells, vec2(pos.x - txtDx, y - 0.6 * scaleUI), txtSize, txtCol, -1, undefined, "right");

		// ammo
		const colorGone = new Color(1, 1, 1, 0.2);
		if (g_player.gun) {
			for (let i = 0; i < g_player.gun._maxAmmo; i++) {
				drawTile(
					vec2(pos.x - 1.4 * scaleUI + i * 0.95 * scaleUI, pos.y),
					vec2(scaleUI),
					g_player.gun._ammoIconTile,
					TILE_SIZE,
					i + 1 > g_player.gun.ammo ? colorGone : colorWhite
				);
			}
		}

		// score
		drawTextWithOutline(
			g_score.toString(),
			vec2(overlayCanvas.width - 2 * cameraScale * scaleUI, overlayCanvas.height - 1 * cameraScale * scaleUI),
			100 * scaleUI,
			colorBlood
		);
	}

	textsDraw();

	// FADE THE SCREEN

	let ui_clearCol = new Color(...ui_clearColors[g_level % levelDefs.length]);

	let col = ui_clearCol.lerp(ui_fadeCol, ui_fade);

	let color = col.getHex();
	let alpha = col.a;

	if (ui_flashFrames > 0) {
		ui_flashFrames--;
		alpha = 0.5;
		color = ui_flashColor;
	}

	overlayContext.rect(0, 0, mainCanvasSize.x, mainCanvasSize.y);
	overlayContext.globalAlpha = alpha;
	overlayContext.fillStyle = color;
	overlayContext.fill();

	overlayContext.globalAlpha = 0.5;

	drawPushers();
}
