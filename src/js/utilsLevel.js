function getLevelDef() {
	return levelDefs[g_level % mapData.length];
}

function getNextEnemySpawnClass() {
	let levelDef = getLevelDef();
	let chance = 0;
	let rando = rand(0, 1);
	let type;
	for (let i = 0; i < levelDef.spawns.length; i++) {
		chance += levelDef.spawns[i].chance;
		if (rando <= chance) {
			type = levelDef.spawns[i].type;
			break;
		}
	}
	return type;
}
