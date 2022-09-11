
const fx = {

	addSpark: function (pos) {
		makeParticles(pos, .1, colorSpark, 0.06)

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

	},

	splatter(pos) {
		// splatter on floor
		let splatterPattern = {
			pos: pos.add(randInCircle(0.2)),
			color: colorBlood.scale(rand()),
			pattern: [],
		};
		for (let i = 0; i < 16; i++) {
			splatterPattern.pattern.push(rand() > 0.5 ? 1 : 0);
		}
		g_splatter.push(splatterPattern);
	}


};

