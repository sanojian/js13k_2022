const STATE_CLICK_TO_START = 0;
const STATE_PLAYING = 1;
const STATE_DEAD = 2;

let g_game = {

	CAMERA_LAG: 3,

	player: null,
	enemies: [],
	walls: [],


	worldMap: [
		[10, 9,  9,  9, 9, 10],
		[10,  ,   ,   ,  , 10],
		[10,  ,   ,   ,  , 10],
		[10,  ,   ,   ,  , 10],
		[9,  9,   ,   , 9,  9],
		[  ,   ,   ,   ,  ,  ],
		[  ,   ,   ,   ,  ,  ],
		[ 9,   ,   ,   ,  ,  ],
		[  ,  9,   ,   ,  ,  ],
		[  ,   ,  9, 10,  ,  ],
		[  ,   ,   , 10,  ,  ],
		[  ,   ,   ,  9,  9, ],
	],

	state: STATE_CLICK_TO_START
};