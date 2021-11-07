const { SlashCommandBuilder } = require('@discordjs/builders');
const villager_list = require('../villagers.json');
const { capitalize } = require('../util/capitalize');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('villager')
		.setDescription('Request info about a villager')
		.addSubcommand(subcommand =>
			subcommand.setName('bio')
				.setDescription('the bio for this villager')
				.addStringOption(option =>
					option.setName('villager')
						.setDescription('the villager to send')
						.setRequired(true))),
	async execute(interaction) {
		const villager = capitalize(interaction.options.getString('villager'));

		if (villager_list[villager]) {
			const index = Object.keys(villager_list).indexOf(villager);
			let reply = `Name: ${villager}\n\n`;
			if (index !== -1) {
				for (const prop in villager_list[villager]) {
					reply += `${prop}: ${villager_list[villager][prop]}\n`;
				}
				const url = `./img/villagers/${villager}.png`;
				interaction.reply({ content: reply.slice(0, -1), files: [url] });
			}
		}
		else {
			interaction.reply(`Who's ${villager}?`);
		}
		// interaction.reply('Alright!');
	},
};