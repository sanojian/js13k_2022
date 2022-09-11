

function fx_addSpark (pos) {
	makeParticles(pos, .1, colorSpark, 0.06)

	// for (let i = 0; i < 4; i++) {
	// 	g_sparks.push({
	// 		pos: pos.copy(),
	// 		angle: rand(PI * 2),
	// 		life: 6,
	// 	});
	// }
	
}

function fx_shakeScreen (amt) {
	g_screenShake = vec2(rand(-amt, amt), rand(-amt, amt));
}

function fx_updateScreenShake () {

	if (g_screenShake.length() > 0.01) {
		g_screenShake = g_screenShake.multiply(vec2(-0.7));
	}

}

function fx_splatter(pos) {
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




