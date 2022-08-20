/** @format */

const STATE_CLICK_TO_START = 0;
const STATE_PLAYING = 1;
const STATE_DEAD = 2;
const STATE_WON = 3;

const TILE_SIZE = vec2(12);
const MOB_SIZE = vec2(11, 12);

const g_CHEATMODE = 0;

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
		vampire: 2,
		bat: 3,
		beefyHero: 4,
		beefyZombie: 5,
		npc: 6,
		facePlayer: 7,
		faceZombie: 8,
		faceVampire: 9,
		pistol: 14,
		shotgun: 15,
		shellIcon: 16,
		bulletIcon: 17,
		wall: 28,
		roof: 29,
		stone: 30,
		tree: 36,
		door: 37,
	},
};
