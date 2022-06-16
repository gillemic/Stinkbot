module.exports = {
	name: 'doesContain',
	doesContain(message, text) {
		// todo
		const args = message.toLowerCase().replace(/[.,/#!$%^&*;:{}=_`~()?]/g, '').split(' ');

		return args.includes(text.toLowerCase());
	},
	containsAny(message, array) {
		// todo
		const args = message.toLowerCase().replace(/[.,/#!$%^&*;:{}=_`~()?]/g, '').split(' ');
		const intersection = array.filter(element => args.includes(element));

		return intersection.length ? true : false;
	},
};