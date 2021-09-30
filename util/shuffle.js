function createRandomGenerator(seed) {
	// some big numbers
	const a = 5486230734;
	const b = 6908969830;
	const m = 9853205067;
	let x = seed;
	// returns a random value 0 <= num < 1
	// seed is optional. If supplied sets a new seed
	return function(seed2 = x) {
		x = (seed2 * a + b) % m;
		return x / m;
	};
}

function stringTo32BitHash(str) {
	let v = 0;
	for (let i = 0; i < str.length; i += 1) {
		v += str.charCodeAt(i) << (i % 24);
	}
	return v % 0xFFFFFFFF;
}

module.exports = {
	name: 'shuffle',
	randomShuffle(array) {
		let currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (currentIndex !== 0) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	},
	hashShuffle(array, str) {
		const rArr = [];
		const random = createRandomGenerator(stringTo32BitHash(str));
		while (array.length > 1) {
			rArr.push(array.splice(Math.floor(random() * array.length), 1)[0]);
		}
		rArr.push(array[0]);
		return rArr;
	},
};