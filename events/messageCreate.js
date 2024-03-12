const { random } = require('../util/random');
const { doesContain, containsAtAll, containsExactly } = require('../util/doesContain');
const { checkDubs, dubsLeaderboard } = require('../util/checkDubs');
const { timeoutLeaderboard } = require('../util/updateTimeout');
const { requestBlend, immortalize } = require('../util/sendBlend');
const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	execute(message) {
		const all_emojis = message.guild.emojis.cache.map(e => e.toString());
		const pete_emojis = message.client.guilds.cache.get('344317039160197124').emojis.cache.map(e => e.toString());
		const EDF = "To save our mother earth from any alien attack";

		// 1 in 25 chance to react
		const rand2 = random(0, 50);
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

		if (doesContain(message.content, 'metal') && doesContain(message.content, 'gear')) {
			message.reply(`This game series really is a cut above the rest, in terms of quality. I played 1-3 in High School (2 came out when I was in my first year, Twin Snakes my third year, and Snake Eater fall of my final year), admist the post-9/11 War on Terror.\n\nI kinda gave up after 4, and I felt the games had said their piece and I was ready to move on. When GZ and Phantom Pain dropped, I barely paid any attention. I didn't even know there was another title I'd missed before them. Then one day it was on sale, and I knew I couldn't skip the last chapter of this tale. That game floored me. Cemented my appreciation for what Kojima was trying to get across for years, and then it left me with my own titular Phantom Pain. The series was done. What had I just done as Venom in this final chapter? I had become a genocidal terrorist because funny Japanese auteur man gave me the option. What did I miss in Peace Walker? I had to play them all again, from the very start. So I loaded up MGS3 and started MG1 and MG2. I replayed the series over the course of 2019. And then I did so again last year. These games were super well made.`)
		}

		if (containsExactly(message.content, EDF)) {
			message.reply("FROM VICIOUS GIANT INSECTS WHO HAVE ONCE AGAIN COME BACK");
		}

		if (doesContain(message.content, 'EDF')) {
			message.reply("EDF! EDF!");
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
