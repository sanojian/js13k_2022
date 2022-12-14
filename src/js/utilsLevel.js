
function getNextEnemySpawnClass() {
	let chance = 0;
	let rando = rand();
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

function generateMapFromLevel(level) {

	let mapToCopy = mapData[level];

	let newMap = {
		w: mapToCopy.h,
		h: mapToCopy.w,
		data: []
	};

	for (let y = 0; y < newMap.h; y++) {
		for (let x = 0; x < newMap.w; x++) {
			newMap.data[(newMap.w - 1 - x) + newMap.w * (newMap.h - 1 - y)] = mapToCopy.data[y + mapToCopy.w * x];
		}
	}

	mapData.push(newMap);

}

function getAmmoForGunType(gunType) {
	
	if (gunType == tileNumbers_rifle) {
		return tileNumbers_boxRifleAmmo;
	} else if (gunType == tileNumbers_shotgun) {
		return tileNumbers_boxShells;
	}
	
	return tileNumbers_boxBullets;
}