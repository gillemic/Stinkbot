const { random } = require('../util/random');

const feastArray = ['img/slob/pizza.gif', 'img/slob/hotdog.gif', 'img/slob/hotdog2.gif', 'img/slob/burger.gif', 'img/slob/wing.gif'];

module.exports = {
	name: 'slob',
	description: 'sends the king',
	args: false,
	usage: 'slob - sends a random food\n \
			slob [pizza, burger, hot dog] - sends the specified food\n \
			slob feast - awwww yeahhhhhhh',
	execute(message, args) {
		if (!args.length) {
			const i = random(0, 4);
			message.channel.send({ files: [feastArray[i]] });
		}
		// console.log('\n\n' + buddyNames);
		const food = args.join('');

		if (food === 'hotdog' || food === 'hotdog2') {
			const dawgs = ['img/slob/hotdog.gif', 'img/slob/hotdog2.gif'];
			message.channel.send({ files: dawgs });
		}
		else if (feastArray.includes(`img/slob/${food}.gif`)) {
			message.channel.send({ files: [`img/slob/${food}.gif`] });
		}
		else if (food === 'feast') {
			message.channel.send({ files: feastArray });
		}
	},
};