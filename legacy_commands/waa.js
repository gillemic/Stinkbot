module.exports = {
	name: 'waa',
	description: 'waa',
	args: false,
	usage: 'it\'s just waa bro',
	async execute(message, args) {
		console.log(args);
		message.channel.send({ files: ['./img/waa.js'] });
	},
};