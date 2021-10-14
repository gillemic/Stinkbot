const { random } = require('../util/random');

module.exports = {
	name: 'messageCreate',
	execute(message) {
		console.log(`${message.author.username} sent a message`);

		// map all emojis in server the message was sent
		const all_emojis = message.guild.emojis.cache.map(e => e.toString());
		const rand = random(0, all_emojis.length - 1);

		// 1 in 9 chance to react
		const rand2 = random(0, 9);
		if (rand2 === 2) {
			message.react(all_emojis[rand]);
		}
	},
};