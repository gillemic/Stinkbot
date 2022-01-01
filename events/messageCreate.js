const { random } = require('../util/random');
const { doesContain } = require('../util/doesContain');

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

		const message_id = message.id;

		const last_digit = parseInt(message_id[message_id.length - 1]) % 10;

		let count = 1;

		while (last_digit === parseInt(message_id[message_id.length - (count + 1)])) {
			count++;
		}

		if (count > 1) {
			switch (count) {
			case 2:
				message.reply(`MessageID: ${message_id} Holy shit! You got dubs`);
				break;
			case 3:
				message.reply(`MessageID: ${message_id} Holy shit! You got trips`);
				break;
			case 4:
				message.reply(`MessageID: ${message_id} Holy shit! You got quads`);
				break;
			case 5:
				message.reply(`MessageID: ${message_id} Holy shit! You got quints`);
				break;
			default:
				message.reply(`MessageID: ${message_id} WOOOOOAAAAAHHHHH!!!!`);
				break;
			}
		}

		if (message.channel.id === '358699161551634442') {
			// stink chat
			return;
		}

		if (doesContain(message.content, 'thank') && doesContain(message.content, 'stinkbot')) {
			message.reply('You\'re welcome :relieved:');
		}

		// map all emojis in server the message was sent
		// const all_emojis = message.guild.emojis.cache.map(e => e.toString());
		// const rand = random(0, all_emojis.length - 1);

		// // 1 in 10 chance to react
		// const rand2 = random(0, 10);
		// if (rand2 === 2) {
		// 	message.react(all_emojis[rand]);
		// }
	},
};
