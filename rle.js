/** @format */

function runLengthEncode(input) {
	let o = [];

	let count = 1;
	let data = undefined;

	for (const e of input) {
		if (e != data) {
			if (data != undefined) {
				o.push(data.toString());
				o.push(count.toString());
			}

			data = e;
			count = 1;
		} else {
			count++;
		}
	}
	if (data != undefined) {
		o.push(data.toString());
		o.push(count.toString());
	}

	return o;
}

function runLengthDecode(input) {
	let data = undefined;
	let run = undefined;

	let o = [];

	for (const e of input) {
		if (data == undefined) {
			data = e;
			continue;
		}

		run = e;
		for (let i = 0; i < run; i++) {
			o.push(data);
		}
		data = undefined;
	}

	return o;
}

var a = [0, 0, 0, 2, 2, 1, 1, 0, 0];

console.log("uncoded data:", a);

var data = runLengthEncode(a);

console.log("coded data:", data);

var b = runLengthDecode(data);

console.log("decoded data:", b);
