const { SlashCommandBuilder } = require('@discordjs/builders');
const { countImages } = require('../util/createBlend.js');
const { loadAndProcessMyLocalImage } = require('../util/generateImage');
const { containsAtAll } = require('../util/doesContain');

const banned_words = ['blackface', 'black face', 'darkface', 'dark face', 'caricature', 'racist', 'racism', 'shaughn', 'shaaughn', 'squigger', 'squigga'];
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
		await interaction.deferReply();

		const prompt = interaction.options.getString('prompt');

		// Check if query is too long
		if (prompt.length > 100) {
			await interaction.editReply({ content: 'DALL·E: Invalid query\nQuery is too long.', ephemeral: true });
			return;
		}

		// check if conor or justin between banned hours
		/* if (interaction.user.id in banned_users):
			await interaction.response.send_message("You are banned from blending fr", ephemeral=True)
			return*/

		// check if banned words
		const query = prompt.toLowerCase();
		if (containsAtAll(query, banned_words) && banned_users.includes(interaction.user.id)) {
			await interaction.editReply({ content: 'Nope.', ephemeral: true });
			return;
		}

		const folder = await countImages(prompt, interaction.id);

		await loadAndProcessMyLocalImage(folder);

		await interaction.editReply({ files: [`${folder}/final.png`], content: prompt });
	},
};