const { random } = require('../util/random');
const { doesContain } = require('../util/doesContain');
const { checkDubs, dubsLeaderboard } = require('../util/checkDubs');
const { timeoutLeaderboard } = require('../util/updateTimeout');

module.exports = {
	name: 'messageCreate',
	execute(message) {
		const all_emojis = message.guild.emojis.cache.map(e => e.toString());
		const rand = random(0, all_emojis.length - 1);

		// 1 in 10 chance to react
		const rand2 = random(0, 25);
		if (rand2 === 2) {
			message.react(all_emojis[rand]);
		}

		if (doesContain(message.content, '-baseball')) {
			message.channel.send({ files: ['./img/OTAB.mp4'] });
		}

		if (message.author.bot) {
			return;
		}

		if (doesContain(message.content, '-dubsleaderboard')) {
			dubsLeaderboard(message);
			return;
		}

		if (doesContain(message.content, '-timeoutleaderboard')) {
			timeoutLeaderboard(message);
			return;
		}

		if (message.channel.id === '358699161551634442') {
			// stink chat
			checkDubs(message);
			return;
		}

		if (doesContain(message.content, 'deletemepls')) {
			message.delete();
		}

		if (doesContain(message.content, 'thank') && doesContain(message.content, 'stinkbot')) {
			message.reply('You\'re welcome :relieved:');
		}
	},
};
