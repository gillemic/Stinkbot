module.exports = {
	name: 'say',
	description: 'make Stinkbot say something',
	args: true,
	usage: 'say [phrase]',
	async execute(message, args) {
		const sentence = args.join(' ');

		message.delete().catch(() => {
			// pass
		});
		// And we get the bot to say the thing:
		message.channel.send(sentence);
	},
};