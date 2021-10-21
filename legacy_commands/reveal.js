module.exports = {
	name: 'reveal',
	description: 'Reveal petebot for what he really is',
	args: false,
	usage: '',
	async execute(message, args) {
		console.log(args);
		const bot = message.client.user;

		bot.setUsername('Stinkbot');
		bot.setAvatar('img/stinkbot.jpg');
		bot.setActivity({ name: 'Conor Sucks' });
	},
};