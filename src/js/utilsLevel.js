
function getNextEnemySpawnClass() {
	let chance = 0;
	let rando = rand(0, 1);
	let type;
	for (let i = 0; i < g_levelDef.spawns.length; i++) {
		chance += g_levelDef.spawns[i].chance;
		if (rando <= chance) {
			type = g_levelDef.spawns[i].type;
			break;
		}
	}
	return type;
}
