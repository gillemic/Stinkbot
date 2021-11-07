module.exports = {
	name: 'capitalize',
	capitalize(message) {
		// todo
		const args = message.split(' ');
		for (const i in args) {
			args[i] = args[i][0].toUpperCase() + args[i].slice(1);
		}
		const capitalized_text = args.join(' ');
		return capitalized_text;
	},
};