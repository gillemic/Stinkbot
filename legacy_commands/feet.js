const { random } = require('../util/random');

module.exports = {
	name: 'feet',
	description: 'sends feet',
	args: false,
	usage: 'just say feet',
	execute(message, args) {
		console.log(args);
		const rand = random(1, 15);
		message.channel.send({ files: [`./img/hopps/feet${rand}.jpg`] });
	},
};