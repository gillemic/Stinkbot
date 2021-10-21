module.exports = {
	name: 'ping',
	description: 'replies with pong',
	args: false,
	usage: '',
	async execute(message, args) {
		console.log(args);
		await message.reply('Pong!');
	},
};