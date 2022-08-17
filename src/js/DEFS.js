/** @format */

const STATE_CLICK_TO_START = 0;
const STATE_PLAYING = 1;
const STATE_DEAD = 2;
const STATE_WON = 3;

let g_game = {
	CAMERA_LAG: 3,

	player: null,
	enemies: [],
	walls: [],
	splatter: [],

	state: STATE_CLICK_TO_START,

	tileNumbers: {
		player: 0,
		pistol: 3,
		bulletPistol: 4,
		bulletIcon: 5,
		zombie: 6,
		wall: 9,
		roof: 10,
		stone: 11,
		facePlayer: 12,
		faceZombie: 13,
		faceVampire: 14,
		shotgun: 15,
		bulletShotgun: 16
	}
};
