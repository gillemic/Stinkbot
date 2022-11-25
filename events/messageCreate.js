const { random } = require('../util/random');
const { doesContain, containsAtAll } = require('../util/doesContain');
const { checkDubs, dubsLeaderboard } = require('../util/checkDubs');
const { timeoutLeaderboard } = require('../util/updateTimeout');
const { requestBlend } = require('../util/sendBlend');

module.exports = {
	name: 'messageCreate',
	execute(message) {
		const all_emojis = message.guild.emojis.cache.map(e => e.toString());
		const pete_emojis = message.client.guilds.cache.get('344317039160197124').emojis.cache.map(e => e.toString());

		// 1 in 25 chance to react
		const rand2 = random(0, 25);
		if (rand2 === 2) {
			if (message.client.user.username === 'Petebot') {
				const rand = random(0, pete_emojis.length - 1);
				message.react(pete_emojis[rand]);
			}
			else {
				const rand = random(0, all_emojis.length - 1);
				message.react(all_emojis[rand]);
			}
		}

		if (doesContain(message.content, '-baseball')) {
			message.channel.send({ files: ['./img/OTAB.mp4'] });
		}

		if (message.author.bot) {
			return;
		}

		if (doesContain(message.content, '-dubsleaderboard')) {
			dubsLeaderboard(message);
		}

		if (doesContain(message.content, '-timeoutleaderboard')) {
			timeoutLeaderboard(message);
		}

		if ((doesContain(message.content, 'thank') || doesContain(message.content, 'thanks')) && doesContain(message.content, 'stinkbot')) {
			message.reply('You\'re welcome :relieved:');
		}

		if (message.channel.id === '358699161551634442') {
			// stink chat
			checkDubs(message);
		}
		else {
			requestBlend(message);
		}
	},
};
