/** @format */

function makeParticles(pos, time, color, size) {
	let emitter = new ParticleEmitter(
		pos, // pos
		0, // angle
		0, // emitSize
		time, // emitTime
		rand(10, 20), // emitRate
		PI, // emiteConeAngle
		-1, // tileIndex
		undefined, // tileSize
		color || colorBlood, // colorStartA
		color || colorBlood, // colorStartB
		colorBlack, // colorEndA
		colorBlack, // colorEndB
		time * 2, // particleTime
		size || 0.12, // sizeStart
		size || 0.1, // sizeEnd
		rand(0.1, 0.4), // particleSpeed
		2 / 12, // particleAngleSpeed
		0.5, // damping
		1, // angleDamping
		0, // gravityScale
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
