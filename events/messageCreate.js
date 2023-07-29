const { random } = require('../util/random');
const { doesContain, containsAtAll } = require('../util/doesContain');
const { checkDubs, dubsLeaderboard } = require('../util/checkDubs');
const { timeoutLeaderboard } = require('../util/updateTimeout');
const { requestBlend, immortalize } = require('../util/sendBlend');
const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
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
			message.channel.send({ files: [{ name: 'OhThatsABaeball.mp4', attachment: './img/OTAB.mp4' }] });
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
		else if (message.channel.id === '909957374045995038') {
			// blend channel
			if (doesContain(message.content, 'keep')) {
				immortalize(message);
			}
			else {
				requestBlend(message);
			}
		}

		if (doesContain(message.content, 'spin') && doesContain(message.content, 'wheel')) {
			// already timed out from quints
			if (message.member.isCommunicationDisabled() || !(message.member.moderatable)) {
				return;
			}
			else {
				message.member.timeout(1000 * 60 * 10, 'You know what you did');
			}
		}
	},
};
