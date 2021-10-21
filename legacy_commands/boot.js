module.exports = {
	name: 'boot',
	description: 'boot',
	args: false,
	usage: 'it\'s just boot bro',
	async execute(message, args) {
		console.log(args);
		message.channel.send({ files: ['./img/boot.jpg'] });
	},
};