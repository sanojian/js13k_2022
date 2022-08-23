
const fx = {

	addSpark: function (pos) {
		for (let i = 0; i < 4; i++) {
			g_game.sparks.push({
				pos: pos.copy(),
				angle: rand(0, Math.PI * 2),
				life: 6,
			});
		}
		
	}

};

