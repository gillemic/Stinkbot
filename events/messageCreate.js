const { random } = require('../util/random');
const { doesContain } = require('../util/doesContain');

const bannedUsers = ['105884992055349248'];

module.exports = {
	name: 'messageCreate',
	execute(message) {
		// console.log(`${message.author.username} sent a message`);

		if (message.channel.id === '358699161551634442') {
			// stink chat
			return;
		}

		if (bannedUsers.includes(message.author.id)) {
			return;
		}

		if (doesContain(message.content, 'thank') && doesContain(message.content, 'stinkbot')) {
			message.reply('You\'re welcome :relieved:');
		}

		// map all emojis in server the message was sent
		const all_emojis = message.guild.emojis.cache.map(e => e.toString());
		const rand = random(0, all_emojis.length - 1);

		// 1 in 10 chance to react
		const rand2 = random(0, 10);
		if (rand2 === 2) {
			message.react(all_emojis[rand]);
		}
	},
};