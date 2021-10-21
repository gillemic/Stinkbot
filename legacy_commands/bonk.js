module.exports = {
	name: 'bonk',
	description: 'booooonk',
	args: false,
	usage: 'it\'s just bonk bro',
	async execute(message, args) {
		console.log(args);
		message.channel.send({ files: ['./img/yowch.mp4'] });
	},
};