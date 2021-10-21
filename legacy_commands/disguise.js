module.exports = {
	name: 'disguise',
	description: 'Stinkbot whom?',
	args: false,
	usage: 'just say disguise',
	async execute(message, args) {
		console.log(args);
		const bot = message.client.user;

		bot.setUsername('Petebot');
		bot.setAvatar('img/petey.jpg');
		bot.setActivity('Fallout 76', { type: 'STREAMING' });

		// message.channel.reply({ content: 'No Stinkbot here, no sir', ephemeral: true });
	},
};