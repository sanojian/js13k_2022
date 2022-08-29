/** @format */

var songData = [
	[
		[, 0, 43, 0.01, , 0.3, 2, , , , , , , , , 0.02, 0.01], // 0 bass
		[10, 0, 170, 0.003, , 0.008, , 0.97, -35, 53, , , , , , 0.1], // 1 base drum
		[0.8, 0, 270, , , 0.12, 3, 1.65, -2, , , , , 4.5, , 0.02], // 2 snare

		// [, 0, 86, , , , , 0.7, , , , 0.5, , 6.7, 1, 0.05], // 3 hh
		// [, 0, 77, , , 0.7, 2, 0.41, , , , , , , , 0.06], // 4 bass
		// [, 0, 41, , 0.05, 0.4, 2, 0, , , 9, 0.01, , , , 0.08, 0.02], // 5 bass
		// [, 0, 2200, , , 0.04, 3, 2, , , 800, 0.02, , 4.8, , 0.01, 0.1], // 6 hh / click
		// [0.3, 0, 16, , , 0.3, 3], // 7 bass
	],
	[[]],
	[0], // patterns
	80,
];

function unfoldPattern(instrument, pan, startnode, pattern, starts) {
	var nodes = [];
	nodes.push(instrument);
	nodes.push(pan);

	for (const s of starts) {
		for (const b of pattern) {
			nodes.push(startnode + b + s);
		}
	}

	return nodes;
}

function createMinorIssues() {
	// prettier-ignore
	let chordStarts = [
		2, 2, 2, 2,
		0, 0, 0, 0,
		2, 2, 2, 2,
		0, 0, 0, 0,
		7, 7, 7, 7,
		5, 5, 5, 5,
		9, 9, 11, 11,
		13, 15, 17, 19,
		undefined, undefined, undefined, undefined 
	];

	let bassPattern = [0, 12, 14, 15, 0, 12, 15, 14];

	let bassNodes = unfoldPattern(0, -0.1, 7, bassPattern, chordStarts);
	songData[1][0].push(bassNodes);

	let drumStarts = Array(chordStarts.length / 2).fill(0);

	let bdPattern = [0, , , , 0, 0, , , 0, , , , 0, 0, , ,];
	songData[1][0].push(unfoldPattern(1, 0, 8, bdPattern, drumStarts));

	let snarePattern = [, , 0, , , , 0, , , , 0, , , , 0, 0];
	songData[1][0].push(unfoldPattern(2, 0.1, 7, snarePattern, drumStarts));
}

var vol = 0.4; //0.5; //.7;

var music;
var source;

function musicStart() {
	//createBlues();
	createMinorIssues();

	if (music) return;

	music = new Music(songData);
	source = music.play(vol);
}

function musicResume() {
	if (!music) return;

	if (!source) {
		source = music.play(vol);
	}
}
