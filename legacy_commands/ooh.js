module.exports = {
	name: 'ooh',
	description: 'across the liiiiiine.... oooooooooohhhhhh',
	args: false,
	usage: 'ooh',
	async execute(message, args) {
		console.log(args);
		message.channel.send({ files: ['./img/ooh.mp4'] });
	},
};