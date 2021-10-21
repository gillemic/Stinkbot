module.exports = {
	name: 'batman',
	description: 'I am batman',
	args: false,
	usage: 'batman',
	async execute(message, args) {
		console.log(args);
		message.channel.send({ files: ['./img/batman.jpg'] });
	},
};