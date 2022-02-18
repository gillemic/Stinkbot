module.exports = {
	name: 'doesContain',
	doesContain(message, text) {
		// todo
		return message.indexOf(text) !== -1;
	},
	containsAny(message, array) {
		// todo
		const check = (word) => message.indexOf(word) !== -1;
		return array.some(check);
	},
};