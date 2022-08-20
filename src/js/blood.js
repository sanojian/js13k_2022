/** @format */

function bloodParticles(pos, size) {
	let emitter = new ParticleEmitter(
		pos, // pos
		0, // angle
		0, // emitSize
		size, // emitTime
		rand(10, 20), // emitRate
		PI, // emiteConeAngle
		-1, // tileIndex
		undefined, // tileSize
		new Color(0.8, 0.1, 0.1), // colorStartA
		g_game.colorBlood, // colorStartB
		new Color(0, 0, 0, 0), // colorEndA
		new Color(0, 0, 0, 0), // colorEndB
		1, // particleTime
		0.12, // sizeStart
		0.1, // sizeEnd
		rand(0.2, 0.8), // particleSpeed
		2 / 12, // particleAngleSpeed
		0.5, // damping
		1, // angleDamping
		-0.6, // gravityScale
		PI, // particleCone
		0.1, //fadeRate,
		0.5, // randomness
		false, // collide
		false, // additive
		false, // randomColorLinear
		1e8 // renderOrder
	);

	return emitter;
}
