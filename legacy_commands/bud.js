const { random } = require('../util/random');
const { randomShuffle } = require('../util/shuffle');

const buddyArray = ['img/buds/mudbud.jpg', 'img/buds/buddha.jpg', 'img/buds/budderball.jpg', 'img/buds/rosebud.jpg', 'img/buds/b-dawg.jpg'];
const entourageArray = ['img/buds/shasta.jpg', 'img/buds/spudnik.jpg', 'img/buds/puppy_paws.jpg', 'img/buds/pip.jpg'];

const everyone = ['mudbud', 'buddha', 'budderball', 'rosebud', 'b-dawg', 'shasta', 'spudnik', 'puppy_paws', 'pip', 'santa_paws', 'ghost_pip'];

module.exports = {
	name: 'bud',
	description: 'sends a bud',
	args: false,
	usage: 'bud - sends a random bud \
					bud [specific bud] - sends that specific bud \
					bud the gang - sends the gang \
					bud the entourage - sends the entourage',
	execute(message, args) {
		if (!args.length) {
			const i = random(0, 5);
			message.channel.send({ files: [buddyArray[i]] });
		}

		const bud = args.join('_');

		if (everyone.includes(bud)) {
			message.channel.send({ files: [`img/buds/${bud}.jpg`] });
		}
		else if (bud === 'the_gang') {
			message.channel.send({ files: randomShuffle(buddyArray) });
		}
		else if (bud === 'the_entourage') {
			message.channel.send({ files: randomShuffle(entourageArray) });
		}
	},
};