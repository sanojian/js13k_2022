/** @format */

const STATE_CLICK_TO_START = 0;
const STATE_PLAYING = 1;
const STATE_DEAD = 2;
const STATE_WON = 3;

let g_game = {
	CAMERA_LAG: 3,
	TILE_LAYER_COLLISION: true,

	player: null,
	enemies: [],
	walls: [],
	doors: {},
	splatter: [],
	corpses: [],

	colorBlood: new Color(172 / 255, 50 / 255, 50 / 255),

	state: STATE_CLICK_TO_START,

	tileNumbers: {
		player: 0,
		zombie: 1,
		facePlayer: 4,
		faceZombie: 5,
		faceVampire: 6,
		npc: 7,
		pistol: 8,
		shotgun: 9,
		bulletIcon: 11,
		bulletPistol: 12,
		bulletShotgun: 13,
		wall: 16,
		roof: 17,
		stone: 18,
		tree: 20,
		door: 21,
	},
};
