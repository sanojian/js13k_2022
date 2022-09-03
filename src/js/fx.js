
const fx = {

	addSpark: function (pos) {
		makeParticles(pos, .1, colorSpark, 0.06);

		// for (let i = 0; i < 4; i++) {
		// 	g_sparks.push({
		// 		pos: pos.copy(),
		// 		angle: rand(PI * 2),
		// 		life: 6,
		// 	});
		// }
		
	},

	shakeScreen: function (amt) {
		g_screenShake = vec2(rand(-amt, amt), rand(-amt, amt));
	},

	updateScreenShake: function () {

		if (g_screenShake.length() > 0.01) {
			g_screenShake = g_screenShake.multiply(vec2(-0.7));
		}

	}

};

