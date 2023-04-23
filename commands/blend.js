const { SlashCommandBuilder } = require('@discordjs/builders');
const { countImages } = require('../util/createBlend.js');
const { loadAndProcessMyLocalImage } = require('../util/generateImage');
const { containsAtAll } = require('../util/doesContain');
const { Client } = require('craiyon');

const craiyon = new Client();
const banned_words = ['blackface', 'black face', 'darkface', 'dark face', 'caricature', 'racist', 'racism', 'shaughn', 'shaaughn', 'squigger', 'squigga', 'spooks', 'starving', 'child', 'children', 'hungy', 'hungry', 'kid', 'famished'];
const banned_users = ['105884992055349248', '415407957371781123'];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blend')
		.setDescription('Blend it, bitch')
		.addStringOption(option =>
			option.setName('prompt')
				.setDescription('the blend prompt')
				.setRequired(true)),
	async execute(interaction) {
		/*if (interaction.user.id === '105884992055349248') {
			await interaction.editReply({ content: 'Ur done kid', ephemeral: true });
			return;
		}*/

		const message = await interaction.deferReply({ fetchReply: true });

		const prompt = interaction.options.getString('prompt');

		// Check if query is too long
		if (prompt.length > 100) {
			await interaction.editReply({ content: 'DALL·E: Invalid query\nQuery is too long.', ephemeral: true });
			return;
		}

		// Check if banned users
		if (banned_users.contains(interaction.user.id)) {
			await interaction.editReply({ content: 'Nope.', ephemeral: true });
			return;
		}

		// check if banned words
		const query = prompt.toLowerCase();
		if (banned_users.includes(interaction.user.id && containsAtAll(query, banned_words))) {
			await interaction.editReply({ content: 'Nope.', ephemeral: true });
			return;
		}

		const result = await craiyon.generate({
			prompt: prompt
		});

		const folder = await countImages(prompt, result.asBase64(), message.id);

		await loadAndProcessMyLocalImage(folder);

		await interaction.editReply({ files: [`${folder}/final.png`], content: prompt });
	},
};