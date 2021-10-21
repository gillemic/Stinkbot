const { random } = require('../util/random');
const { doesContain } = require('../util/doesContain');

const bannedUsers = ['105884992055349248'];

module.exports = {
	name: 'messageCreate',
	execute(message) {
		const bot = message.client;

		const all_emojis = message.guild.emojis.cache.map(e => e.toString());
		const rand = random(0, all_emojis.length - 1);

		// 1 in 10 chance to react
		const rand2 = random(0, 25);
		if (rand2 === 2) {
			message.react(all_emojis[rand]);
		}

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

		const args = message.content.split(/ +/);
		const commandName = args.shift().toLowerCase();

		if (!bot.legacy_commands.has(commandName)) return;

		const command = bot.legacy_commands.get(commandName);

		if (command.args && !args.length) {
			let reply = 'You didn\'t provide any arguments';

			if (command.usage) {
				reply += `\nThe proper usage is \`${command.usage}\``;
			}

			return message.channel.send(reply);
		}

		try {
			console.log(`executing ${command.name}`);
			command.execute(message, args);
		}
		catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command!');
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