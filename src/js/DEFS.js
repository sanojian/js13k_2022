/** @format */

const STATE_CLICK_TO_START = 0;
const STATE_PLAYING = 1;
const STATE_DEAD = 2;
const STATE_CLEARED = 3;

const ENEMIES_TO_SPAWN = 20;
const ENMIES_MAX_ALIVE = 10;

const TILE_SIZE = vec2(12);
const MINI_TILE_SIZE = vec2(4);
const MOB_SIZE = vec2(11, 12);

var g_CHEATMODE = 0;
let g_score = 0;
let g_level = 0;

let g_soundPickup = new Sound([1, 0.1, 200, 0, 0, 0, 4, 0, 0, 1.2, 50, 0.57, 0, 0, 0, 0.2, 0.19, 0, 0.14, 0]);

let g_game = {
	CAMERA_LAG: 3,
	TILE_LAYER_COLLISION: true,

	player: null,
	enemies: [],
	doors: {},
	splatter: [],
	holes: [],
	sparks: [],
	corpses: [],
	shells: [],
	transforms: [],

	colorBlack: new Color(0, 0, 0),
	colorBlood: new Color(172 / 255, 50 / 255, 50 / 255),
	colorBullet: new Color(251 / 255, 242 / 255, 54 / 255),
	colorBulletCasing: new Color(138 / 255, 111 / 255, 48 / 255),
	colorShell: new Color(217 / 255, 87 / 255, 99 / 255),
	colorShellCasing: new Color(172 / 255, 50 / 255, 50 / 255),
	colorSpark: new Color(251 / 255, 242 / 255, 54 / 255),

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
		faceVampire: 10,
		pistol: 21,
		shotgun: 22,
		shellIcon: 23,
		bulletIcon: 24,
		boxBullets: 26,
		boxShells: 27,
		rifle: 28,
		door: 43,
	},
	miniTileNumbers: {
		vampireMiniFace: 3 * 7 * 2 * 3 + 0,
	},
};
