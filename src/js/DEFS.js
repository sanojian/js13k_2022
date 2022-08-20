/** @format */

const STATE_CLICK_TO_START = 0;
const STATE_PLAYING = 1;
const STATE_DEAD = 2;
const STATE_WON = 3;

const TILE_SIZE = vec2(12);
const MOB_SIZE = vec2(11, 12);

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
		npc: 2,
		facePlayer: 4,
		faceZombie: 5,
		faceVampire: 6,
		pistol: 8,
		shotgun: 9,
		shellIcon: 10,
		bulletIcon: 11,
		beefyHero: 12,
		beefyZombie: 13,
		wall: 16,
		roof: 17,
		stone: 18,
		tree: 20,
		door: 21,
	},
};
