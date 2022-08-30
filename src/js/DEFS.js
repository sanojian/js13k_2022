/** @format */

const STATE_CLICK_TO_START = 0;
const STATE_PLAYING = 1;
const STATE_DEAD = 2;
const STATE_CLEARED = 3;

const TILE_SIZE = vec2(12);
const MINI_TILE_SIZE = vec2(4);
const TILES_PER_SCREEN = 12;

fontDefault = "Courier";

// "Courier";
// "American Typewriter";
// "Courier New";
// "Luminari"

var g_CHEATMODE = 0;
let g_score = 0;
let g_level = 0;
let g_levelDef = undefined;

let g_soundPickup = new Sound([1, 0.1, 200, 0, 0, 0, 4, 0, 0, 1.2, 50, 0.57, 0, 0, 0, 0.2, 0.19, 0, 0.14, 0]);

let g_screenShake = vec2(0);

let g_game = {
	difficulty: 0,

	player: null,
	enemies: [],
	doors: {},
	splatter: [],
	holes: [],
	sparks: [],
	corpses: [],
	shells: [],
	moss: [],
	transforms: [],

	colorBlack: new Color(0, 0, 0),
	colorWhite: new Color(1, 1, 1),
	colorBlood: new Color(172 / 255, 50 / 255, 50 / 255),
	colorBullet: new Color(251 / 255, 242 / 255, 54 / 255),
	colorBulletCasing: new Color(138 / 255, 111 / 255, 48 / 255, 0.8),
	colorShell: new Color(217 / 255, 87 / 255, 99 / 255),
	colorShellCasing: new Color(172 / 255, 50 / 255, 50 / 255, 0.8),
	colorRifleRound: new Color(0 / 255, 255 / 255, 255 / 255),
	colorRifleRoundCasing: new Color(0 / 255, 255 / 255, 255 / 255),

	colorSpark: new Color(251 / 255, 242 / 255, 54 / 255),

	state: STATE_CLICK_TO_START,

	tileNumbers: {
		player: 0,
		zombie: 1,
		vampire: 2,
		bat: 3,
		ghost: 4,
		beefyZombie: 5,
		facePlayer: 6,
		faceZombie: 7,
		faceVampire: 8,
		pistol: 15,
		shotgun: 16,
		shellIcon: 17,
		bulletIcon: 18,
		rifleAmmoIcon: 19,
		rifle: 20,
		boxBullets: 21,
		boxShells: 22,
		boxRifleAmmo: 23,
		floorStone: 27,
		door: 31,
		floorGrass: 33,
	},
	miniTileNumbers: {
		miniFacePlayer: 15 * 6 + 0,
		miniFaceZombie: 15 * 6 + 1,
		miniFaceVampire: 15 * 6 + 2,
		miniFaceGhost: 15 * 6 + 3,
		moss: 15 * 7 + 0,
	},
};

const mobDefs = {
	Zombie: {
		hp: 1,
		hpGainPerlevel: 1,
		maxSpeed: 0.5,
	},
	BossZombie: {
		hp: 22,
		hpGainPerlevel: 5,
		maxSpeed: 0.5,
	},
	Vampire: {
		hp: 1,
		hpGainPerlevel: 0.5,
		maxSpeed: 1,
		addTransformHp: 5,
	},
	Ghost: {
		hp: 1,
		hpGainPerlevel: 0.5,
		maxSpeed: 1,
	},
};

const levelDefs = [
	{
		// start
		map: 0,
		floorTile: g_game.tileNumbers.floorGrass,
		enemiesToSpawn: 8,
		enemiesMaxAlive: 3,
		spawns: [{ type: "Zombie", chance: 1 }],
	},
	{
		// intro to vampires
		map: 1,
		floorTile: g_game.tileNumbers.floorStone,
		enemiesToSpawn: 8,
		enemiesMaxAlive: 3,
		spawns: [
			{ type: "Zombie", chance: 0.5 },
			{ type: "Vampire", chance: 0.5 },
		],
	},
	{
		// intro to ghosts
		map: 1,
		floorTile: g_game.tileNumbers.floorStone,
		enemiesToSpawn: 12,
		enemiesMaxAlive: 4,
		spawns: [
			{ type: "Zombie", chance: 0.5 },
			{ type: "Ghost", chance: 0.5 },
		],
	},
	{
		// final boss
		map: 2,
		floorTile: g_game.tileNumbers.floorStone,
		enemiesToSpawn: 16,
		enemiesMaxAlive: 5,
		spawns: [
			{ type: "Zombie", chance: 0.4 },
			{ type: "Vampire", chance: 0.3 },
			{ type: "Ghost", chance: 0.3 },
		],
	},
];
